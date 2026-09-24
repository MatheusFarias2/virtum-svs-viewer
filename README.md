# Virtum SVS Viewer v0.5.2.2 · Mobile Compatibility

Hotfix da v0.5.2 focada em descobrir e reduzir falhas de memória na inicialização do OpenSlide em tablets, Chromebooks e navegadores móveis. Mantém Reports & Export e todos os recursos anteriores.

## O que mudou

- diagnóstico disponível antes de abrir qualquer lâmina;
- Modo seguro automático em tablet/mobile;
- **1 worker** no OpenSlide;
- **uma única tentativa de inicialização WASM** em tablet, evitando acumular pressão de memória com retries;
- broker/cache configurado em **8 MiB** quando utilizado;
- bloco de I/O reduzido para **256 KiB**;
- fila visual de **1** e cache visual de aproximadamente **24 tiles**;
- preload e Alta definição desligados no modo seguro;
- Compare bloqueado no modo seguro;
- `jsPDF` passa a ser carregado somente ao gerar PDF, reduzindo o JavaScript residente antes de abrir a lâmina;
- fases da inicialização registradas no diagnóstico;
- último erro registrado e copiável.

## Diagnóstico móvel

Na Biblioteca abra `Diagnóstico` ou `Mais → Diagnóstico`.

Novos testes:

### Testar motor

Inicializa o OpenSlide **sem selecionar um arquivo .SVS**. Se falhar aqui, o problema acontece antes da leitura da lâmina.

### Probe WASM

Testa separadamente a memória compartilhada WebAssembly. Primeiro tenta um teto de referência de **512 MiB**. Somente se isso funcionar, testa o teto de **2 GiB** usado pelo build WebAssembly atual do OpenSlide/Emscripten.

Resultados importantes:

```text
512 MiB OK · 2 GiB FALHOU
```

fortemente indica que o navegador móvel aceita WebAssembly compartilhado, mas rejeita o teto de memória do build atual. Nesse caso o próximo passo é gerar um build móvel próprio do OpenSlide/WASM com `MAXIMUM_MEMORY` menor.

### Copiar diagnóstico

Gera um resumo com navegador, CPU, memória exposta, isolamento, SharedArrayBuffer, workers, fase atual, Probe WASM e último erro.

## Perfil seguro

```text
Workers: 1
Broker cache: 8 MiB
Block size: 256 KiB
Leituras simultâneas: 1
Read ahead: 0
Fila de tiles: 1
Cache visual: ~24 tiles
Preload: OFF
Compare: bloqueado
Alta definição: bloqueada
Retries WASM em tablet: OFF
```

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

A configuração Vercel Ready foi preservada, incluindo COOP/COEP/CORP, saída `dist/` e `/health.txt`. O arquivo `.SVS` continua no dispositivo do usuário.
