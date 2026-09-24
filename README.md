# Virtum SVS Viewer v0.5.3.1 · Mobile Fast Start

O v0.5.3 abriu a lâmina no tablet, mas o perfil de compatibilidade era propositalmente
ultraconservador. Esta revisão mantém a proteção de memória e recupera desempenho.

## O que mudou no mobile

- continua usando **1 worker de decodificação**, evitando voltar ao erro de memória;
- ativa o **I/O broker compartilhado** do `openslide-js`; o broker é um worker leve e
  não carrega outra instância do WASM;
- blocos de leitura passam de 256 KiB para **1 MiB**;
- cache do broker passa de 8 MiB para **24 MiB**;
- `readAhead = 1` e até 2 leituras em voo;
- Deep Zoom passa para **254 px + overlap 1**, totalizando 256 px por bloco, alinhado
  à recomendação de desempenho do Deep Zoom;
- fila visual sobe de 1 para **2 jobs** e cache visual para **24 tiles**;
- OpenSeadragon usa `immediateRender` no mobile e `minPixelRatio = 1.25`, evitando
  buscar uma cascata desnecessária de níveis intermediários;
- blend de tiles fica em 0 no mobile;
- mini-mapa continua desligado no tablet;
- Compare e Alta definição continuam bloqueados em Modo seguro;
- atualizações de diagnóstico e redesenho das anotações agora são agrupadas por
  frame/intervalo, evitando trabalho de DOM a cada tile e a cada evento de animação.

## Por que isso deve ser mais rápido

A v0.5.3 usava I/O independente, blocos de 256 KiB, tiles de 128 px e fila 1. Isso
minimizava memória, mas multiplicava leituras, tiles e chamadas entre JavaScript e
WASM. O novo perfil mantém um único decoder, porém usa o broker compartilhado do
OpenSlide JS para cachear e antecipar leituras locais.

## Mobile WASM

A preferência pelo build móvel de 512 MiB continua preservada. Se existir:

```text
public/wasm-mobile/manifest.json
public/wasm-mobile/openslide.js
public/wasm-mobile/openslide.wasm
```

o Viewer usa esse engine no tablet. Caso contrário, usa o engine padrão como fallback.

## Teste recomendado

Abra a mesma lâmina usada na v0.5.3 e cronometre até a primeira imagem aparecer.
Depois abra **Biblioteca → Diagnóstico** e copie: fase, primeiro tile, decode, bitmap,
engine, bloco de I/O e broker cache. Esses números permitem calibrar a próxima etapa.

## Executar localmente

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build:vercel
npm run preview
```

A configuração de Vercel e os headers COOP/COEP continuam preservados. O `.SVS`
permanece no dispositivo do usuário.
