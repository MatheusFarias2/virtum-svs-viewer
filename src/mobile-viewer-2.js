/**
 * Virtum Mobile Viewer 2.0
 * Small interaction guard used by the mobile shell to distinguish a deliberate
 * long press from pan/pinch gestures and to suppress accidental taps after a
 * multi-touch gesture.
 */
export class MobileGestureGuard {
  constructor({ moveTolerancePx = 14, multiTouchCooldownMs = 480 } = {}) {
    this.moveTolerancePx = moveTolerancePx;
    this.multiTouchCooldownMs = multiTouchCooldownMs;
    this.pointers = new Map();
    this.multiTouchUntil = 0;
    this.longPressConsumedUntil = 0;
  }

  reset() {
    this.pointers.clear();
    this.multiTouchUntil = 0;
    this.longPressConsumedUntil = 0;
  }

  pointerDown(id, x, y, now = performance.now()) {
    this.pointers.set(id, { x, y, startX: x, startY: y, moved: false });
    if (this.pointers.size > 1) this.multiTouchUntil = now + this.multiTouchCooldownMs;
    return this.snapshot(now);
  }

  pointerMove(id, x, y, now = performance.now()) {
    const pointer = this.pointers.get(id);
    if (!pointer) return this.snapshot(now);
    pointer.x = x;
    pointer.y = y;
    const dx = x - pointer.startX;
    const dy = y - pointer.startY;
    if ((dx * dx) + (dy * dy) > this.moveTolerancePx * this.moveTolerancePx) pointer.moved = true;
    if (this.pointers.size > 1) this.multiTouchUntil = now + this.multiTouchCooldownMs;
    return this.snapshot(now);
  }

  pointerUp(id, now = performance.now()) {
    this.pointers.delete(id);
    return this.snapshot(now);
  }

  consumeLongPress(now = performance.now(), cooldownMs = 520) {
    this.longPressConsumedUntil = now + cooldownMs;
  }

  canLongPress(id, now = performance.now()) {
    const pointer = this.pointers.get(id);
    return Boolean(
      pointer &&
      !pointer.moved &&
      this.pointers.size === 1 &&
      now >= this.multiTouchUntil
    );
  }

  shouldBlockQuickTap(now = performance.now()) {
    return now < this.multiTouchUntil || now < this.longPressConsumedUntil;
  }

  snapshot(now = performance.now()) {
    return {
      pointerCount: this.pointers.size,
      multiTouchBlocked: now < this.multiTouchUntil,
      quickTapBlocked: this.shouldBlockQuickTap(now),
    };
  }
}

export function shouldAutoHideMobileChrome({
  enabled,
  hasSlide,
  toolActive = false,
  sidebarOpen = false,
  menuOpen = false,
  dialogOpen = false,
  presentationMode = false,
  lessonPresenting = false,
} = {}) {
  return Boolean(
    enabled && hasSlide && !toolActive && !sidebarOpen && !menuOpen &&
    !dialogOpen && !presentationMode && !lessonPresenting
  );
}
