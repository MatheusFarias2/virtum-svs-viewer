# Virtum SVS Viewer v0.5.3.5 · Heavy Safe Progressive

Hotfix de estabilidade para lâminas SVS pesadas em tablet/Chromebook, especialmente a partir de 250 MB.

## O que mudou

- Remove o preview manual concorrente em lâminas >=250 MB em mobile/low-power.
- Evita o cenário em que um preview abortado continua ocupando o único worker WASM enquanto o Deep Zoom espera.
- Heavy (250–599 MB): 1 worker, bloco 1 MiB, broker 24 MiB, 2 leituras, read-ahead 1.
- Ultra Safe (600 MB+): 1 worker, bloco 1 MiB, broker 16 MiB, 1 leitura, sem read-ahead.
- Fila inicial: 2 em Heavy e 1 em Ultra Safe.
- Cache inicial: 20 tiles em Heavy e 12 em Ultra Safe.
- O primeiro conteúdo visível passa a vir do próprio OpenSeadragon/Deep Zoom nas lâminas pesadas.
- Mantém Progressive Preview somente para 100–249 MB, faixa que já vinha funcionando bem.

## Motivo da correção

A v0.5.3.4 aumentou agressividade de I/O em >=250 MB e ainda podia iniciar um preview separado antes do Deep Zoom. Em dispositivos limitados, isso podia pressionar memória e, principalmente, monopolizar o único worker de decodificação. A v0.5.3.5 prioriza previsibilidade e abertura real antes de aquecer o restante.

## Faixas

- <100 MB: Fast Start
- 100–249 MB: Progressive
- 250–599 MB: Heavy Safe
- >=600 MB: Ultra Safe

## Teste sugerido

Use primeiro a mesma lâmina de 264 MB que travava na v0.5.3.4. Meça até a primeira imagem e depois teste zoom/pan por 30–60 segundos.

## Vercel

O projeto continua pronto para Vercel, mantendo COOP/COEP e o Mobile WASM da linha v0.5.3.
