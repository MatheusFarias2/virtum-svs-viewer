# Release Notes · v0.5.7 Instant Open

A v0.5.7 reorganiza o caminho crítico de abertura para mostrar a primeira imagem o mais cedo possível, sem remover as proteções do Heavy Slide Engine.

## First Pixel Lane

- após o cabeçalho e a criação da pirâmide, `viewer.open()` é chamado imediatamente;
- biblioteca, metadados completos, leitura de autosave e restauração de sessão deixam de bloquear o primeiro tile;
- o overlay bloqueante sai assim que o OpenSeadragon recebe a fonte e é substituído por um badge leve;
- o tempo de primeira imagem passa a ser medido em `tile-drawn`, não apenas quando o bitmap termina de carregar;
- o throttle Heavy/Ultra só é liberado quando o primeiro tile realmente é desenhado;
- preview manual vira fallback raro para `Progressive` em desktop com múltiplos workers e não compete com Heavy/Mobile;
- depois do primeiro pixel, tarefas secundárias são executadas em idle e os controles completos são liberados ao final.

## Métricas novas

O diagnóstico agora separa:

- tempo de cabeçalho;
- tempo até `viewer.open()`;
- tempo até o primeiro tile carregado;
- tempo até o primeiro pixel realmente desenhado;
- fonte da primeira imagem (`tile` ou `preview`);
- tempo até o estado interativo com dados secundários restaurados.

## Compatibilidade

A v0.5.7 mantém:

- Heavy Slide Safety;
- Pyramid First;
- Smart Tile Scheduler;
- Adaptive Backpressure;
- Smart Cache Engine;
- Predictive Navigation.

A mudança principal é de ordem de execução: a imagem visível recebe a pista rápida e o restante entra depois.
