# Virtum SVS Viewer v0.5.9 · Benchmark & Diagnostics

A v0.5.9 fecha a linha de otimização 0.5.x com instrumentação de sessão. O Viewer agora mede o comportamento real de cada lâmina, em vez de depender apenas do benchmark sintético do dispositivo.

## Benchmark da sessão

- First Pixel e tempo até o estado Interactive.
- FPS atual e médio durante navegação real.
- frame time p95, pior frame e contagem de frames acima de 50 ms.
- latência média e p95 de tiles.
- latência média e p95 de decode, além do custo de criação do bitmap.
- hit rate, hits, misses e re-decodes do Smart Cache.
- pico de Adaptive Backpressure, score de pressão e maior event-loop lag observado.
- pico de fila e jobs simultâneos.
- falhas e abortos de tiles.
- score resumido de 0 a 100 para facilitar comparação entre dispositivos/sessões.

## Relatórios

O painel Diagnóstico ganhou ações para:

- copiar um relatório textual;
- exportar JSON estruturado (`virtum-svs-benchmark-v1`);
- zerar a sessão e repetir um teste sem reabrir o aplicativo.

Os dados são processados localmente no navegador e não são enviados pelo Viewer.

## Compatibilidade

Mantém integralmente:

- Heavy Slide Engine;
- Smart Tile Scheduler;
- Adaptive Backpressure;
- Smart Cache Engine;
- Predictive Navigation;
- Instant Open;
- Mobile Viewer 2.0.
