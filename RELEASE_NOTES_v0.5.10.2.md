# Virtum SVS Viewer v0.5.10.2 · First Pixel Compatibility Hotfix

Hotfix para TVs, Android TV, WebViews e navegadores que usam o WebGLDrawer do OpenSeadragon 6.

## Problema corrigido

A imagem podia já estar visível, mas o Instant Open ficava preso em:

`tile pronto · desenhando primeiro pixel…`

O motivo era o uso de `tile-drawn` como única confirmação de primeiro pixel. No OpenSeadragon 6, esse evento é válido para drawers Context2D/HTML; em muitas plataformas o drawer padrão é WebGL.

## Correção

- `tile-drawn` continua sendo aceito quando disponível;
- `update-viewport` passa a confirmar o primeiro frame após `tile-loaded`;
- a confirmação por viewport só é habilitada depois de um `requestAnimationFrame` real;
- `viewer.forceRedraw()` solicita explicitamente um frame de confirmação;
- watchdog de 1,2–1,8 s evita loop infinito caso o navegador omita ambos os sinais;
- diagnóstico informa o drawer ativo e a fonte da confirmação (`tile-drawn`, `viewport-frame` ou `paint-watchdog`).

Nenhuma alteração foi feita no decoder OpenSlide, Smart Cache ou scheduler de tiles.
