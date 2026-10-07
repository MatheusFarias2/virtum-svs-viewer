# Virtum SVS Viewer v0.5.9 · Benchmark & Diagnostics

A v0.5.9 adiciona telemetria local de sessão para medir First Pixel, FPS, frame p95, latência de tile/decode, cache, pressão e estabilidade. O objetivo é comparar dispositivos e lâminas com números reproduzíveis sem alterar o pipeline estável da v0.5.8.

## Benchmark & Diagnostics · v0.5.9

- benchmark automático por lâmina;
- score de sessão 0–100;
- FPS atual/médio e frame p95;
- tile/decode médio e p95;
- métricas Smart Cache;
- pico de Backpressure e event-loop lag;
- exportação textual e JSON;
- reset da sessão para testes A/B.


A v0.5.8 mantém o Heavy Slide Engine, Smart Cache, Predictive Navigation e Instant Open e adiciona uma interface touch dedicada para tablets e celulares, sem alterar o pipeline pesado que já estava estável.


## Mobile Viewer 2.0 · v0.5.8

A v0.5.8 mantém todo o pipeline da v0.5.7 e adiciona uma camada de experiência específica para touch/tablet:

- viewer imersivo: topbar e status viram overlays sobre a lâmina;
- dock mobile com Painel, Ajustar, Medir, Anotar e Tela cheia;
- chrome some durante pan/zoom e reaparece após a navegação;
- double-tap fica reservado ao zoom no mobile;
- pinch/two-finger ganha cooldown contra cliques acidentais;
- toque longo abre ações rápidas **Marcar aqui** e **Medir daqui**;
- orientação retrato/paisagem preserva centro e zoom;
- em landscape baixo, o dock muda para a lateral;
- safe-area para tablets/celulares com recortes e barras de sistema;
- fallback de modo imersivo quando o Fullscreen API não estiver disponível.

### Teste recomendado

1. abra uma lâmina pesada no tablet;
2. faça pan e pinch rapidamente e confirme que as barras somem sem interferir na navegação;
3. pare por ~1 s e confirme o retorno dos controles;
4. dê double-tap em uma região e confirme o zoom;
5. faça pinch e solte: nenhum marcador/medição deve surgir por acidente;
6. segure um dedo parado por ~560 ms e teste **Marcar aqui / Medir daqui**;
7. gire o tablet e confirme que a região observada permanece no mesmo lugar.

## Instant Open · v0.5.7

A abertura agora possui uma **First Pixel Lane**.

- cabeçalho e pirâmide continuam obrigatórios;
- assim que a pirâmide existe, o OpenSeadragon recebe a fonte imediatamente;
- metadados completos, biblioteca, autosave e restauração de sessão são adiados para depois do primeiro pixel;
- o overlay escuro de carregamento não fica cobrindo o canvas enquanto o primeiro tile é desenhado;
- `tile-loaded` e `tile-drawn` são medidos separadamente;
- o diagnóstico mostra `header`, `viewer`, `primeiro pixel` e `interativo`;
- Heavy/Ultra continuam com throttle até a primeira imagem realmente aparecer;
- preview manual é apenas fallback raro e nunca entra na frente do caminho Heavy/Mobile.

### Como validar

1. abra uma lâmina conhecida e observe o badge `Instant Open`;
2. compare o tempo `pixel` no painel de diagnóstico com versões anteriores;
3. confirme que a imagem aparece antes de biblioteca/autosave terminarem;
4. abra uma sessão salva e confirme que anotações são restauradas logo após a primeira imagem;
5. em lâmina pesada, confirme que Scheduler/Backpressure continuam ativos durante a abertura.

## Predictive Navigation · v0.5.6

A navegação preditiva é propositalmente conservadora. Durante o gesto ela apenas mede trajetória; após cerca de **150 ms** sem novo pan, pode antecipar tiles logo à frente, antes do refinamento normal do Scheduler em ~400 ms.

