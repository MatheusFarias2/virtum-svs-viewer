/**
 * Virtum Instant Open
 *
 * Pequena máquina de estados para medir a abertura percebida sem misturar a
 * instrumentação com o pipeline OpenSlide/OpenSeadragon. O princípio é simples:
 * cabeçalho -> pirâmide -> viewer aberto -> primeiro tile -> primeiro pixel ->
 * tarefas secundárias. Cada marco só avança uma vez.
 */
export class InstantOpenEngine {
  constructor(options = {}) {
    this.now = typeof options.now === 'function' ? options.now : () => performance.now();
    this.onChange = typeof options.onChange === 'function' ? options.onChange : () => {};
    this.reset({ emit: false });
  }

  reset({ emit = true } = {}) {
    this.startedAt = 0;
    this.mode = 'standard';
    this.fileSize = 0;
    this.stage = 'standby';
    this.marks = {};
    this.firstPixelSource = '';
    this.deferredStarted = false;
    this.deferredDone = false;
    if (emit) this._emit();
  }

  begin({ mode = 'standard', fileSize = 0 } = {}) {
    this.startedAt = this.now();
    this.mode = mode;
    this.fileSize = Number(fileSize) || 0;
    this.stage = 'received';
    this.marks = { received: 0 };
    this.firstPixelSource = '';
    this.deferredStarted = false;
    this.deferredDone = false;
    this._emit();
    return this.snapshot;
  }

  mark(name, stage = name) {
    if (!this.startedAt || Object.prototype.hasOwnProperty.call(this.marks, name)) return this.snapshot;
    this.marks[name] = Math.max(0, this.now() - this.startedAt);
    this.stage = stage;
    this._emit();
    return this.snapshot;
  }

  markHeader() { return this.mark('header', 'header'); }
  markPyramid() { return this.mark('pyramid', 'pyramid'); }
  markViewerOpen() { return this.mark('viewerOpen', 'first-pixel-lane'); }
  markFirstTile() { return this.mark('firstTile', 'drawing'); }

  markFirstPixel(source = 'tile') {
    if (Object.prototype.hasOwnProperty.call(this.marks, 'firstPixel')) return this.snapshot;
    this.firstPixelSource = source;
    return this.mark('firstPixel', 'visible');
  }

  markDeferredStart() {
    if (this.deferredStarted) return this.snapshot;
    this.deferredStarted = true;
    return this.mark('deferredStart', 'secondary');
  }

  markInteractive() {
    this.deferredDone = true;
    return this.mark('interactive', 'interactive');
  }

  get snapshot() {
    return {
      stage: this.stage,
      mode: this.mode,
      fileSize: this.fileSize,
      firstPixelSource: this.firstPixelSource,
      headerMs: this.marks.header ?? null,
      pyramidMs: this.marks.pyramid ?? null,
      viewerOpenMs: this.marks.viewerOpen ?? null,
      firstTileMs: this.marks.firstTile ?? null,
      firstPixelMs: this.marks.firstPixel ?? null,
      deferredStartMs: this.marks.deferredStart ?? null,
      interactiveMs: this.marks.interactive ?? null,
      deferredStarted: this.deferredStarted,
      deferredDone: this.deferredDone,
    };
  }

  _emit() {
    try { this.onChange(this.snapshot); } catch (_) {}
  }
}
