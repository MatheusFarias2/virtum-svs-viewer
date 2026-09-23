# Virtum SVS Viewer v0.5.2.1 · Mobile Memory Fix

Hotfix da v0.5.2 focado em tablets, Chromebooks e navegadores com limite de memória por processo. Mantém Reports & Export e todos os recursos anteriores.

## Correções principais

- diagnóstico disponível **antes de abrir uma lâmina**, direto na Biblioteca e em `Mais → Diagnóstico`;
- **Modo seguro de memória** automático em tablets/dispositivos móveis e em dispositivos com memória reportada baixa;
- OpenSlide inicia com **1 worker**, broker de **16 MB**, fila curta e preload desligado no modo seguro;
- cache visual reduzido para cerca de **40 tiles** no modo seguro;
- memória não informada pelo navegador deixou de contar como sinal positivo no benchmark;
- benchmark antigo da v0.5.1 é ignorado por uma nova chave de cache, evitando reaproveitar uma classificação agressiva;
- se uma inicialização normal acusar pressão de memória, o Viewer tenta novamente em modo seguro;
- em navegadores móveis, mesmo perfis manuais recebem um teto conservador de workers/cache;
- Compare e Alta definição ficam bloqueados em mobile/Modo seguro para evitar dobrar pressão de memória;
- novo indicador `Modo de memória` na aba Diagnóstico.

## Diagnóstico antes da lâmina

Na tela da Biblioteca use:

```text
Diagnóstico
```

ou:

```text
Mais → Diagnóstico
```

Ali é possível conferir CPU/RAM exposta pelo navegador, benchmark, workers, cache, compatibilidade e ligar/desligar o Modo seguro antes de selecionar o `.SVS`.

## Perfil seguro

Por padrão em tablet/mobile:

```text
Workers: 1
Broker cache: 16 MB
Leituras simultâneas: 1
Read ahead: 0
Fila de tiles: 2
Cache visual: ~40 tiles
Preload: OFF
Compare: bloqueado
Alta definição: bloqueada
```

O objetivo é priorizar a abertura da lâmina e estabilidade.

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

A configuração Vercel Ready foi preservada, incluindo COOP/COEP/CORP, `dist/` e `/health.txt`. O arquivo `.SVS` continua no dispositivo do usuário.
