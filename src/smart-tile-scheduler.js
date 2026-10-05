/**
 * Virtum Smart Tile Scheduler
 *
 * Mantém o OpenSeadragon responsável por escolher quais tiles são relevantes,
 * mas regula a cadência dessa escolha durante pan/zoom. OSD já ordena os
 * candidatos visíveis por visibilidade e distância ao centro; ao reduzir
 * maxTilesPerFrame durante movimento, o tile central e seus vizinhos vencem
 * naturalmente antes do restante da viewport.
 *
 * Importante: não abortamos jobs que já começaram. No OSD 6, abortar um job
 * iniciado pode marcar o tile como inexistente. Em vez disso, esvaziamos apenas
 * a fila ainda não iniciada e limitamos a concorrência durante o gesto para que,
 * no pior caso, somente o pequeno conjunto já em voo termine.
 */
export class SmartTileScheduler {
  constructor(viewer, options = {}) {
    this.viewer = viewer;
    this.idleDelayMs = Math.max(250, Number(options.idleDelayMs) || 400);
    this.clearThrottleMs = Math.max(40, Number(options.clearThrottleMs) || 80);
    this.getPolicy = typeof options.getPolicy === 'function' ? options.getPolicy : () => ({});
    this.onStateChange = typeof options.onStateChange === 'function' ? options.onStateChange : () => {};

    this.moving = false;
    this.idleTimer = null;
    this.lastMotionAt = 0;
    this.lastQueueClearAt = 0;
    this.queueClears = 0;
    this.discardedQueuedJobs = 0;
    this.motionEvents = 0;
    this.lastReason = 'standby';
  }

  get item() {
    try {
      return this.viewer?.world?.getItemCount?.() > 0 ? this.viewer.world.getItemAt(0) : null;
    } catch (_) {
      return null;
    }
  }

  get snapshot() {
    const loader = this.viewer?.imageLoader;
    const item = this.item;
    return {
      moving: this.moving,
      lastReason: this.lastReason,
      lastMotionAt: this.lastMotionAt,
      queueClears: this.queueClears,
      discardedQueuedJobs: this.discardedQueuedJobs,
      motionEvents: this.motionEvents,
      queuedJobs: Array.isArray(loader?.jobQueue) ? loader.jobQueue.length : 0,
      jobsInProgress: Number(loader?.jobsInProgress || 0),
      jobLimit: Number(loader?.jobLimit || 0),
      maxTilesPerFrame: Number(item?.maxTilesPerFrame || 0),
      preload: Boolean(item?._preload),
    };
  }

  notifyOpen() {
    this.lastReason = 'open';
    this.syncPolicy();
    this.notifyMotion('open');
  }

  notifyMotion(reason = 'viewport') {
    if (!this.viewer) return;
    const now = performance.now();
    this.lastMotionAt = now;
    this.lastReason = reason;
    this.motionEvents += 1;
    this.moving = true;

    this._applyMovingPolicy();
    this._clearQueuedWork(now);
    this._scheduleIdle();
    this._emit();
  }

  notifyIdle(reason = 'idle') {
    this.lastReason = reason;
    this._settle();
  }

  syncPolicy() {
    if (this.moving) this._applyMovingPolicy();
    else this._applyIdlePolicy();
    this._emit();
  }

  reset() {
    if (this.idleTimer) {
      window.clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    this.moving = false;
    this.lastMotionAt = 0;
    this.lastQueueClearAt = 0;
    this.queueClears = 0;
    this.discardedQueuedJobs = 0;
    this.motionEvents = 0;
    this.lastReason = 'standby';
    this.syncPolicy();
  }

  _scheduleIdle() {
    if (this.idleTimer) window.clearTimeout(this.idleTimer);
    this.idleTimer = window.setTimeout(() => this._settle(), this.idleDelayMs);
  }

  _settle() {
    if (this.idleTimer) {
      window.clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    this.moving = false;
    this._applyIdlePolicy();

    try { this.item?.redraw?.(); } catch (_) {}
    try { this.viewer?.forceRedraw?.(); } catch (_) {}
    this._emit();
  }

  _policy() {
    const policy = this.getPolicy?.() || {};
    return {
      movingJobLimit: Math.max(1, Number(policy.movingJobLimit) || 1),
      idleJobLimit: Math.max(1, Number(policy.idleJobLimit) || 2),
      movingMaxTilesPerFrame: Math.max(1, Number(policy.movingMaxTilesPerFrame) || 1),
      idleMaxTilesPerFrame: Math.max(1, Number(policy.idleMaxTilesPerFrame) || 2),
      idlePreload: Boolean(policy.idlePreload),
      loadDestinationTilesOnAnimation: Boolean(policy.loadDestinationTilesOnAnimation),
    };
  }

  _applyMovingPolicy() {
    const policy = this._policy();
    const loader = this.viewer?.imageLoader;
    const item = this.item;

    if (loader) loader.jobLimit = policy.movingJobLimit;
    if (item) {
      item.maxTilesPerFrame = policy.movingMaxTilesPerFrame;
      if ('_currentMaxTilesPerFrame' in item) {
        item._currentMaxTilesPerFrame = Math.min(
          Math.max(1, Number(item._currentMaxTilesPerFrame || 1)),
          policy.movingMaxTilesPerFrame,
        );
      }
      item.loadDestinationTilesOnAnimation = false;
      try { item.setPreload?.(false); } catch (_) {}
    }
  }

  _applyIdlePolicy() {
    const policy = this._policy();
    const loader = this.viewer?.imageLoader;
    const item = this.item;

    if (loader) loader.jobLimit = policy.idleJobLimit;
    if (item) {
      item.maxTilesPerFrame = policy.idleMaxTilesPerFrame;
      if ('_currentMaxTilesPerFrame' in item) {
        item._currentMaxTilesPerFrame = Math.max(
          Number(item._currentMaxTilesPerFrame || 1),
          policy.idleMaxTilesPerFrame,
        );
      }
      item.loadDestinationTilesOnAnimation = policy.loadDestinationTilesOnAnimation;
      try { item.setPreload?.(policy.idlePreload); } catch (_) {}
    }
  }

  _clearQueuedWork(now) {
    if (this.lastQueueClearAt > 0 && now - this.lastQueueClearAt < this.clearThrottleMs) return;
    const loader = this.viewer?.imageLoader;
    if (!loader || !Array.isArray(loader.jobQueue) || loader.jobQueue.length === 0) return;

    const queued = loader.jobQueue.length;
    // ImageLoader.clear() remove somente jobs que ainda não iniciaram. Isso faz
    // o tile voltar a loading=false sem transformar o tile em falha.
    loader.clear();
    this.lastQueueClearAt = now;
    this.queueClears += 1;
    this.discardedQueuedJobs += queued;
  }

  _emit() {
    try { this.onStateChange(this.snapshot); } catch (_) {}
  }
}
