import assert from 'node:assert/strict';
import { SmartCacheEngine } from '../src/smart-cache-engine.js';

let now = 10000;
const tiles = [];
const cache = {
  _maxCacheItemCount: 200,
  getLoadedTilesFor: () => [...tiles],
  unloadTile(tile) {
    const index = tiles.indexOf(tile);
    if (index >= 0) tiles.splice(index, 1);
    tile.loaded = false;
  },
};
const item = {};
const viewer = {
  tileCache: cache,
  maxImageCacheCount: 200,
  world: { getItemCount: () => 1, getItemAt: () => item },
  forceRedraw() {},
};

const engine = new SmartCacheEngine(viewer, { now: () => now, trimDelayMs: 80 });
engine.reset({ maxLevel: 12, tileSize: 254 });
engine.setBudget({ targetCount: 4, floorCount: 2, pressureLevel: 0 });
assert.equal(cache._maxCacheItemCount, 4, 'deve atualizar o limite real do TileCache');

engine.recordMiss({ level: 8, x: 1, y: 1 });
engine.recordLoaded({ level: 8, x: 1, y: 1 });
engine.observeScheduler({ moving: true });
now += 500;
engine.recordDraw({ level: 8, x: 1, y: 1 });
assert.equal(engine.snapshot.hits, 1, 'revisita em nova viewport deve contar como cache hit');

engine.recordMiss({ level: 8, x: 1, y: 1 });
assert.equal(engine.snapshot.redecodes, 1, 'tile já visto e decodificado de novo deve contar re-decode');

engine.observeScheduler({ moving: false });
for (let i = 0; i < 7; i += 1) {
  tiles.push({
    level: i < 2 ? 3 : (i < 5 ? 8 : 11),
    x: i,
    y: 0,
    loaded: true,
    beingDrawn: false,
    loading: false,
    processing: false,
    lastTouchTime: 1000 + i * 100,
  });
}
engine.focusLevel = 8;
const removed = engine.trimNow('test');
assert.equal(removed, 3, 'deve podar exatamente o overflow');
assert.equal(tiles.length, 4, 'deve respeitar o orçamento final');
assert.ok(tiles.some(tile => tile.level === 3), 'overview deve receber retenção preferencial');
assert.ok(tiles.some(tile => tile.level === 8), 'faixa atual deve receber retenção preferencial');
assert.equal(engine.snapshot.trimmedTiles, 3);

console.log('Smart Cache Engine tests: OK');
