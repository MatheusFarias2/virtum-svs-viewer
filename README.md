# Virtum SVS Viewer v0.5.3.6 · Coarse First View

Patch focado em tablets e dispositivos de baixa potência que travavam ao abrir lâminas acima de aproximadamente 200 MB.

## Mudanças principais

- O modo pesado começa em **200 MB**.
- Em mobile/Low Power, lâminas >= 200 MB usam **Coarse First View**.
- A primeira tela limita o Deep Zoom a um nível da pirâmide com aproximadamente 2048 px no mobile.
- Ao ampliar:
  - a partir de ~1,35× do zoom inicial, libera detalhe intermediário;
  - a partir de ~2,6×, libera a resolução completa.
- A resolução completa não é carregada em repouso, reduzindo picos de RAM e decodificação.
- Mobile pesado fica com:
  - 1 worker;
  - 1 leitura simultânea;
  - broker de 16 MiB (12 MiB em Ultra Safe);
  - fila visual 1;
  - cache visual reduzido;
  - read-ahead desligado.
- Coordenadas, medições e anotações continuam usando as dimensões originais da lâmina.

## Faixas

- < 100 MB: Fast Start
- 100–199 MB: Progressive
- 200–599 MB: Heavy Safe + Coarse First View em mobile/Low Power
- >= 600 MB: Ultra Safe + Coarse First View

O SVS continua 100% local no dispositivo.
