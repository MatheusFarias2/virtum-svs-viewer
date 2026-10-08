import assert from 'node:assert/strict';
import { MobileHeavyOpenRescue } from '../src/mobile-heavy-open-rescue.js';

let clock = 1000;
const rescue = new MobileHeavyOpenRescue({ now: () => clock });

assert.equal(rescue.isCandidate({ fileSize: 249 * 1024 * 1024, mobile: true }), false);
assert.equal(rescue.isCandidate({ fileSize: 250 * 1024 * 1024, mobile: true }), true);
assert.equal(rescue.isCandidate({ fileSize: 800 * 1024 * 1024, mobile: false }), false);
assert.equal(rescue.isCandidate({ fileSize: 800 * 1024 * 1024, memorySafe: true }), true);

assert.equal(rescue.begin({ fileName: 'heavy.svs', fileSize: 300 * 1024 * 1024, mobile: true }), true);
assert.equal(rescue.snapshot.profile.workerCount, 1);
assert.equal(rescue.snapshot.profile.maxConcurrentReads, 1);
assert.equal(rescue.snapshot.profile.readAhead, 0);
assert.equal(rescue.snapshot.profile.brokerCacheBytes, 12 * 1024 * 1024);
assert.equal(rescue.snapshot.profile.jobLimit, 1);
assert.equal(rescue.snapshot.profile.tileCacheCount, 10);
assert.equal(rescue.snapshot.profile.predictive, false);

clock += 45;
rescue.mark('openslide-open-begin');
clock += 180;
rescue.mark('openslide-open-end');
assert.equal(rescue.snapshot.trace.at(-1).atMs, 225);
assert.equal(rescue.requiresEngineRestart({ hasEngine: true, hasOpenSlide: true, engineRescueActive: true, wasmVariant: 'mobile-384' }), true);
assert.equal(rescue.acceptsMobileManifest({ ready: true, js: '/a.js', wasm: '/a.wasm', maximumMemoryMiB: 384 }), true);
assert.equal(rescue.acceptsMobileManifest({ ready: true, js: '/a.js', wasm: '/a.wasm', maximumMemoryMiB: 2048 }), false);

const ultra = rescue.profileFor(700 * 1024 * 1024);
assert.equal(ultra.brokerCacheBytes, 8 * 1024 * 1024);
assert.equal(ultra.tileCacheCount, 8);

rescue.fail('openslide.open', new Error('OOM'));
assert.equal(rescue.snapshot.failed, true);
assert.equal(rescue.snapshot.errorStage, 'openslide.open');

console.log('Mobile Heavy Open Rescue tests: OK');
