/**
 * First Pixel Compatibility Gate
 *
 * OpenSeadragon 6 does not guarantee `tile-drawn` for every drawer. In
 * particular, WebGL is the preferred drawer on many non-iOS platforms while
 * `tile-drawn` is documented for context2d/html drawers. This gate accepts a
 * real viewport frame as the primary compatibility signal and keeps a short
 * watchdog as a last resort after a tile is known to be ready.
 */
export class FirstPixelCompatGate {
  constructor(options = {}) {
    this.now = typeof options.now === 'function' ? options.now : () => performance.now();
    this.setTimer = typeof options.setTimer === 'function' ? options.setTimer : (fn, ms) => setTimeout(fn, ms);
    this.clearTimer = typeof options.clearTimer === 'function' ? options.clearTimer : (id) => clearTimeout(id);
    this.onConfirm = typeof options.onConfirm === 'function' ? options.onConfirm : () => {};
    this.canWatchdogConfirm = typeof options.canWatchdogConfirm === 'function' ? options.canWatchdogConfirm : () => true;
    this.defaultWatchdogMs = Math.max(250, Number(options.watchdogMs) || 1600);
    this.reset();
  }

  reset() {
    if (this.timer != null) this.clearTimer(this.timer);
    this.timer = null;
    this.armed = false;
    this.frameEligible = false;
    this.confirmed = false;
    this.loadedAt = 0;
    this.source = '';
    this.elapsedMs = null;
  }

  arm(options = {}) {
    if (this.confirmed) return false;
    this.armed = true;
    this.frameEligible = false;
    this.loadedAt = this.now();
    if (this.timer != null) this.clearTimer(this.timer);
    const watchdogMs = Math.max(250, Number(options.watchdogMs) || this.defaultWatchdogMs);
    this.timer = this.setTimer(() => {
      this.timer = null;
      if (!this.armed || this.confirmed) return;
      if (this.canWatchdogConfirm()) this._confirm('paint-watchdog');
    }, watchdogMs);
    return true;
  }

  allowViewportFrame() {
    if (!this.armed || this.confirmed) return false;
    this.frameEligible = true;
    return true;
  }

  observeViewportFrame() {
    if (!this.armed || !this.frameEligible || this.confirmed) return false;
    return this._confirm('viewport-frame');
  }

  observeTileDrawn() {
    if (!this.armed || this.confirmed) return false;
    return this._confirm('tile-drawn');
  }

  _confirm(source) {
    if (this.confirmed) return false;
    this.confirmed = true;
    this.armed = false;
    this.source = source;
    this.elapsedMs = this.loadedAt ? Math.max(0, this.now() - this.loadedAt) : 0;
    if (this.timer != null) this.clearTimer(this.timer);
    this.timer = null;
    this.onConfirm({ source, elapsedMs: this.elapsedMs });
    return true;
  }

  get snapshot() {
    return {
      armed: this.armed,
      frameEligible: this.frameEligible,
      confirmed: this.confirmed,
      source: this.source,
      elapsedMs: this.elapsedMs,
    };
  }
}
