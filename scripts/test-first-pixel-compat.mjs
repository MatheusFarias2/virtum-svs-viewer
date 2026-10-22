import assert from 'node:assert/strict';
import { FirstPixelCompatGate } from '../src/first-pixel-compat.js';

let now = 1000;
let timerCb = null;
let confirms = [];
const gate = new FirstPixelCompatGate({
  now: () => now,
  setTimer: (fn) => { timerCb = fn; return 1; },
  clearTimer: () => { timerCb = null; },
  canWatchdogConfirm: () => true,
  onConfirm: (event) => confirms.push(event),
});

gate.arm({ watchdogMs: 1200 });
assert.equal(gate.observeViewportFrame(), false, 'frame não pode confirmar antes do rAF liberar');
gate.allowViewportFrame();
now = 1080;
assert.equal(gate.observeViewportFrame(), true, 'update-viewport deve confirmar WebGL');
assert.equal(confirms[0].source, 'viewport-frame');
assert.equal(confirms[0].elapsedMs, 80);
assert.equal(gate.observeTileDrawn(), false, 'confirmação deve ocorrer uma vez');

gate.reset();
confirms = [];
gate.arm({ watchdogMs: 1200 });
now = 1110;
assert.equal(gate.observeTileDrawn(), true, 'tile-drawn continua válido no Canvas/HTML drawer');
assert.equal(confirms[0].source, 'tile-drawn');

gate.reset();
confirms = [];
gate.arm({ watchdogMs: 1200 });
now = 2500;
assert.ok(timerCb, 'watchdog deve ser armado');
timerCb();
assert.equal(confirms[0].source, 'paint-watchdog', 'watchdog evita loop eterno');

console.log('First Pixel Compatibility tests: OK');
