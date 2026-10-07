/**
 * Virtum Smart Cache Engine
 *
 * Governa o TileCache nativo do OpenSeadragon 6 em vez de manter uma segunda
 * cópia dos bitmaps. Mantém estatísticas de reutilização, um orçamento de cache
 * adaptativo e poda LRU consciente do nível da pirâmide.
 */
export class SmartCacheEngine {
  constructor(viewer, options = {}) {
    this.viewer = viewer;
    this.now = typeof options.now === 'function' ? options.now : () => performance.now();
    this.onStateChange = typeof options.onStateChange === 'function' ? options.onStateChange : () => {};
    this.trimDelayMs = Math.max(80, Number(options.trimDelayMs) || 260);
    this.hitCooldownMs = Math.max(100, Number(options.hitCooldownMs) || 350);
    this.reset({ emit: false });
  }

  reset({ maxLevel = null, tileSize = 254, emit = true } = {}) {
    if (this.trimTimer) {
      clearTimeout(this.trimTimer);
      this.trimTimer = null;
    }
    this.maxLevel = Number.isFinite(maxLevel) ? Number(maxLevel) : null;
    this.tileSize = Math.max(1, Number(tileSize) || 254);
    this.targetCount = 160;
    this.floorCount = 16;
    this.pressureLevel = 0;
    this.moving = false;
    this.viewportEpoch = 0;
    this.lastSchedulerMoving = false;
    this.focusLevel = null;
    this.focusLevelSeenAt = 0;
    this.hits = 0;
    this.misses = 0;
    this.redecodes = 0;
    this.loads = 0;
    this.evictions = 0;
    this.trimRuns = 0;
    this.trimmedTiles = 0;
    this.lastTrimReason = 'standby';
    this.lastTrimAt = 0;
    this.levelHits = new Map();
    this.levelMisses = new Map();
    this.meta = new Map();
    this.everSeen = new Set();
    if (emit) this._emit();
  }

  get item() {
    try {
      return this.viewer?.world?.getItemCount?.() > 0 ? this.viewer.world.getItemAt(0) : null;
    } catch (_) {
      return null;
    }
  }

  get snapshot() {
    const tiles = this._loadedTiles();
    const levels = {};
    for (const tile of tiles) {
      const level = Number(tile?.level);
      if (!Number.isFinite(level)) continue;
      levels[level] = (levels[level] || 0) + 1;
    }
    const estimatedMiB = (tiles.length * this.tileSize * this.tileSize * 4) / (1024 * 1024);
    const totalDecisions = this.hits + this.misses;
    return {
      targetCount: this.targetCount,
      floorCount: this.floorCount,
      loadedCount: tiles.length,
      focusLevel: this.focusLevel,
      maxLevel: this.maxLevel,
      pressureLevel: this.pressureLevel,
      moving: this.moving,
      viewportEpoch: this.viewportEpoch,
      hits: this.hits,
      misses: this.misses,
      redecodes: this.redecodes,
      hitRate: totalDecisions ? Math.round((this.hits / totalDecisions) * 100) : 0,
      evictions: this.evictions,
      trimRuns: this.trimRuns,
      trimmedTiles: this.trimmedTiles,
      lastTrimReason: this.lastTrimReason,
      estimatedMiB: Number(estimatedMiB.toFixed(1)),
      levels,
    };
  }

  setSlideInfo({ maxLevel = null, tileSize = null } = {}) {
    if (Number.isFinite(maxLevel)) this.maxLevel = Number(maxLevel);
    if (Number.isFinite(tileSize) && tileSize > 0) this.tileSize = Number(tileSize);
    this._emit();
  }

