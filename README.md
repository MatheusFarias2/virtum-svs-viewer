# Virtum SVS Viewer v0.5.3 · Mobile WASM Preview

Versão experimental focada no gargalo observado em tablets: a lâmina consegue ter
o cabeçalho/metadados reconhecidos, mas o primeiro tile pode demorar demais ou
falhar antes de aparecer.

A v0.5.3 ataca isso em **duas frentes**:

1. o Viewer fica bem mais conservador durante o primeiro render móvel;
2. o projeto já sabe usar um **OpenSlide WASM recompilado para mobile**, com teto
   de memória de 512 MiB, assim que esse build for gerado pelo workflow do GitHub.

## Melhorias de runtime móvel

- mini-mapa/Navigator do OpenSeadragon desligado em mobile para evitar uma segunda
  cadeia de tiles;
- Deep Zoom móvel usa tiles de **128 × 128 px** em vez de 254 × 254 px;
- 1 worker no modo seguro;
- cache visual reduzido para aproximadamente **16 tiles**;
- broker de 8 MiB, bloco de I/O de 256 KiB, read-ahead 0;
- Compare e Alta definição continuam bloqueados no modo seguro;
- tempo de tolerância do primeiro tile passa de 20 s para **60 s no mobile**;
- diagnóstico registra tempo de decodificação do primeiro tile e tempo de criação
  do `ImageBitmap`;
- o diagnóstico mostra qual engine está ativa: `stock`, `stock-fallback` ou
  `mobile-512`.

## OpenSlide WASM Mobile 512 MiB

Quando os arquivos abaixo existem:

```text
public/wasm-mobile/manifest.json
public/wasm-mobile/openslide.js
public/wasm-mobile/openslide.wasm
```

o Virtum passa a preferi-los automaticamente em tablet/mobile ou Modo seguro.
Desktop continua usando o WASM oficial do pacote NPM.

O build móvel mantém a pipeline upstream do `openslide-js`, alterando apenas os
parâmetros Emscripten de memória:

```text
INITIAL_MEMORY = 16 MiB
MAXIMUM_MEMORY = 512 MiB
ALLOW_MEMORY_GROWTH = on
MEMORY_GROWTH_GEOMETRIC_STEP = 10%
MEMORY_GROWTH_GEOMETRIC_CAP = 16 MiB
```

O `openslide-js` oficial também é compilado para WebAssembly e exige COOP/COEP;
esses headers continuam configurados no `vercel.json`.

## Gerar o WASM móvel no GitHub

O build upstream requer Docker. Por isso esta versão inclui:

```text
.github/workflows/build-mobile-wasm.yml
mobile-wasm/patch-build.py
mobile-wasm/README.md
```

Depois de subir o projeto para o GitHub:

1. abra **Actions**;
2. selecione **Build Mobile OpenSlide WASM**;
3. clique em **Run workflow**;
4. deixe `upstream_ref = main` inicialmente;
5. aguarde o build.

O workflow compila o OpenSlide, copia os assets para `public/wasm-mobile/`, gera
`manifest.json`, registra o commit upstream usado e faz commit dos arquivos. Se o
repositório estiver conectado à Vercel, esse commit dispara um novo deploy.

> Enquanto esse workflow ainda não tiver sido executado, a v0.5.3 funciona com o
> engine padrão e mostra `Mobile WASM ausente · fallback padrão` no diagnóstico.

## Teste no tablet

Depois do deploy com o WASM móvel:

```text
Biblioteca → Diagnóstico
```

Deve aparecer algo como:

```text
Engine
Mobile WASM 512 MiB · ativo · tiles 128px
```

Depois abra a mesma lâmina. Durante a primeira renderização o diagnóstico passa
por fases como:

```text
Primeiro tile · lendo e decodificando…
Primeiro tile decodificado · 2800 ms · preparando bitmap
Lâmina pronta · 3100 ms
```

Isso permite separar demora de leitura/decodificação de demora na conversão para
o OpenSeadragon.

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

## Vercel

A configuração Vercel Ready foi preservada. O `.SVS` continua no dispositivo do
usuário; apenas o Viewer e seus assets WASM são hospedados.
