/**
 * Virtum Adaptive Backpressure
 *
 * Observa sinais reais de saturação durante a navegação e devolve limites
 * conservadores para o Smart Tile Scheduler. A lógica usa histerese: apertar
 * é rápido quando há fila/latência/lag; relaxar é propositalmente lento para
 * evitar que a concorrência fique oscilando a cada tile.
 */
export class AdaptiveBackpressure {
  constructor(options = {}) {
    this.onStateChange = typeof options.onStateChange === 'function' ? options.onStateChange : () => {};
    this.now = typeof options.now === 'function' ? options.now : () => performance.now();
    this.recoveryDelayMs = Math.max(1000, Number(options.recoveryDelayMs) || 2600);
    this.errorWindowMs = Math.max(2000, Number(options.errorWindowMs) || 10000);
    this.tileFreshMs = Math.max(1000, Number(options.tileFreshMs) || 4500);
    this.alpha = Math.min(0.8, Math.max(0.05, Number(options.alpha) || 0.28));
    this.reset(false);
  }

  reset(emit = true) {
    this.level = 0;
    this.levelSince = this.now();
    this.lastPressureAt = 0;
    this.lastTileAt = 0;
    this.lastSampleAt = 0;
    this.tileSamples = 0;
    this.decodeEwma = 0;
    this.totalEwma = 0;
    this.lagEwma = 0;
    this.queueDepth = 0;
    this.jobsInProgress = 0;
    this.jobLimit = 1;
    this.moving = false;
    this.recentErrors = [];
    this.escalations = 0;
    this.recoveries = 0;
    this.lastScore = 0;
    this.lastReason = 'normal';
    if (emit) this._emit();
  }

  get snapshot() {
    const profile = this._profileFor(this.level);
    return {
      level: this.level,
      label: profile.label,
      concurrencyScale: profile.concurrencyScale,
      cacheScale: profile.cacheScale,
      maxTilesPerFrameCap: profile.maxTilesPerFrameCap,
      allowPreload: profile.allowPreload,
      queueDepth: this.queueDepth,
      jobsInProgress: this.jobsInProgress,
      jobLimit: this.jobLimit,
      moving: this.moving,
      tileSamples: this.tileSamples,
      decodeMs: this.tileSamples ? Math.round(this.decodeEwma) : 0,
      totalMs: this.tileSamples ? Math.round(this.totalEwma) : 0,
      eventLoopLagMs: Math.round(this.lagEwma),
      recentErrors: this.recentErrors.length,
      score: Number(this.lastScore.toFixed(2)),
      reason: this.lastReason,
      escalations: this.escalations,
      recoveries: this.recoveries,
      levelSince: this.levelSince,
    };
  }

  observeScheduler(snapshot = {}) {
    this.queueDepth = Math.max(0, Number(snapshot.queuedJobs) || 0);
    this.jobsInProgress = Math.max(0, Number(snapshot.jobsInProgress) || 0);
    this.jobLimit = Math.max(1, Number(snapshot.jobLimit) || this.jobLimit || 1);
    this.moving = Boolean(snapshot.moving);
    this._evaluate('scheduler');
  }

  recordTileLoaded({ decodeMs = 0, totalMs = 0 } = {}) {
    const now = this.now();
    const decode = Math.max(0, Number(decodeMs) || 0);
    const total = Math.max(decode, Number(totalMs) || decode);
    this.lastTileAt = now;
    this.tileSamples += 1;
    this.decodeEwma = this._ewma(this.decodeEwma, decode, this.tileSamples === 1);
    this.totalEwma = this._ewma(this.totalEwma, total, this.tileSamples === 1);
    this._evaluate('tile');
  }

  recordTileError() {
    const now = this.now();
    this.recentErrors.push(now);
    this._pruneErrors(now);
    this.lastPressureAt = now;
    this._evaluate('error');
  }

  observeEventLoopLag(lagMs = 0) {
    const lag = Math.max(0, Number(lagMs) || 0);
    this.lagEwma = this._ewma(this.lagEwma, lag, this.lagEwma === 0);
    this._evaluate('event-loop');
  }

  heartbeat(snapshot = null) {
    if (snapshot) this.observeScheduler(snapshot);
    else this._evaluate('heartbeat');
  }

