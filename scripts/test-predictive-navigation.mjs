import assert from 'node:assert/strict';
import { PredictiveNavigation } from '../src/predictive-navigation.js';

let now = 0;
const timers = [];
const timerApi = {
  setTimeout(fn) { timers.push(fn); return timers.length; },
  clearTimeout() {},
};
const source = {
  dimensions: { x: 4096, y: 2048 },
  maxLevel: 4,
  getNumTiles: () => ({ x: 8, y: 4 }),
  getTileAtPoint: (_level, p) => ({ x: Math.min(7, Math.floor(p.x * 8)), y: Math.min(3, Math.floor((p.y * 4096 / 2048) * 4)) }),
  tileExists: (_l, x, y) => x >= 0 && x < 8 && y >= 0 && y < 4,
};
let center = { x: 1024, y: 900 };
const viewport = {
  getCenter: () => ({ ...center }),
  getBounds: () => ({ x: center.x - 256, y: center.y - 128, width: 512, height: 256 }),
};
const tiles = new Map();
const item = {
  source,
  lastDrawn: [{ level: 4, tile: { level: 4 } }],
  viewportToImageCoordinates: p => p,
  viewportToImageRectangle: r => r,
  _getTile(x, y, level) {
    const key = `${level}/${x}/${y}`;
    if (!tiles.has(key)) tiles.set(key, { level, x, y, exists: true, loaded: false, loading: false });
    return tiles.get(key);
  },
  _tryFindTileCacheRecord: () => false,
  _loadTile(tile) { tile.loading = true; },
};
const viewer = {
  viewport,
  world: { getItemCount: () => 1, getItemAt: () => item },
  imageLoader: { jobQueue: [], jobsInProgress: 0, jobLimit: 4 },
};
const nav = new PredictiveNavigation(viewer, {
  now: () => now,
  timerApi,
  quietDelayMs: 150,
  getPolicy: () => ({ enabled: true, maxTiles: 2, pressureLevel: 0, cacheLoadRatio: 0.2, maxCacheLoadRatio: 0.8, focusLevel: 4 }),
});

nav.notifyPan();
now += 100;
center = { x: 1224, y: 900 };
nav.notifyPan();
assert(nav.snapshot.directionX > 0.9, 'deve aprender pan para a direita');
assert(nav.snapshot.speedViewportPerSec > 1, 'deve medir velocidade relativa');
const launched = nav.runPrediction();
assert(launched >= 1 && launched <= 2, 'deve antecipar poucos tiles');
assert.equal(nav.snapshot.predictions, 1);
assert.equal(nav.snapshot.requested, launched);

const firstPending = [...nav.pending.values()][0];
firstPending.loaded = true;
firstPending.loading = false;
nav.observeTileLoaded(firstPending);
assert(nav.snapshot.completed >= 1, 'deve contabilizar tile preditivo concluído');

const guarded = new PredictiveNavigation(viewer, {
  now: () => now,
  timerApi,
  getPolicy: () => ({ enabled: true, maxTiles: 2, pressureLevel: 2, cacheLoadRatio: 0.1, focusLevel: 4 }),
});
guarded.samples = [{ at: 0, x: 100, y: 100, width: 512, height: 256 }, { at: 100, x: 300, y: 100, width: 512, height: 256 }];
guarded.direction = { x: 1, y: 0 };
guarded.speedViewportPerSec = 2;
assert.equal(guarded.runPrediction(), 0, 'backpressure deve bloquear previsão');
assert.equal(guarded.snapshot.lastReason, 'backpressure');

console.log('Predictive Navigation tests: OK');
