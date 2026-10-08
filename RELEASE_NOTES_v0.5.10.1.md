# Virtum SVS Viewer v0.5.10.1 · Mobile Heavy Open Rescue Hotfix

## Correção crítica

A v0.5.10 bloqueava deliberadamente SVS >=250 MB em mobile quando `/wasm-mobile/openslide.js`, `openslide.wasm` e `manifest.json` não estavam publicados. Como o ZIP de distribuição continha apenas o pipeline/template, um arquivo de 287 MB podia ser rejeitado antes mesmo de `OpenSlide.open(file)`.

A v0.5.10.1 remove esse bloqueio.

- Mobile WASM customizado continua preferencial quando disponível.
- Na ausência dele, entra `stock-rescue` em vez de falhar.
- Rescue usa 1 worker.
- Rescue tenta I/O local primeiro, evitando o broker worker extra durante a abertura.
- Broker mínimo fica apenas como fallback de compatibilidade para erros não relacionados a memória.
- Cache, fila, read-ahead e Predictive continuam restritos pelo perfil Rescue.
- A trilha de diagnóstico registra `mobile-wasm-fallback` quando o stock é usado.

## Objetivo

Permitir que tablets realmente tentem abrir SVS de 250 MB+ com o runtime disponível, sem remover as proteções de memória.
