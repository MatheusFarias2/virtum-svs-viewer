import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const workflow = readFileSync(new URL('../.github/workflows/build-mobile-wasm.yml', import.meta.url), 'utf8');
const patch = readFileSync(new URL('../mobile-wasm/patch-build.py', import.meta.url), 'utf8');
const manifest = JSON.parse(readFileSync(new URL('../public/wasm-mobile/manifest.template.json', import.meta.url), 'utf8'));

for (const needle of [
  "state.wasmVariant = 'stock-rescue'",
  "markRescueStage('mobile-wasm-fallback'",
  "state.openslide = await tryLocal('Rescue · I/O local mínimo')",
  "markRescueStage('openslide-open-begin'",
  "markRescueStage('openslide-open-end'",
  "markRescueStage('first-tile-request'",
  'restartEngineForMobileHeavyRescue(file)',
  "reason = 'Mobile Heavy Rescue'",
]) assert.ok(main.includes(needle), `main.js sem integração: ${needle}`);

assert.ok(html.includes('id="diagRescue"'));
assert.ok(html.includes('id="startupDiagRescue"'));
assert.equal(manifest.maximumMemoryMiB, 384);
assert.ok(workflow.includes('"maximumMemoryMiB": 384'));
assert.ok(patch.includes('MAXIMUM_MEMORY=402653184'));
assert.ok(patch.includes('MEMORY_GROWTH_GEOMETRIC_STEP=0.05'));
assert.ok(patch.includes('MEMORY_GROWTH_GEOMETRIC_CAP=8388608'));

console.log('Mobile Heavy Rescue integration tests: OK');
