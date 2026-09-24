# OpenSlide WASM Mobile · Virtum

O Virtum v0.5.3.1 consegue usar um build específico do `openslide-js` em tablets.
O código do visualizador procura primeiro por:

- `/wasm-mobile/manifest.json`
- `/wasm-mobile/openslide.js`
- `/wasm-mobile/openslide.wasm`

Se esses arquivos não existirem, o Viewer usa automaticamente o WASM padrão do
pacote NPM. Portanto o projeto continua funcionando antes do build móvel.

## O que muda no build móvel

O pipeline mantém o OpenSlide e a ABI do projeto upstream, mas recompila o glue
WASM com parâmetros de memória mais conservadores:

```text
INITIAL_MEMORY = 16 MiB
MAXIMUM_MEMORY = 512 MiB
ALLOW_MEMORY_GROWTH = on
MEMORY_GROWTH_GEOMETRIC_STEP = 10%
MEMORY_GROWTH_GEOMETRIC_CAP = 16 MiB
USE_PTHREADS = 1 (mantido do upstream)
```

O objetivo é reduzir a pressão de endereço/memória do navegador móvel sem trocar
a implementação do OpenSlide.

## Jeito recomendado

No GitHub, abra **Actions → Build Mobile OpenSlide WASM → Run workflow**.
O workflow recompila o WASM em Docker, gera o `manifest.json` e faz commit dos
arquivos em `public/wasm-mobile/`. Esse commit dispara um novo deploy na Vercel
quando o repositório estiver conectado.

O build oficial do `openslide-js` requer Docker. O workflow usa exatamente esse
caminho e aplica `mobile-wasm/patch-build.py` antes da compilação.

## Build manual

```bash
git clone https://github.com/computationalpathologygroup/openslide-js.git .mobile-wasm-src
python mobile-wasm/patch-build.py .mobile-wasm-src
docker build -t virtum-openslide-mobile .mobile-wasm-src/wasm
mkdir -p .mobile-wasm-src/wasm/dist
docker run --rm -v "$PWD/.mobile-wasm-src/wasm/dist:/output" virtum-openslide-mobile
cp -a .mobile-wasm-src/wasm/dist/. public/wasm-mobile/
```

Depois crie `public/wasm-mobile/manifest.json` seguindo o exemplo em
`manifest.template.json`.

## Licença / código-fonte

`openslide-js` é LGPL-2.1-only. Ao distribuir o binário recompilado, mantenha a
referência ao código-fonte upstream, o commit usado e a alteração aplicada. O
workflow gera `SOURCE.md` com o commit exato e copia `LICENSE`/`NOTICE` quando
presentes.
