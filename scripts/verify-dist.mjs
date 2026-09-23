import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = join(root, 'dist');
const indexFile = join(dist, 'index.html');
const assetsDir = join(dist, 'assets');

const fail = (message) => {
  console.error(`\n[Virtum deploy check] ${message}`);
  process.exit(1);
};

if (!existsSync(indexFile)) fail('dist/index.html não foi gerado.');
if (!existsSync(assetsDir) || !statSync(assetsDir).isDirectory()) {
  fail('dist/assets não foi gerado.');
}

const html = readFileSync(indexFile, 'utf8');
if (!html.includes('Virtum SVS Viewer')) {
  fail('dist/index.html não parece ser o Virtum SVS Viewer.');
}

const assets = readdirSync(assetsDir, { recursive: true });
const jsAssets = assets.filter((name) => String(name).endsWith('.js'));
if (jsAssets.length === 0) fail('Nenhum bundle JavaScript foi encontrado em dist/assets.');

const totalFiles = assets.length + 1;
console.log(`[Virtum deploy check] OK · ${totalFiles} arquivos verificados no dist.`);
console.log('[Virtum deploy check] O isolamento COOP/COEP é aplicado pelo vercel.json em produção.');