  setBudget({ targetCount, floorCount, pressureLevel = 0 } = {}) {
    const previousTarget = this.targetCount;
    if (Number.isFinite(floorCount) && floorCount > 0) this.floorCount = Math.round(floorCount);
    if (Number.isFinite(targetCount) && targetCount > 0) {
      this.targetCount = Math.max(this.floorCount, Math.round(targetCount));
    }
    this.pressureLevel = Math.max(0, Math.min(3, Math.round(Number(pressureLevel) || 0)));
    this._applyNativeLimit();

    const loaded = this._loadedTiles().length;
    if (loaded > this.targetCount || this.targetCount < previousTarget) {
      this.requestTrim(this.pressureLevel >= 2 ? 'backpressure' : 'budget');
    }
    this._emit();
  }

  observeScheduler(snapshot = {}) {
    const moving = Boolean(snapshot.moving);
    if (moving && !this.lastSchedulerMoving) this.viewportEpoch += 1;
    this.lastSchedulerMoving = moving;
    this.moving = moving;
    if (!moving) this.requestTrim('idle');
    this._emit();
  }

  recordMiss({ level, x, y } = {}) {
    const key = this._key(level, x, y);
    this.misses += 1;
    this._inc(this.levelMisses, level);
    if (key && this.everSeen.has(key)) this.redecodes += 1;
    if (key) this.everSeen.add(key);
    this._emit();
  }

  recordLoaded({ level, x, y } = {}) {
    const now = this.now();
    const key = this._key(level, x, y);
    if (key) {
      const previous = this.meta.get(key) || {};
      this.meta.set(key, {
        ...previous,
        level: Number(level),
        loadedAt: now,
        loadedEpoch: this.viewportEpoch,
        lastDrawAt: previous.lastDrawAt || 0,
        lastHitEpoch: previous.lastHitEpoch ?? -1,
      });
      this.everSeen.add(key);
    }
    this.loads += 1;
    this._emit();
  }

  recordDraw(tile) {
    if (!tile) return;
    const level = Number(tile.level);
    const key = this._key(level, tile.x, tile.y);
    const now = this.now();
    if (Number.isFinite(level)) {
      this.focusLevel = level;
      this.focusLevelSeenAt = now;
    }
    if (!key) return;

    const meta = this.meta.get(key);
    if (!meta) {
      // Tile já estava no cache antes de o motor receber o primeiro evento.
      this.meta.set(key, {
        level,
        loadedAt: 0,
        loadedEpoch: Math.max(0, this.viewportEpoch - 1),
        lastDrawAt: now,
        lastHitEpoch: this.viewportEpoch,
      });
      return;
    }

    const revisitedEpoch = meta.loadedEpoch < this.viewportEpoch && meta.lastHitEpoch !== this.viewportEpoch;
    const cooledDown = !meta.lastDrawAt || now - meta.lastDrawAt >= this.hitCooldownMs;
    if (revisitedEpoch && cooledDown) {
      this.hits += 1;
      this._inc(this.levelHits, level);
      meta.lastHitEpoch = this.viewportEpoch;
    }
    meta.lastDrawAt = now;
    this.meta.set(key, meta);
  }

  recordUnloaded({ tile, destroyed = true } = {}) {
    if (!tile) return;
    const key = this._key(tile.level, tile.x, tile.y);
    if (destroyed && key) this.meta.delete(key);
    this._emit();
  }

  requestTrim(reason = 'scheduled') {
    if (this.moving && this.pressureLevel < 3) return;
    if (this.trimTimer) return;
    this.trimTimer = setTimeout(() => {
      this.trimTimer = null;
      this.trimNow(reason);
    }, this.pressureLevel >= 2 ? 0 : this.trimDelayMs);
  }

