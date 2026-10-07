function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentile(values, p = 0.95) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * p) - 1));
  return sorted[index];
}

function round(value, digits = 1) {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function boundedPush(list, value, limit) {
  if (!Number.isFinite(value)) return;
  list.push(value);
  if (list.length > limit) list.splice(0, list.length - limit);
}

export class BenchmarkDiagnosticsEngine {
  constructor(options = {}) {
    this.now = typeof options.now === 'function' ? options.now : () => performance.now();
    this.onChange = typeof options.onChange === 'function' ? options.onChange : () => {};
    this.sampleLimit = Math.max(30, Number(options.sampleLimit) || 240);
    this.frameLimit = Math.max(60, Number(options.frameLimit) || 360);
    this.resetSession({ emit: false });
  }

  resetSession({ fileName = '', fileSize = 0, mode = 'standard' } = {}, { emit = true } = {}) {
    this.startedAt = this.now();
    this.fileName = fileName;
    this.fileSize = Number(fileSize) || 0;
    this.mode = mode;
    this.tileDecode = [];
    this.tileTotal = [];
    this.tileBitmap = [];
    this.frameDeltas = [];
    this.tileCount = 0;
    this.tileErrors = 0;
    this.tileAborts = 0;
    this.drawCount = 0;
    this.longFrames = 0;
    this.lastFrameAt = 0;
    this.currentFps = 0;
    this.fpsSamples = [];
    this.fpsWindowStartedAt = 0;
    this.fpsWindowFrames = 0;
    this.peakBackpressureLevel = 0;
    this.peakBackpressureLabel = 'Normal';
    this.peakBackpressureScore = 0;
    this.peakEventLoopLagMs = 0;
    this.peakQueue = 0;
    this.peakJobs = 0;
    this.lastRuntime = {};
    if (emit) this._emit();
  }

  recordTile({ decodeMs = 0, totalMs = 0, bitmapMs = 0 } = {}) {
    boundedPush(this.tileDecode, Number(decodeMs) || 0, this.sampleLimit);
    boundedPush(this.tileTotal, Number(totalMs) || 0, this.sampleLimit);
    boundedPush(this.tileBitmap, Number(bitmapMs) || 0, this.sampleLimit);
    this.tileCount += 1;
    this._emit();
  }

  recordTileError() {
    this.tileErrors += 1;
    this._emit();
  }

  recordTileAbort() {
    this.tileAborts += 1;
    this._emit();
  }

  recordDraw() {
    this.drawCount += 1;
  }

  recordFrame(timestamp = this.now()) {
    const now = Number(timestamp) || this.now();
    if (this.lastFrameAt > 0) {
      const delta = now - this.lastFrameAt;
      if (delta > 0 && delta < 1000) {
        boundedPush(this.frameDeltas, delta, this.frameLimit);
        if (delta >= 50) this.longFrames += 1;
      }
    }
    this.lastFrameAt = now;

    if (!this.fpsWindowStartedAt) this.fpsWindowStartedAt = now;
    this.fpsWindowFrames += 1;
    const elapsed = now - this.fpsWindowStartedAt;
    if (elapsed >= 800) {
      const fps = (this.fpsWindowFrames * 1000) / elapsed;
      this.currentFps = fps;
      boundedPush(this.fpsSamples, fps, 120);
      this.fpsWindowStartedAt = now;
      this.fpsWindowFrames = 0;
      this._emit();
    }
  }

  observeRuntime({ pressure = {}, scheduler = {}, cache = {}, predictive = {}, instant = {}, profile = {}, device = {}, memory = {} } = {}) {
    const pressureLevel = Number(pressure.level) || 0;
    if (pressureLevel >= this.peakBackpressureLevel) {
      this.peakBackpressureLevel = pressureLevel;
      this.peakBackpressureLabel = pressure.label || this.peakBackpressureLabel;
    }
    this.peakBackpressureScore = Math.max(this.peakBackpressureScore, Number(pressure.score) || 0);
    this.peakEventLoopLagMs = Math.max(this.peakEventLoopLagMs, Number(pressure.eventLoopLagMs) || 0);
    this.peakQueue = Math.max(this.peakQueue, Number(scheduler.queuedJobs) || 0);
    this.peakJobs = Math.max(this.peakJobs, Number(scheduler.jobsInProgress) || 0);
    this.lastRuntime = { pressure, scheduler, cache, predictive, instant, profile, device, memory };
  }

  get snapshot() {
    const avgFrameMs = average(this.frameDeltas);
    const averageFps = this.fpsSamples.length ? average(this.fpsSamples) : (avgFrameMs > 0 ? 1000 / avgFrameMs : 0);
    const p95FrameMs = percentile(this.frameDeltas, 0.95);
    const avgTotal = average(this.tileTotal);
    const p95Total = percentile(this.tileTotal, 0.95);
    const avgDecode = average(this.tileDecode);
    const p95Decode = percentile(this.tileDecode, 0.95);
    const avgBitmap = average(this.tileBitmap);
    const runtime = this.lastRuntime || {};
    const cache = runtime.cache || {};
    const instant = runtime.instant || {};

    return {
      sessionMs: Math.max(0, this.now() - this.startedAt),
      fileName: this.fileName,
      fileSize: this.fileSize,
      mode: this.mode,
      fpsCurrent: round(this.currentFps || averageFps, 1),
      fpsAverage: round(averageFps, 1),
      frameP95Ms: round(p95FrameMs, 1),
      frameWorstMs: round(this.frameDeltas.length ? Math.max(...this.frameDeltas) : 0, 1),
      longFrames: this.longFrames,
      tileCount: this.tileCount,
      tileTotalAvgMs: round(avgTotal, 1),
      tileTotalP95Ms: round(p95Total, 1),
      decodeAvgMs: round(avgDecode, 1),
      decodeP95Ms: round(p95Decode, 1),
      bitmapAvgMs: round(avgBitmap, 1),
      tileErrors: this.tileErrors,
      tileAborts: this.tileAborts,
      draws: this.drawCount,
      cacheHitRate: Number(cache.hitRate) || 0,
      cacheHits: Number(cache.hits) || 0,
      cacheMisses: Number(cache.misses) || 0,
      cacheRedecodes: Number(cache.redecodes) || 0,
      cacheEstimatedMiB: Number(cache.estimatedMiB) || 0,
      firstPixelMs: instant.firstPixelMs ?? null,
      interactiveMs: instant.interactiveMs ?? null,
      peakBackpressureLevel: this.peakBackpressureLevel,
      peakBackpressureLabel: this.peakBackpressureLabel,
      peakBackpressureScore: round(this.peakBackpressureScore, 1),
      peakEventLoopLagMs: round(this.peakEventLoopLagMs, 1),
      peakQueue: this.peakQueue,
      peakJobs: this.peakJobs,
      runtime,
    };
  }

  createReport(extra = {}) {
    const snapshot = this.snapshot;
    const score = this.score(snapshot);
    return {
      schema: 'virtum-svs-benchmark-v1',
      generatedAt: new Date().toISOString(),
      version: '0.5.9',
      score,
      metrics: snapshot,
      ...extra,
    };
  }

  score(snapshot = this.snapshot) {
    if (!snapshot.tileCount && snapshot.firstPixelMs == null && !snapshot.fpsAverage) {
      return { value: null, label: 'Aguardando dados' };
    }
    let points = 100;
    if (snapshot.firstPixelMs != null) points -= Math.min(24, snapshot.firstPixelMs / 750);
    if (snapshot.fpsAverage > 0) points -= Math.max(0, 55 - snapshot.fpsAverage) * 0.55;
    points -= Math.min(18, snapshot.frameP95Ms / 8);
    points -= Math.min(16, snapshot.tileTotalP95Ms / 180);
    points -= Math.min(12, snapshot.decodeP95Ms / 220);
    points -= Math.min(12, snapshot.peakBackpressureLevel * 4);
    points -= Math.min(8, snapshot.tileErrors * 2 + snapshot.tileAborts * 0.5);
    const value = Math.max(0, Math.min(100, Math.round(points)));
    let label = 'Excelente';
    if (value < 45) label = 'Crítico';
    else if (value < 65) label = 'Limitado';
    else if (value < 82) label = 'Bom';
    return { value, label };
  }

  _emit() {
    try { this.onChange(this.snapshot); } catch (_) {}
  }
}
