import assert from 'node:assert/strict';
import { AdaptiveBackpressure } from '../src/adaptive-backpressure.js';

let clock = 0;
const changes = [];
const bp = new AdaptiveBackpressure({
  now: () => clock,
  recoveryDelayMs: 1200,
  onStateChange: (snapshot) => changes.push(snapshot),
});

assert.equal(bp.snapshot.label, 'Normal');
assert.equal(bp.snapshot.concurrencyScale, 1);

bp.observeScheduler({ queuedJobs: 0, jobsInProgress: 1, jobLimit: 4, moving: false });
bp.recordTileLoaded({ decodeMs: 220, totalMs: 300 });
clock += 100;
bp.recordTileLoaded({ decodeMs: 260, totalMs: 340 });
assert.equal(bp.snapshot.level, 0, 'fast tiles keep normal pressure');

clock += 100;
bp.observeScheduler({ queuedJobs: 7, jobsInProgress: 4, jobLimit: 4, moving: false });
assert.ok(bp.snapshot.level >= 1, 'growing queue triggers backpressure');
assert.equal(bp.snapshot.allowPreload, false, 'pressure disables preload');

clock += 100;
bp.recordTileLoaded({ decodeMs: 2200, totalMs: 2600 });
clock += 100;
bp.observeEventLoopLag(180);
assert.ok(bp.snapshot.level >= 2, 'slow tiles plus UI lag reach high pressure');
assert.equal(bp.snapshot.maxTilesPerFrameCap, 1, 'high pressure caps refinement to one tile per frame');

clock += 100;
bp.recordTileError();
bp.recordTileError();
bp.recordTileError();
assert.equal(bp.snapshot.level, 3, 'repeated failures reach critical pressure');
assert.ok(bp.snapshot.concurrencyScale < 0.5, 'critical mode sharply reduces concurrency');

// Recovery is deliberately stepwise and requires quiet time.
clock += 11000;
bp.observeScheduler({ queuedJobs: 0, jobsInProgress: 0, jobLimit: 4, moving: false });
// Normal heartbeat samples make event-loop lag decay instead of snapping to zero.
for (let i = 0; i < 4; i += 1) {
  clock += 400;
  bp.observeEventLoopLag(0);
}
assert.equal(bp.snapshot.level, 2, 'recovery releases only one level after the first stable window');
clock += 1300;
bp.observeEventLoopLag(0);
bp.heartbeat();
assert.equal(bp.snapshot.level, 1, 'continued stability releases another level');
clock += 1300;
bp.observeEventLoopLag(0);
bp.heartbeat();
assert.equal(bp.snapshot.level, 0, 'sustained stability returns to normal');
assert.ok(changes.length >= 4, 'state changes are emitted for diagnostics/runtime tuning');

bp.reset();
assert.equal(bp.snapshot.level, 0);
assert.equal(bp.snapshot.tileSamples, 0);
assert.equal(bp.snapshot.recentErrors, 0);

console.log('Adaptive Backpressure tests: OK');