  trimNow(reason = 'manual') {
    if (this.moving && this.pressureLevel < 3) return 0;
    const cache = this.viewer?.tileCache;
    const item = this.item;
    if (!cache || typeof cache.getLoadedTilesFor !== 'function' || typeof cache.unloadTile !== 'function') return 0;

    const tiles = cache.getLoadedTilesFor(item || null) || [];
    const overflow = Math.max(0, tiles.length - this.targetCount);
    if (!overflow) {
      this._applyNativeLimit();
      return 0;
    }

    const focus = Number.isFinite(this.focusLevel)
      ? this.focusLevel
      : this._inferFocusLevel(tiles);
    const candidates = tiles
      .filter(tile => tile && tile.loaded && !tile.beingDrawn && !tile.loading && !tile.processing)
      .map(tile => ({ tile, score: this._retentionScore(tile, focus) }))
      .sort((a, b) => a.score - b.score || (Number(a.tile.lastTouchTime || 0) - Number(b.tile.lastTouchTime || 0)));

    let removed = 0;
    for (const { tile } of candidates) {
      if (removed >= overflow) break;
      try {
        cache.unloadTile(tile, true);
        removed += 1;
        this.evictions += 1;
        const key = this._key(tile.level, tile.x, tile.y);
        if (key) this.meta.delete(key);
      } catch (_) {
        // Cache pode mudar entre coleta e poda; nesse caso apenas ignora o tile.
      }
    }

    this.trimRuns += 1;
    this.trimmedTiles += removed;
    this.lastTrimReason = reason;
    this.lastTrimAt = this.now();
    this._applyNativeLimit();
    if (removed) {
      try { this.viewer?.forceRedraw?.(); } catch (_) {}
    }
    this._emit();
    return removed;
  }

  _retentionScore(tile, focus) {
    const level = Number(tile?.level);
    const lastTouch = Number(tile?.lastTouchTime || 0);
    const ageSeconds = Math.max(0, (this.now() - lastTouch) / 1000);
    let band = 1;

    if (Number.isFinite(level) && Number.isFinite(focus)) {
      const delta = level - focus;
      if (Math.abs(delta) <= 1) band = 5;          // faixa atual: retenção máxima
      else if (delta <= -3) band = 4;              // overview barato para navegação
      else if (delta === -2) band = 3;             // ponte entre overview e foco
      else if (delta >= 2) band = 1;               // detalhe fino fora do zoom atual
      else band = 2;
    }

    // Pressão alta reduz o prêmio dos tiles antigos, mas continua protegendo a
    // faixa atual e o overview. Menor score = primeiro candidato à poda.
    const pressurePenalty = this.pressureLevel * 0.35;
    return (band * 1000) - (ageSeconds * (8 + pressurePenalty * 5));
  }

  _inferFocusLevel(tiles) {
    const counts = new Map();
    for (const tile of tiles) {
      const level = Number(tile?.level);
      if (!Number.isFinite(level)) continue;
      counts.set(level, (counts.get(level) || 0) + 1);
    }
    let bestLevel = null;
    let bestCount = -1;
    for (const [level, count] of counts) {
      if (count > bestCount || (count === bestCount && level > bestLevel)) {
        bestLevel = level;
        bestCount = count;
      }
    }
    return bestLevel;
  }

  _loadedTiles() {
    try {
      const cache = this.viewer?.tileCache;
      if (!cache?.getLoadedTilesFor) return [];
      return cache.getLoadedTilesFor(this.item || null) || [];
    } catch (_) {
      return [];
    }
  }

  _applyNativeLimit() {
    const cache = this.viewer?.tileCache;
    if (!cache) return;
    try {
      // OpenSeadragon 6 lê o limite efetivo deste campo no TileCache já criado.
      cache._maxCacheItemCount = this.targetCount;
    } catch (_) {}
    try { this.viewer.maxImageCacheCount = this.targetCount; } catch (_) {}
  }

  _key(level, x, y) {
    if (![level, x, y].every(value => Number.isFinite(Number(value)))) return null;
    return `${Number(level)}/${Number(x)}/${Number(y)}`;
  }

  _inc(map, level) {
    const key = Number(level);
    if (!Number.isFinite(key)) return;
    map.set(key, (map.get(key) || 0) + 1);
  }

  _emit() {
    try { this.onStateChange(this.snapshot); } catch (_) {}
  }
}
