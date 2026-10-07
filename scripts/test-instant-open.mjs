import assert from 'node:assert/strict';
import { InstantOpenEngine } from '../src/instant-open.js';

let now = 1000;
const engine = new InstantOpenEngine({ now: () => now });
engine.begin({ mode: 'heavy', fileSize: 300 * 1024 * 1024 });
now += 120;
engine.markHeader();
now += 8;
engine.markPyramid();
now += 2;
engine.markViewerOpen();
now += 340;
engine.markFirstTile();
now += 20;
engine.markFirstPixel('tile');
now += 100;
engine.markDeferredStart();
now += 80;
engine.markInteractive();

const snap = engine.snapshot;
assert.equal(snap.stage, 'interactive');
assert.equal(snap.headerMs, 120);
assert.equal(snap.viewerOpenMs, 130);
assert.equal(snap.firstPixelMs, 490);
assert.equal(snap.firstPixelSource, 'tile');
assert.equal(snap.interactiveMs, 670);
assert.equal(snap.deferredDone, true);

now += 500;
engine.markFirstPixel('preview');
assert.equal(engine.snapshot.firstPixelMs, 490, 'primeiro pixel não pode ser sobrescrito');
assert.equal(engine.snapshot.firstPixelSource, 'tile');

console.log('Instant Open tests: OK');
