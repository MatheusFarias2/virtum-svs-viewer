# Virtum SVS Viewer v0.5.3.3 · Progressive Open

Versão focada na abertura de lâminas SVS maiores em tablet, Chromebook e PCs modestos.

## Novidades

- **Progressive Open** para lâminas a partir de 100 MiB.
- **Large Slide Mode** a partir de 300 MiB.
- Geração de **preview de baixa resolução em um único tile** antes do detalhamento completo.
- O preview fica visível enquanto o OpenSeadragon refina a imagem.
- I/O compartilhado passa a ser priorizado em mobile, Chromebook/Low Power e lâminas grandes.
- Ajuste adaptativo de block size, cache do broker, leituras simultâneas e read-ahead conforme tamanho da lâmina.
- Diagnóstico registra separadamente tempo de cabeçalho, preview e primeira imagem detalhada.
- Mantém 1 worker WASM em hardware limitado para preservar a estabilidade obtida na série v0.5.3.

## Faixas de abertura

- `< 100 MiB`: Fast Start normal.
- `100–299 MiB`: Progressive Open.
- `>= 300 MiB`: Large Slide.

O arquivo SVS continua sendo processado localmente no navegador. Nenhuma lâmina é enviada à Vercel.
