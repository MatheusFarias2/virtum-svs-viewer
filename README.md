# Virtum SVS Viewer v0.5.3.4 · Heavy Slide Mobile

Versão focada em **lâminas SVS pesadas no mobile e em hardware Low Power**, especialmente arquivos a partir de **250 MiB**. A base de compatibilidade e o Mobile WASM da série v0.5.3 foram preservados.

## Objetivo

Reduzir o tempo até a **primeira imagem visível** sem voltar ao erro de memória que ocorria nos tablets. O Viewer continua usando apenas **1 worker WASM** em dispositivos limitados; a otimização está na prioridade das requisições e no fluxo de abertura.

## Faixas de abertura

- `< 100 MiB`: Fast Start normal.
- `100–249 MiB`: Progressive Open.
- `250–599 MiB`: **Heavy Mobile**.
- `>= 600 MiB`: **Ultra Heavy**.

## Heavy Mobile

Para arquivos de 250 MiB ou mais em tablet/Chromebook/Low Power:

- 1 worker WASM, evitando duplicação pesada de memória.
- I/O compartilhado com broker e cache moderado.
- Blocos de leitura de 2 MiB.
- Até 3 leituras de arquivo em andamento no broker.
- Read-ahead controlado para não disputar excessivamente com o primeiro tile.
- **Fila de renderização temporariamente limitada a 1** durante a primeira imagem.
- Cache visual inicial reduzido para 16 tiles.
- Assim que o primeiro tile aparece, a fila/cache retornam automaticamente ao perfil adaptativo normal.
- Preview progressivo recebe apenas **2,2 s** de orçamento. Se não sair rapidamente, é cancelado para o Deep Zoom assumir.

## Ultra Heavy

Em dispositivos limitados, arquivos a partir de 600 MiB **pulam o preview adicional**. Isso evita decodificar uma imagem provisória e logo depois repetir trabalho no OpenSeadragon.

O fluxo passa a ser:

```text
Cabeçalho
   ↓
Deep Zoom imediatamente
   ↓
1 tile prioritário
   ↓
Primeira imagem visível
   ↓
Fila/cache expandem
   ↓
Refinamento normal
```

## Diagnóstico

A aba de diagnóstico continua mostrando:

- tempo de cabeçalho;
- tempo do preview, quando usado;
- tempo até a primeira imagem detalhada;
- perfil de abertura (`Fast Start`, `Progressive`, `Heavy Mobile`, `Ultra Heavy`);
- fila atual e fila usada no startup;
- cache, worker, broker e engine WASM.

## Privacidade

O `.SVS` continua sendo processado localmente no navegador. A Vercel hospeda apenas o Viewer; a lâmina não é enviada ao servidor.
