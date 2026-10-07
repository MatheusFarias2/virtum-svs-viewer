# Release Notes · v0.5.6 Predictive Navigation

A v0.5.6 adiciona navegação preditiva sobre o Heavy Slide Engine + Smart Cache. O objetivo é reduzir o vazio percebido ao continuar um pan sem reintroduzir prefetch agressivo.

## Predictive Navigation

- aprende direção e velocidade do pan sem carregar nada durante o gesto ativo;
- usa uma micro-pausa de ~150 ms para antecipar poucos tiles antes do refino de ~400 ms;
- 1 tile em mobile/low-power/Memory Safe, 2 em desktop equilibrado e até 3 em perfil forte;
- calcula uma faixa curta à frente da viewport no nível de pirâmide atualmente em foco;
- reaproveita registros já existentes no TileCache antes de disparar nova leitura;
- exige fila livre e orçamento disponível no Smart Cache;
- desliga automaticamente em Guardado/Pressão/Crítico, durante startup protegido, aba inativa e modo comparação;
- jobs preditivos ainda enfileirados continuam sujeitos à limpeza do Smart Tile Scheduler quando a direção muda;
- diagnóstico mostra estado, velocidade (vp/s), pedidos, concluídos, cache hits, cancelados e motivo do último bloqueio.

## Compatibilidade

A implementação usa o pipeline do OpenSeadragon 6.0.2 fixado no projeto. Não cria um segundo cache de bitmaps e não aborta jobs já iniciados.

## Testes

Execute:

```bash
npm run test:runtime
```

A suíte cobre Scheduler, Adaptive Backpressure, Smart Cache e Predictive Navigation.
