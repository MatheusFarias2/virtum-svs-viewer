/**
 * Virtum Predictive Navigation
 *
 * Aprende a direção do pan em tempo real, mas não carrega tiles durante o gesto.
 * Após uma micro-pausa, antecipa poucos tiles logo à frente da viewport. A camada
 * é deliberadamente conservadora: respeita fila, backpressure, cache e o limite
 * do dispositivo, e usa o TileCache/ImageLoader do próprio OpenSeadragon.
 */
export class PredictiveNavigation {
  constructor(viewer, options = {}) {
    this.viewer = viewer;
    this.quietDelayMs = Math.max(80, Number(options.quietDelayMs) || 150);
    this.sampleWindowMs = Math.max(220, Number(options.sampleWindowMs) || 650);
    this.minSampleMs = Math.max(12, Number(options.minSampleMs) || 28);
    this.getPolicy = typeof options.getPolicy === 'function' ? options.getPolicy : () => ({});
    this.onStateChange = typeof options.onStateChange === 'function' ? options.onStateChange : () => {};
    this.now = typeof options.now === 'function' ? options.now : () => performance.now();
    this.timerApi = options.timerApi || globalThis;
    this.reset({ emit: false });
  }

  get item() {
    try {
      return this.viewer?.world?.getItemCount?.() > 0 ? this.viewer.world.getItemAt(0) : null;
    } catch (_) {
      return null;
    }
  }

  get snapshot() {
    return {
      enabled: this.enabled,
      state: this.state,
      directionX: Number(this.direction.x.toFixed(3)),
      directionY: Number(this.direction.y.toFixed(3)),
      speedViewportPerSec: Number(this.speedViewportPerSec.toFixed(2)),
      predictions: this.predictions,
      requested: this.requested,
      completed: this.completed,
      cacheHits: this.cacheHits,
      skipped: this.skipped,
      cancelled: this.cancelled,
      failed: this.failed,
      lastLevel: this.lastLevel,
      lastLead: Number(this.lastLead.toFixed(2)),
      lastReason: this.lastReason,
      pending: this.pending.size,
    };
  }

  reset({ emit = true } = {}) {
    this._clearTimer();
    this.samples = [];
    this.direction = { x: 0, y: 0 };
    this.speedViewportPerSec = 0;
    this.enabled = false;
    this.state = 'standby';
    this.predictions = 0;
    this.requested = 0;
    this.completed = 0;
    this.cacheHits = 0;
    this.skipped = 0;
    this.cancelled = 0;
    this.failed = 0;
    this.lastLevel = null;
    this.lastLead = 0;
    this.lastReason = 'standby';
    this.lastMotionAt = 0;
    this.pending = new Map();
    if (emit) this._emit();
  }

  syncPolicy() {
    const policy = this._policy();
    this.enabled = policy.enabled;
    if (!policy.enabled) {
      this._clearTimer();
      this.state = 'guarded';
      this.lastReason = policy.reason || 'desativado';
    }
    this._emit();
  }

  notifyPan() {
    const item = this.item;
    const viewport = this.viewer?.viewport;
    if (!item || !viewport) return;

    this._reconcilePending();
    const now = this.now();
    const center = this._imageCenter(item, viewport);
    const rect = this._imageViewportRect(item, viewport);
    if (!center || !rect || rect.width <= 0 || rect.height <= 0) return;

    const previous = this.samples[this.samples.length - 1];
    if (previous && now - previous.at < this.minSampleMs) return;

    this.samples.push({ at: now, x: center.x, y: center.y, width: rect.width, height: rect.height });
    this.samples = this.samples.filter(sample => now - sample.at <= this.sampleWindowMs).slice(-8);
    this.lastMotionAt = now;
    this._updateVector();
    const policy = this._policy();
    this.enabled = policy.enabled;
    if (policy.enabled) {
      this.state = 'learning';
      this.lastReason = 'pan';
      this._schedulePrediction();
    } else {
      this._clearTimer();
      this.state = 'guarded';
      this.lastReason = policy.reason || 'desativado';
    }
    this._emit();
  }

  notifyNonPanMotion(reason = 'viewport') {
    this.lastReason = reason;
    if (reason === 'zoom' || reason === 'rotate' || reason === 'resize') {
      this.samples = [];
      this.direction = { x: 0, y: 0 };
      this.speedViewportPerSec = 0;
      this._clearTimer();
      this.state = 'standby';
      this._emit();
    }
  }

  observeTileLoaded(tile) {
    const key = this._tileKey(tile);
    if (!key || !this.pending.has(key)) return;
    this.pending.delete(key);
    this.completed += 1;
    this.state = 'warm';
    this.lastReason = 'prefetch concluído';
    this._emit();
  }

