# Virtum SVS Viewer v0.5.3.2 · Adaptive Fast Start

Atualização focada em reduzir o tempo até a primeira imagem em tablets, Chromebooks e PCs de baixo consumo sem voltar aos erros de memória.

## Novidades

- Perfil **Low Power** específico para Chromebook e hardware modesto.
- Chromebook não entra mais automaticamente no modo de memória ultraconservador apenas por não informar `deviceMemory`.
- Low Power: 1 worker WASM, blocos de 2 MiB, broker 32 MiB, 2 leituras simultâneas, read-ahead 2, fila visual 2 e cache visual 32 tiles.
- Mobile mantém o caminho seguro e rápido da v0.5.3.1.
- Navigator desligado e `immediateRender` ativado também em dispositivos Low Power.
- `minPixelRatio` otimizado para priorizar a primeira visualização em hardware restrito.
- Benchmark passa a distinguir **Mobile / Low Power / Balanced / Strong**.
- Cronometragem do tempo total até a primeira imagem no diagnóstico e status.
- Cache de benchmark versionado novamente para forçar uma nova avaliação na primeira execução.

## Meta desta versão

Usar a mesma lâmina de teste para comparar o tempo até a primeira imagem. O objetivo principal é diminuir especialmente o tempo em Chromebook sem aumentar agressivamente workers ou memória.

## Execução local

```bash
npm install
npm run dev
```

## Vercel

O projeto continua Vercel-ready e mantém os headers necessários para OpenSlide/WASM.
