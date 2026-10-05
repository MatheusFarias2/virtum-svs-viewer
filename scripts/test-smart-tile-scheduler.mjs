import assert from 'node:assert/strict';
import { SmartTileScheduler } from '../src/smart-tile-scheduler.js';

globalThis.window = globalThis.window || globalThis;

const item = {
  maxTilesPerFrame: 5,
  _currentMaxTilesPerFrame: 5,
  _preload: true,
  loadDestinationTilesOnAnimation: true,
  redrawCalls: 0,
  setPreload(value) { this._preload = value; },
  redraw() { this.redrawCalls += 1; },
};

const loader = {
  jobLimit: 6,
  jobsInProgress: 0,
  jobQueue: [{ id: 1 }, { id: 2 }, { id: 3 }],
  clearCalls: 0,
  clear() { this.clearCalls += 1; this.jobQueue = []; },
};

const viewer = {
  imageLoader: loader,
  world: {
    getItemCount: () => 1,
    getItemAt: () => item,
  },
  redraws: 0,
  forceRedraw() { this.redraws += 1; },
};

const snapshots = [];
const scheduler = new SmartTileScheduler(viewer, {
  idleDelayMs: 400,
  clearThrottleMs: 40,
  getPolicy: () => ({
    movingJobLimit: 1,
    idleJobLimit: 2,
    movingMaxTilesPerFrame: 1,
    idleMaxTilesPerFrame: 2,
    idlePreload: true,
    loadDestinationTilesOnAnimation: false,
  }),
  onStateChange: (state) => snapshots.push(state),
});

scheduler.syncPolicy();
assert.equal(loader.jobLimit, 2, 'idle restores configured decoder queue');
assert.equal(item.maxTilesPerFrame, 2, 'idle allows controlled refinement');
assert.equal(item._preload, true, 'idle may restore profile preload');

scheduler.notifyMotion('pan');
assert.equal(loader.jobLimit, 1, 'movement collapses concurrency');
assert.equal(item.maxTilesPerFrame, 1, 'movement loads one center-priority candidate per frame');
assert.equal(item._preload, false, 'movement disables preload');
assert.equal(loader.clearCalls, 1, 'movement purges queued stale jobs');
assert.equal(scheduler.snapshot.discardedQueuedJobs, 3, 'discarded queue is tracked');

scheduler.notifyIdle('test-idle');
assert.equal(loader.jobLimit, 2, 'idle restores queue limit');
assert.equal(item.maxTilesPerFrame, 2, 'idle restarts neighbor/viewport refinement');
assert.equal(item._preload, true, 'idle restores preload policy');
assert.ok(viewer.redraws >= 1, 'idle forces a redraw so refinement resumes');
assert.ok(snapshots.length >= 3, 'scheduler emits diagnostics snapshots');

scheduler.reset();
assert.equal(scheduler.snapshot.discardedQueuedJobs, 0, 'reset clears per-slide stats');
assert.equal(scheduler.snapshot.queueClears, 0, 'reset clears queue purge count');

scheduler.notifyMotion('timer-test');
assert.equal(scheduler.snapshot.moving, true, 'motion enters moving mode immediately');
await new Promise((resolve) => setTimeout(resolve, 430));
assert.equal(scheduler.snapshot.moving, false, 'scheduler refines only after the idle debounce');
assert.equal(loader.jobLimit, 2, 'idle debounce restores the configured queue');

console.log('Smart Tile Scheduler tests: OK');
