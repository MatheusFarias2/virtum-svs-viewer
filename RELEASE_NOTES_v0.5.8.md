# Virtum SVS Viewer v0.5.8 · Mobile Viewer 2.0

## Objetivo

Transformar a experiência touch em uma interface feita para tablet/celular, mantendo intactas as engines de abertura, cache, predição e proteção de memória.

## Principais mudanças

- shell mobile imersivo, com viewer ocupando toda a área útil;
- topbar/status como overlays e auto-hide durante pan/zoom;
- dock inferior de ações rápidas e dock lateral em landscape baixo;
- double-tap reservado ao zoom em touch;
- proteção pós-pinch contra cliques rápidos acidentais;
- toque longo com menu contextual para marcar ou iniciar medição;
- Fullscreen API com fallback para modo imersivo;
- preservação de centro/zoom em mudança de orientação;
- suporte a `safe-area-inset-*` e `visualViewport`;
- teste unitário do guard de gestos mobile.

## Compatibilidade

O modo Mobile Viewer 2.0 é ativado apenas quando o Viewer detecta dispositivo móvel/tablet touch. Desktop mantém o layout e os atalhos existentes.

## Validação

Execute `TESTAR_BUILD.bat` ou `npm run test:runtime`. O runtime inclui Scheduler, Backpressure, Smart Cache, Predictive Navigation, Instant Open e Mobile Viewer 2.0.
