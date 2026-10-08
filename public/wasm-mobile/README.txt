Virtum Mobile WASM placeholder · v0.5.10

Para SVS pesada (>=250 MB) em mobile/tablet, o Mobile Heavy Open Rescue NAO usa
mais o fallback stock. Gere openslide.js / openslide.wasm / manifest.json pelo
workflow "Build Mobile OpenSlide WASM" antes de testar heavy slides.

Perfil Rescue esperado: initial 16 MiB, maximum 384 MiB, growth 5%, cap 8 MiB.
Desktop e laminas leves ainda podem usar o WASM padrao quando necessario.