  _ewma(current, value, first = false) {
    if (first || !Number.isFinite(current) || current <= 0) return value;
    return current + (value - current) * this.alpha;
  }

  _pruneErrors(now) {
    this.recentErrors = this.recentErrors.filter((at) => now - at <= this.errorWindowMs);
  }

  _profileFor(level) {
    if (level >= 3) {
      return { label: 'Crítico', concurrencyScale: 0.34, cacheScale: 0.55, maxTilesPerFrameCap: 1, allowPreload: false };
    }
    if (level === 2) {
      return { label: 'Pressão', concurrencyScale: 0.55, cacheScale: 0.72, maxTilesPerFrameCap: 1, allowPreload: false };
    }
    if (level === 1) {
      return { label: 'Guardado', concurrencyScale: 0.8, cacheScale: 0.88, maxTilesPerFrameCap: 2, allowPreload: false };
    }
    return { label: 'Normal', concurrencyScale: 1, cacheScale: 1, maxTilesPerFrameCap: 99, allowPreload: true };
  }

  _score(now) {
    this._pruneErrors(now);
    let score = 0;
    const reasons = [];
    const queueRatio = this.jobLimit > 0 ? this.queueDepth / this.jobLimit : 0;

    if (queueRatio >= 2.5 || this.queueDepth >= 8) { score += 3; reasons.push('fila alta'); }
    else if (queueRatio >= 1.25 || this.queueDepth >= 4) { score += 2; reasons.push('fila crescendo'); }
    else if (this.queueDepth > 0 && this.jobsInProgress >= this.jobLimit) { score += 1; reasons.push('fila ocupada'); }

    const tileFresh = this.lastTileAt > 0 && now - this.lastTileAt <= this.tileFreshMs;
    if (tileFresh && this.tileSamples >= 2) {
      if (this.totalEwma >= 3000) { score += 4; reasons.push('tile muito lento'); }
      else if (this.totalEwma >= 1700) { score += 3; reasons.push('tile lento'); }
      else if (this.totalEwma >= 900) { score += 2; reasons.push('latência de tile'); }
      else if (this.totalEwma >= 500) { score += 1; reasons.push('tile aquecido'); }
    }

    if (this.lagEwma >= 220) { score += 4; reasons.push('UI travando'); }
    else if (this.lagEwma >= 120) { score += 3; reasons.push('UI pressionada'); }
    else if (this.lagEwma >= 65) { score += 2; reasons.push('lag do navegador'); }
    else if (this.lagEwma >= 35) { score += 1; reasons.push('lag leve'); }

    if (this.recentErrors.length >= 3) { score += 4; reasons.push('falhas repetidas'); }
    else if (this.recentErrors.length >= 1) { score += 2; reasons.push('falha de tile'); }

    // Durante gesto, a Fase 3 já mantém a fila curta. Evitamos penalizar apenas
    // por estar se movendo; a Fase 4 reage somente se os sinais de saturação vierem junto.
    return { score, reason: reasons.join(' + ') || 'estável' };
  }

  _desiredLevel(score) {
    if (score >= 7) return 3;
    if (score >= 4) return 2;
    if (score >= 2) return 1;
    return 0;
  }

  _evaluate(source) {
    const now = this.now();
    this.lastSampleAt = now;
    const { score, reason } = this._score(now);
    this.lastScore = score;
    const desired = this._desiredLevel(score);
    let changed = false;

    if (desired > this.level) {
      this.level = desired;
      this.levelSince = now;
      this.lastPressureAt = now;
      this.escalations += 1;
      changed = true;
    } else if (desired < this.level) {
      const quietFor = now - Math.max(this.lastPressureAt, this.levelSince);
      if (score <= 1 && quietFor >= this.recoveryDelayMs) {
        this.level = Math.max(desired, this.level - 1);
        this.levelSince = now;
        this.recoveries += 1;
        changed = true;
      }
    } else if (score >= 2) {
      this.lastPressureAt = now;
    }

    this.lastReason = changed ? `${reason} · ${source}` : reason;
    if (changed) this._emit();
  }

  _emit() {
    try { this.onStateChange(this.snapshot); } catch (_) {}
  }
}
