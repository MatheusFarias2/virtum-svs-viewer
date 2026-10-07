import assert from 'node:assert/strict';
import { MobileGestureGuard, shouldAutoHideMobileChrome } from '../src/mobile-viewer-2.js';

const guard = new MobileGestureGuard({ moveTolerancePx: 10, multiTouchCooldownMs: 400 });
let now = 1000;
guard.pointerDown(1, 20, 20, now);
assert.equal(guard.canLongPress(1, now + 200), true);
guard.pointerMove(1, 25, 24, now + 220);
assert.equal(guard.canLongPress(1, now + 230), true, 'movimento pequeno deve preservar long press');
guard.pointerMove(1, 45, 20, now + 250);
assert.equal(guard.canLongPress(1, now + 260), false, 'pan deve cancelar long press');
guard.pointerUp(1, now + 280);

guard.pointerDown(1, 10, 10, now + 500);
guard.pointerDown(2, 30, 30, now + 510);
assert.equal(guard.shouldBlockQuickTap(now + 520), true, 'pinch deve bloquear clique acidental');
guard.pointerUp(2, now + 540);
guard.pointerUp(1, now + 550);
assert.equal(guard.shouldBlockQuickTap(now + 700), true, 'cooldown multitouch deve permanecer por alguns ms');
assert.equal(guard.shouldBlockQuickTap(now + 950), false);

guard.pointerDown(3, 0, 0, now + 1000);
guard.consumeLongPress(now + 1100);
assert.equal(guard.shouldBlockQuickTap(now + 1200), true, 'long press deve suprimir clique seguinte');

assert.equal(shouldAutoHideMobileChrome({ enabled: true, hasSlide: true }), true);
assert.equal(shouldAutoHideMobileChrome({ enabled: true, hasSlide: true, toolActive: true }), false);
assert.equal(shouldAutoHideMobileChrome({ enabled: true, hasSlide: true, sidebarOpen: true }), false);
assert.equal(shouldAutoHideMobileChrome({ enabled: false, hasSlide: true }), false);

console.log('Mobile Viewer 2.0 tests: OK');