  observeTileFailed(tile) {
    const key = this._tileKey(tile);
    if (!key || !this.pending.has(key)) return;
    this.pending.delete(key);
    this.failed += 1;
    this.lastReason = 'prefetch falhou';
    this._emit();
  }

  runPrediction() {
    this._clearTimer();
    this._reconcilePending();
    const policy = this._policy();
    this.enabled = policy.enabled;
    if (!policy.enabled) return this._skip(policy.reason || 'desativado');
    if (this.samples.length < 2) return this._skip('trajetória insuficiente');
    if (this.speedViewportPerSec < policy.minSpeedViewportPerSec) return this._skip('pan lento');
    if (policy.pressureLevel > 0) return this._skip('backpressure');
    if (policy.cacheLoadRatio >= policy.maxCacheLoadRatio) return this._skip('cache cheio');

    const loader = this.viewer?.imageLoader;
    if (!loader) return this._skip('loader indisponível');
    const queued = Array.isArray(loader.jobQueue) ? loader.jobQueue.length : 0;
    const inProgress = Number(loader.jobsInProgress || 0);
    const limit = Math.max(1, Number(loader.jobLimit || 1));
    if (queued > policy.maxQueuedJobs || inProgress >= Math.max(1, limit - policy.reserveJobs)) {
      return this._skip('fila ocupada');
    }

    const item = this.item;
    const viewport = this.viewer?.viewport;
    const source = item?.source;
    if (!item || !viewport || !source || typeof item._getTile !== 'function' || typeof item._loadTile !== 'function') {
      return this._skip('OSD incompatível');
    }

    const rect = this._imageViewportRect(item, viewport);
    if (!rect) return this._skip('viewport inválida');
    const level = this._focusLevel(item, policy.focusLevel);
    if (!Number.isFinite(level)) return this._skip('nível desconhecido');

    const speedBoost = Math.min(0.22, Math.max(0, this.speedViewportPerSec - 0.2) * 0.08);
    const lead = Math.min(policy.maxLeadViewport, policy.baseLeadViewport + speedBoost);
    const distance = Math.max(rect.width, rect.height) * lead;
    const shifted = this._shiftRect(rect, this.direction.x * distance, this.direction.y * distance, source.dimensions);
    const currentRange = this._tileRange(source, level, rect);
    const predictedRange = this._tileRange(source, level, shifted);
    if (!currentRange || !predictedRange) return this._skip('faixa vazia');

    const candidates = this._candidateTiles(source, level, currentRange, predictedRange, this.direction);
    if (!candidates.length) return this._skip('sem tiles à frente');

    const numTiles = source.getNumTiles(level);
    let launched = 0;
    for (const candidate of candidates) {
      if (launched >= policy.maxTiles) break;
      const time = Date.now();
      const tile = item._getTile(candidate.x, candidate.y, level, time, numTiles);
      if (!tile?.exists) continue;
      if (tile.loaded || tile.loading) {
        this.skipped += 1;
        continue;
      }
      try {
        if (typeof item._tryFindTileCacheRecord === 'function' && item._tryFindTileCacheRecord(tile)) {
          this.cacheHits += 1;
          continue;
        }
      } catch (_) {}

      const key = this._tileKey(tile);
      try {
        tile._virtumPredictive = true;
        item._loadTile(tile, time);
        if (tile.loading && key) {
          this.pending.set(key, tile);
          launched += 1;
          this.requested += 1;
        }
      } catch (_) {
        this.failed += 1;
      }
    }

    if (!launched) return this._skip('tiles já aquecidos');
    this.predictions += 1;
    this.lastLevel = level;
    this.lastLead = lead;
    this.state = 'prefetch';
    this.lastReason = `${launched} tile${launched === 1 ? '' : 's'} à frente`;
    this._emit();
    return launched;
  }

  _policy() {
    const p = this.getPolicy?.() || {};
    return {
      enabled: p.enabled !== false,
      reason: p.reason || '',
      maxTiles: Math.max(1, Math.min(4, Number(p.maxTiles) || 1)),
      baseLeadViewport: Math.max(0.1, Math.min(0.5, Number(p.baseLeadViewport) || 0.22)),
      maxLeadViewport: Math.max(0.16, Math.min(0.8, Number(p.maxLeadViewport) || 0.42)),
      minSpeedViewportPerSec: Math.max(0.02, Number(p.minSpeedViewportPerSec) || 0.08),
      maxQueuedJobs: Math.max(0, Number(p.maxQueuedJobs) || 0),
      reserveJobs: Math.max(0, Number(p.reserveJobs) || 0),
      pressureLevel: Math.max(0, Number(p.pressureLevel) || 0),
      cacheLoadRatio: Math.max(0, Number(p.cacheLoadRatio) || 0),
      maxCacheLoadRatio: Math.max(0.3, Math.min(1, Number(p.maxCacheLoadRatio) || 0.82)),
      focusLevel: Number.isFinite(Number(p.focusLevel)) ? Number(p.focusLevel) : null,
    };
  }

