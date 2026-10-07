import assert from 'node:assert/strict';
import { BenchmarkDiagnosticsEngine } from '../src/benchmark-diagnostics.js';

let now = 0;
const engine = new BenchmarkDiagnosticsEngine({ now: () => now, sampleLimit: 10, frameLimit: 20 });
engine.resetSession({ fileName: 'test.svs', fileSize: 300 * 1024 * 1024, mode: 'heavy' });
engine.recordTile({ decodeMs: 90, bitmapMs: 8, totalMs: 104 });
engine.recordTile({ decodeMs: 110, bitmapMs: 9, totalMs: 125 });
engine.recordTileError();
engine.recordTileAbort();
for (let i = 0; i < 90; i += 1) {
  now += 16.67;
  engine.recordFrame(now);
}
engine.observeRuntime({
  pressure: { level: 2, label: 'Pressão', score: 72, eventLoopLagMs: 48 },
  scheduler: { queuedJobs: 4, jobsInProgress: 1 },
  cache: { hitRate: 75, hits: 9, misses: 3, redecodes: 1, estimatedMiB: 44 },
  instant: { firstPixelMs: 1450, interactiveMs: 2200 },
});
const snap = engine.snapshot;
assert.equal(snap.tileCount, 2);
assert.equal(snap.tileErrors, 1);
assert.equal(snap.tileAborts, 1);
assert.equal(snap.cacheHitRate, 75);
assert.equal(snap.peakBackpressureLabel, 'Pressão');
assert.ok(snap.fpsAverage > 50 && snap.fpsAverage < 70);
assert.ok(snap.tileTotalAvgMs >= 110 && snap.tileTotalAvgMs <= 120);
const report = engine.createReport({ device: { logical: 8 } });
assert.equal(report.version, '0.5.9');
assert.equal(report.schema, 'virtum-svs-benchmark-v1');
assert.ok(report.score.value >= 0 && report.score.value <= 100);
console.log('Benchmark & Diagnostics tests: OK');
