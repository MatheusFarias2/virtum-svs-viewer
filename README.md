# Virtum SVS Viewer v0.5.4.2 · Smart Tile Scheduler

Fase 3 da linha de otimização para lâminas SVS pesadas em tablet, Chromebook e dispositivos com pouca memória.

A meta desta versão é simples: durante pan/zoom, CPU + WASM devem trabalhar somente no que ainda faz sentido para a viewport atual.

## O que mudou

- **Centro primeiro**: mantém o ordenamento do OpenSeadragon por visibilidade/distância e reduz a cadência para que o tile mais relevante seja solicitado antes dos vizinhos e do restante da viewport.
- **Pan/zoom enxuto**: durante movimento, o scheduler reduz `maxTilesPerFrame` para 1.
- **Concorrência móvel reduzida**: em tablet/Chromebook/low-power, o limite cai para 1 job durante o gesto.
- **Fila velha descartada**: jobs do OpenSeadragon que ainda não começaram são removidos quando a viewport muda, evitando decodificar regiões abandonadas.
- **Sem prefetch em movimento**: preload e destination-tile loading ficam desligados enquanto a imagem está sendo movida ou ampliada.
- **Refino após pausa**: depois de aproximadamente 400 ms sem movimento, o scheduler libera novamente o refinamento da viewport.
- **Refino progressivo**: dispositivos limitados voltam para até 2 tiles/frame em repouso; desktops fortes podem usar até 3 tiles/frame.
- **Sem aborto perigoso de job ativo**: tiles que já começaram a decodificar não são abortados à força, evitando o comportamento do OSD 6 que pode marcar o tile como inexistente após um abort de job iniciado.
- **Diagnóstico ampliado**: mostra estado do scheduler, limite da fila, tiles/frame e quantidade de jobs antigos descartados.

## Comportamento esperado

### Enquanto o usuário move ou dá zoom

1. tile central / mais relevante;
2. vizinhos imediatos;
3. restante da região visível somente conforme houver espaço;
4. sem aquecer regiões fora do caminho atual.

### Quando o usuário para

Após ~400 ms:

- a fila volta ao limite definido pelo perfil;
- o refinamento dos detalhes continua;
- preload só volta se o perfil e o dispositivo permitirem;
- a viewport é redesenhada para retomar os tiles pendentes.

## Segurança herdada da linha Heavy Safe

As proteções anteriores continuam ativas:

- `<100 MB`: Fast Start;
- `100–249 MB`: Progressive;
- `250–599 MB`: Heavy Safe;
- `>=600 MB`: Ultra Safe;
- Heavy mobile: 1 worker, bloco 1 MiB, broker 24 MiB, até 2 leituras;
- Ultra Safe mobile: 1 worker, bloco 1 MiB, broker 16 MiB, 1 leitura;
- preview manual continua desativado em `>=250 MB` em mobile/low-power.

## Teste recomendado

Use a mesma lâmina de aproximadamente **264 MB** que antes demorava/travava no tablet.

1. Meça o tempo até a primeira imagem.
2. Faça pan contínuo por 10–15 s.
3. Faça zoom in/out rapidamente em regiões diferentes.
4. Pare por ~1 s e confirme que os detalhes refinam.
5. Repita por 30–60 s observando se a memória permanece estável.
6. Abra o diagnóstico e confira `Smart Tile Scheduler`, `max/frame` e `Scheduler descartes`.

## Teste automatizado do scheduler

```bash
npm run test:scheduler
```

## Vercel

O projeto continua pronto para Vercel, mantendo COOP/COEP e o Mobile WASM da linha v0.5.3+.
