/**
 * Virtum Mobile Heavy Open Rescue
 *
 * Camada de sobrevivência para o trecho ANTERIOR ao primeiro tile em tablets.
 * Não substitui Scheduler/Backpressure/Cache: ela reduz o envelope inteiro do
 * runtime enquanto OpenSlide inicializa e abre um SVS pesado.
 */
export const DEFAULT_RESCUE_THRESHOLD_BYTES = 250 * 1024 * 1024;
export const DEFAULT_ULTRA_THRESHOLD_BYTES = 600 * 1024 * 1024;

export class MobileHeavyOpenRescue {
  constructor(options = {}) {
    this.thresholdBytes = Math.max(1, Number(options.thresholdBytes) || DEFAULT_RESCUE_THRESHOLD_BYTES);
    this.ultraThresholdBytes = Math.max(this.thresholdBytes, Number(options.ultraThresholdBytes) || DEFAULT_ULTRA_THRESHOLD_BYTES);
    this.maxTrace = Math.max(12, Number(options.maxTrace) || 48);
    this.now = typeof options.now === 'function' ? options.now : () => performance.now();
    this.onChange = typeof options.onChange === 'function' ? options.onChange : () => {};
    this.reset({ emit: false });
  }

  isCandidate({ fileSize = 0, mobile = false, memorySafe = false } = {}) {
    const bytes = Number(fileSize) || 0;
    return bytes >= this.thresholdBytes && Boolean(mobile || memorySafe);
  }

  profileFor(fileSize = 0) {
    const ultra = Number(fileSize) >= this.ultraThresholdBytes;
    return {
      name: ultra ? 'Ultra Mobile Rescue' : 'Mobile Heavy Rescue',
      workerCount: 1,
      blockSize: 1024 * 1024,
      brokerCacheBytes: (ultra ? 8 : 12) * 1024 * 1024,
      maxConcurrentReads: 1,
      readAhead: 0,
      jobLimit: 1,
      tileCacheCount: ultra ? 8 : 10,
      tileCacheFloor: 6,
      preload: false,
      predictive: false,
      maximumWasmMemoryMiB: 512,
      preferredWasmMemoryMiB: 384,
    };
  }

  begin({ fileName = '', fileSize = 0, mobile = false, memorySafe = false } = {}) {
    this.reset({ emit: false });
    this.active = this.isCandidate({ fileSize, mobile, memorySafe });
    this.fileName = fileName;
    this.fileSize = Number(fileSize) || 0;
    this.startedAt = this.now();
    this.profile = this.active ? this.profileFor(this.fileSize) : null;
    if (this.active) this.mark('file-received', `${this.profile.name} · ${(this.fileSize / (1024 * 1024)).toFixed(0)} MiB`);
    else this._emit();
    return this.active;
  }

  mark(stage, detail = '') {
    if (!this.active) return null;
    const at = this.now();
    const entry = {
      stage: String(stage || 'unknown'),
      detail: String(detail || ''),
      atMs: Math.max(0, Math.round(at - this.startedAt)),
    };
    this.stage = entry.stage;
    this.lastDetail = entry.detail;
    this.trace.push(entry);
    if (this.trace.length > this.maxTrace) this.trace.splice(0, this.trace.length - this.maxTrace);
    this._emit();
    return entry;
  }

  fail(stage, error) {
    if (!this.active) return null;
    this.failed = true;
    this.errorStage = String(stage || this.stage || 'unknown');
    this.errorMessage = String(error?.message || error || 'Falha desconhecida');
    return this.mark(`failed:${this.errorStage}`, this.errorMessage);
  }

  complete(detail = 'first pixel') {
    if (!this.active) return;
    this.completed = true;
    this.mark('first-pixel', detail);
  }

  requiresEngineRestart({ hasEngine = false, hasOpenSlide = false, engineRescueActive = false, wasmVariant = '' } = {}) {
    if (!this.active || !hasEngine) return false;
    // Uma lâmina anterior mantém heap/caches no runtime. Para heavy mobile,
    // recomeçamos limpos. Também reiniciamos qualquer runtime não configurado
    // especificamente para Rescue ou usando fallback stock.
    if (hasOpenSlide) return true;
    if (!engineRescueActive) return true;
    return !String(wasmVariant).startsWith('mobile-');
  }

  acceptsMobileManifest(manifest) {
    const maximum = Number(manifest?.maximumMemoryMiB || 0);
    return Boolean(
      manifest?.ready && manifest?.js && manifest?.wasm
      && maximum > 0
      && maximum <= (this.profile?.maximumWasmMemoryMiB || 512)
    );
  }

  reset({ emit = true } = {}) {
    this.active = false;
    this.completed = false;
    this.failed = false;
    this.fileName = '';
    this.fileSize = 0;
    this.startedAt = 0;
    this.stage = 'standby';
    this.lastDetail = '';
    this.errorStage = '';
    this.errorMessage = '';
    this.profile = null;
    this.trace = [];
    if (emit) this._emit();
  }

  get snapshot() {
    return {
      active: this.active,
      completed: this.completed,
      failed: this.failed,
      fileName: this.fileName,
      fileSize: this.fileSize,
      stage: this.stage,
      lastDetail: this.lastDetail,
      errorStage: this.errorStage,
      errorMessage: this.errorMessage,
      profile: this.profile ? { ...this.profile } : null,
      trace: this.trace.map(entry => ({ ...entry })),
    };
  }

  _emit() {
    try { this.onChange(this.snapshot); } catch (_) {}
  }
}