- estima direção e velocidade em unidades de viewport por segundo;
- mobile, low-power e Memory Safe antecipam no máximo **1 tile**;
- desktop equilibrado antecipa até **2 tiles** e perfil forte até **3**;
- não executa durante abertura protegida ou comparação de lâminas;
- qualquer nível `Guardado`, `Pressão` ou `Crítico` do Backpressure corta a previsão;
- Smart Cache cheio bloqueia novo prefetch;
- a fila precisa estar livre antes de lançar trabalho especulativo;
- nova movimentação permite ao Smart Tile Scheduler descartar jobs preditivos ainda não iniciados;
- diagnóstico mostra estado, velocidade e tiles preditivos pedidos/concluídos.

### Como validar

1. abra uma lâmina grande e aguarde a primeira imagem;
2. faça um pan contínuo para uma direção;
3. dê uma pausa curta e continue na mesma direção;
4. em **Diag. → Cache**, observe `Predictive learning/prefetch/warm`;
5. em mobile, confirme que o contador cresce de um tile por antecipação;
6. force carga com pan/zoom agressivo: ao Backpressure sair de `Normal`, o Predictive deve entrar em `guarded`.


## Smart Cache Engine · v0.5.5

A nova camada governa o TileCache nativo do OpenSeadragon 6, sem duplicar bitmaps em uma segunda estrutura.

- corrige o teto dinâmico do cache já criado pelo OSD;
- mede `hit`, `miss` e `re-decode`;
- reconhece revisitas entre gestos de navegação;
- mantém a faixa atual de zoom e overview barato por mais tempo;
- remove primeiro detalhe fino antigo e fora do foco;
- reduz o orçamento imediatamente quando o Adaptive Backpressure sobe;
- evita poda durante pan/zoom normal e permite ação imediata somente em pressão crítica;
- diagnóstico mostra tiles atuais/alvo, hit rate, re-decodes, memória estimada, nível em foco e podas.

### Como validar

1. abra uma lâmina pesada;
2. navegue para uma região e espere o refinamento;
3. vá para outra região;
4. volte para a primeira;
5. observe **Diag. → Cache**.

Em uma revisita saudável, `hit` deve subir sem crescimento equivalente de `re-decode`. Se o Backpressure entrar em Pressão/Crítico, o alvo de cache deve cair e as podas devem liberar detalhe antigo.

## Heavy Slide Engine

O motor completo combina quatro camadas complementares:

### Fase 1 · Heavy Slide Safety

Protege a abertura inicial antes de o aparelho entrar em saturação.

- classifica automaticamente a lâmina em `Fast Start`, `Progressive`, `Heavy Safe` ou `Ultra Safe`;
- `250–599 MB`: perfil **Heavy Safe**;
- `>=600 MB`: perfil **Ultra Safe**;
- em mobile/memória segura, usa 1 worker e blocos de 1 MiB para lâminas pesadas;
- broker reduzido para 24 MiB em Heavy e 16 MiB em Ultra Safe;
- limita a concorrência de leitura e o read-ahead;
- possui recuperação automática para modo de memória segura quando o navegador acusa pressão/OOM;
- aplica teto de cache de tiles mais curto durante a primeira imagem.

### Fase 2 · Pyramid First

Evita gastar o worker com uma imagem intermediária cara antes de o usuário enxergar a lâmina.

- a pirâmide Deep Zoom passa a ser o caminho principal para a primeira visualização;
- em `>=250 MB` no mobile/low-power, a prévia manual é pulada;
- elimina a disputa `preview x primeiro tile` quando existe apenas 1 worker WASM;
- prioriza a primeira imagem útil e libera o throttle depois que a visualização começa a responder.

### Fase 3 · Smart Tile Scheduler

Decide **qual trabalho merece entrar primeiro**.

- durante pan/zoom, mantém `1 tile/frame`;
- dispositivos limitados usam 1 job ativo durante movimento;
- aproveita a ordenação do OpenSeadragon para favorecer centro → vizinhos → restante visível;
- limpa jobs ainda não iniciados quando a viewport muda, descartando trabalho que já perdeu valor;
- não aborta à força tiles que já começaram, evitando falsos tiles inexistentes no OSD 6;
- depois de ~400 ms sem movimento, libera novamente o refinamento da imagem;
- preload permanece desligado durante gesto.

