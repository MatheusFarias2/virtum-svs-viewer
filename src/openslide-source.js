import OpenSeadragon from 'openseadragon';

/**
 * Adaptação enxuta do TileSource usado no demo oficial do openslide-js.
 * Usa vários DeepZoomGenerators para distribuir a decodificação entre workers.
 */
export function createOpenSlideTileSource(generators, slideName, hooks = {}) {
  const dz = generators[0];
  const info = dz.getDziInfo('jpeg');
  const maxLevel = dz.levelCount - 1;
  const levelDimensions = dz.levelDimensions;
  const levelTiles = dz.levelTiles;
  let roundRobin = 0;

  const tileSource = new OpenSeadragon.TileSource({
    width: info.width,
    height: info.height,
    tileWidth: info.tileSize,
    tileHeight: info.tileSize,
    tileOverlap: info.overlap,
    minLevel: 0,
    maxLevel,
  });

  const ts = tileSource;
  const aborted = new WeakSet();
  const controllers = new Map();

  ts.getTileUrl = (level, x, y) => `openslide://${encodeURIComponent(slideName)}/${level}/${x}/${y}`;

  ts.getLevelScale = (level) => {
    const dim = levelDimensions[level];
    return dim ? dim.width / info.width : 0;
  };

  ts.getNumTiles = (level) => {
    const tiles = levelTiles[level];
    return tiles
      ? new OpenSeadragon.Point(tiles.columns, tiles.rows)
      : new OpenSeadragon.Point(0, 0);
  };

  ts.tileExists = (level, x, y) => {
    const tiles = levelTiles[level];
    return Boolean(tiles && x >= 0 && y >= 0 && x < tiles.columns && y < tiles.rows);
  };

  ts.downloadTileStart = (context) => {
    const { level, x, y } = context.tile;
    const startedAt = performance.now();
    hooks.onTileStart?.({ level, x, y, startedAt });
    const generator = generators[roundRobin++ % generators.length];
    const controller = new AbortController();
    controllers.set(context, controller);

    generator.getTile(level, x, y, { signal: controller.signal })
      .then(async (imageData) => {
        controllers.delete(context);
        if (aborted.has(context)) return;

        const decodedAt = performance.now();
        const decodeMs = decodedAt - startedAt;
        hooks.onTileDecoded?.({ level, x, y, decodeMs, decodedAt, width: imageData?.width, height: imageData?.height });

        const bitmapStartedAt = performance.now();
        const bitmap = await createImageBitmap(imageData);
        if (aborted.has(context)) {
          bitmap.close();
          return;
        }

        const finishedAt = performance.now();
        hooks.onTileLoaded?.({
          level, x, y,
          decodeMs,
          bitmapMs: finishedAt - bitmapStartedAt,
          totalMs: finishedAt - startedAt,
          finishedAt,
        });
        context.finish(bitmap, null, 'imageBitmap');
      })
      .catch((error) => {
        controllers.delete(context);
        if (error?.name === 'AbortError' || aborted.has(context) || error?.message === 'aborted') return;
        hooks.onTileError?.({ level, x, y, error });
        context.finish(null, null, error?.message || 'Falha ao carregar bloco da lâmina');
      });
  };

  ts.downloadTileAbort = (context) => {
    const { level, x, y } = context.tile;
    aborted.add(context);
    controllers.get(context)?.abort();
    controllers.delete(context);
    hooks.onTileAbort?.({ level, x, y });
  };

  ts.hasTransparency = () => false;
  return tileSource;
}
