# Virtum SVS Viewer v0.5.10 · Mobile Heavy Open Rescue

## Objetivo

Evitar que tablets falhem antes do primeiro tile ao abrir SVS pesadas. A v0.5.10 move a proteção para antes de `OpenSlide.open(file)`.

## Alterações

- Rescue Mode automático em mobile/Memory Safe para arquivos >=250 MB.
- Fallback stock bloqueado para heavy mobile quando o Mobile WASM está ausente.
- Reinicialização limpa do runtime antes da abertura pesada.
- I/O Rescue: 1 worker, 1 leitura concorrente, read-ahead 0 e blocos de 1 MiB.
- Broker cache 12 MiB em Heavy e 8 MiB em Ultra Heavy.
- Tile queue 1, cache 10/8 tiles, preload e Predictive Navigation desligados.
- Open trace com tempos/estágios de WASM, initialize, openslide.open, DZI, primeiro tile e primeiro pixel.
- Diagnóstico mostra estágio de falha e trace.
- Pipeline Mobile WASM alterado para 384 MiB máximo, crescimento 5% e cap 8 MiB.

## Segurança de implantação

O pacote fonte contém o workflow que gera o Mobile WASM, não o binário compilado. Antes de testar SVS >=250 MB em tablet, execute **Build Mobile OpenSlide WASM** no GitHub e confirme que `public/wasm-mobile/manifest.json`, `openslide.js` e `openslide.wasm` existem.

## Testes

`npm run test:runtime` inclui o novo `test:rescue`.