  _schedulePrediction() {
    this._clearTimer();
    this.timer = this.timerApi.setTimeout(() => this.runPrediction(), this.quietDelayMs);
  }

  _clearTimer() {
    if (this.timer != null) {
      this.timerApi.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  _updateVector() {
    if (this.samples.length < 2) return;
    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = Math.max(1, last.at - first.at);
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 0.001) return;
    this.direction = { x: dx / distance, y: dy / distance };
    const viewportSpan = Math.max(1, last.width, last.height);
    this.speedViewportPerSec = (distance / dt) * 1000 / viewportSpan;
  }

  _imageCenter(item, viewport) {
    try { return item.viewportToImageCoordinates(viewport.getCenter(true), true); } catch (_) { return null; }
  }

  _imageViewportRect(item, viewport) {
    try { return item.viewportToImageRectangle(viewport.getBounds(true), true); } catch (_) { return null; }
  }

  _shiftRect(rect, dx, dy, dimensions) {
    const width = Number(dimensions?.x || 0);
    const height = Number(dimensions?.y || 0);
    const x = Math.min(Math.max(0, rect.x + dx), Math.max(0, width - rect.width));
    const y = Math.min(Math.max(0, rect.y + dy), Math.max(0, height - rect.height));
    return { x, y, width: rect.width, height: rect.height };
  }

  _tileRange(source, level, rect) {
    const width = Number(source?.dimensions?.x || 0);
    const height = Number(source?.dimensions?.y || 0);
    if (!width || !height) return null;
    const epsilon = 0.001;
    const x0 = Math.min(width - epsilon, Math.max(0, rect.x));
    const y0 = Math.min(height - epsilon, Math.max(0, rect.y));
    const x1 = Math.min(width - epsilon, Math.max(x0, rect.x + rect.width - epsilon));
    const y1 = Math.min(height - epsilon, Math.max(y0, rect.y + rect.height - epsilon));
    const a = source.getTileAtPoint(level, { x: x0 / width, y: y0 / width });
    const b = source.getTileAtPoint(level, { x: x1 / width, y: y1 / width });
    const count = source.getNumTiles(level);
    return {
      left: Math.max(0, Math.min(count.x - 1, a.x)),
      right: Math.max(0, Math.min(count.x - 1, b.x)),
      top: Math.max(0, Math.min(count.y - 1, a.y)),
      bottom: Math.max(0, Math.min(count.y - 1, b.y)),
    };
  }

  _candidateTiles(source, level, current, predicted, direction) {
    const currentCx = (current.left + current.right) / 2;
    const currentCy = (current.top + current.bottom) / 2;
    const out = [];
    for (let x = predicted.left; x <= predicted.right; x += 1) {
      for (let y = predicted.top; y <= predicted.bottom; y += 1) {
        const insideCurrent = x >= current.left && x <= current.right && y >= current.top && y <= current.bottom;
        if (insideCurrent || !source.tileExists(level, x, y)) continue;
        const dx = x - currentCx;
        const dy = y - currentCy;
        const forward = dx * direction.x + dy * direction.y;
        if (forward <= 0) continue;
        const lateral = Math.abs(dx * -direction.y + dy * direction.x);
        out.push({ x, y, score: lateral * 1.6 + forward * 0.15 });
      }
    }
    return out.sort((a, b) => a.score - b.score);
  }

  _focusLevel(item, preferred) {
    if (Number.isFinite(preferred)) return preferred;
    try {
      const counts = new Map();
      for (const entry of item.lastDrawn || []) {
        const level = Number(entry?.level ?? entry?.tile?.level);
        if (Number.isFinite(level)) counts.set(level, (counts.get(level) || 0) + 1);
      }
      let best = null;
      let count = -1;
      for (const [level, value] of counts) {
        if (value > count || (value === count && level > best)) { best = level; count = value; }
      }
      if (Number.isFinite(best)) return best;
    } catch (_) {}
    const max = Number(item?.source?.maxLevel);
    return Number.isFinite(max) ? max : null;
  }

  _tileKey(tile) {
    if (!tile) return null;
    const l = Number(tile.level); const x = Number(tile.x); const y = Number(tile.y);
    return [l, x, y].every(Number.isFinite) ? `${l}/${x}/${y}` : null;
  }

  _reconcilePending() {
    for (const [key, tile] of this.pending) {
      if (tile?.loaded) {
        this.pending.delete(key);
        this.completed += 1;
      } else if (!tile?.loading) {
        this.pending.delete(key);
        this.cancelled += 1;
      }
    }
  }

  _skip(reason) {
    this.skipped += 1;
    this.state = 'guarded';
    this.lastReason = reason;
    this._emit();
    return 0;
  }

  _emit() {
    try { this.onStateChange(this.snapshot); } catch (_) {}
  }
}