### Fase 4 · Adaptive Backpressure

Decide **quanto trabalho o aparelho aguenta agora**.

- estados `Normal → Guardado → Pressão → Crítico`;
- observa fila, jobs ativos, tempo de decode, tempo total por tile, falhas e atraso do event loop;
- reduz dinamicamente concorrência, cache e tiles por frame;
- qualquer pressão acima de Normal corta preload;
- subida de proteção é rápida;
- recuperação é gradual, um nível por vez, para evitar o ciclo `trava → alivia → acelera → trava`.

## Faixas de abertura

| Tamanho da lâmina | Modo | Objetivo |
| --- | --- | --- |
| `<100 MB` | Fast Start | abrir com máxima agilidade |
| `100–249 MB` | Progressive | prévia progressiva + Deep Zoom |
| `250–599 MB` | Heavy Safe | preservar RAM e primeiro tile |
| `>=600 MB` | Ultra Safe | sobrevivência e estabilidade primeiro |

Essas faixas orientam a partida. Depois que a lâmina está aberta, Scheduler e Backpressure continuam ajustando o comportamento em tempo real.

## Diagnóstico do motor

O painel de diagnóstico expõe os principais sinais usados pela engine:

- perfil e benchmark do dispositivo;
- workers e broker cache ativos;
- modo de memória segura;
- estado do Smart Tile Scheduler;
- jobs descartados e limpezas de fila;
- nível do Adaptive Backpressure;
- score de pressão;
- tempo recente de tile/decode;
- lag do event loop;
- tempo do primeiro tile;
- resultado do probe de memória WASM.

Isso permite comparar um tablet fraco com Chromebook/desktop sem depender apenas da sensação visual.

## Teste recomendado para lâmina pesada

Para validar o Heavy Slide Engine em um dispositivo limitado:

1. abra uma SVS de aproximadamente 250–300 MB;
2. anote o tempo até a primeira imagem útil;
3. faça pan contínuo por 15–20 segundos;
4. alterne zoom in/out em áreas distantes;
5. pare por 1–2 segundos e observe o refinamento;
6. repita por pelo menos 1 minuto;
7. abra o diagnóstico e confira fila, descartes, pressão, `ms/tile` e lag;
8. confirme que o viewer continua responsivo e que a pressão retorna gradualmente a Normal quando o aparelho estabiliza.

O objetivo da v0.5.4 não é transformar hardware fraco em workstation. É impedir que uma lâmina grande faça o navegador entrar num beco sem saída de RAM, mantendo a visualização utilizável e recuperável.

## Testes automatizados

```bash
npm run test:runtime
```

Executa:

```bash
npm run test:scheduler
npm run test:backpressure
npm run test:cache
npm run test:predictive
npm run test:instant
```

Para testar runtime + build de produção no Windows:

```text
TESTAR_BUILD.bat
```

## Execução local

No Windows, execute:

```text
INICIAR_WINDOWS.bat
```

Ou manualmente:

```bash
npm install
npm run dev
```

## Vercel

O projeto permanece preparado para Vercel com COOP/COEP e suporte ao Mobile OpenSlide WASM da linha v0.5.3+.

O arquivo `.SVS` continua sendo processado localmente no navegador. O projeto não possui endpoint próprio de upload de lâminas.

## Release

**Virtum SVS Viewer v0.5.8 · Mobile Viewer 2.0** continua a sequência:

- `v0.5.4.0` · Heavy Slide Safety
- `v0.5.4.1` · Pyramid First
- `v0.5.4.2` · Smart Tile Scheduler
- `v0.5.4.3` · Adaptive Backpressure

As quatro fases permanecem identificáveis internamente, mas passam a ser distribuídas como um único motor.

- `v0.5.5` · Smart Cache Engine
- `v0.5.6` · Predictive Navigation
- `v0.5.7` · Instant Open
- `v0.5.8` · Mobile Viewer 2.0

- `v0.5.9` · Benchmark & Diagnostics
