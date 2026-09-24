# Publicação no Vercel · Virtum SVS Viewer v0.5.3

Este pacote já está preparado para publicação como projeto Vite estático no Vercel.

## Opção recomendada · GitHub + Vercel

1. Crie um repositório no GitHub.
2. Envie **o conteúdo desta pasta para a raiz do repositório**.
3. No Vercel, escolha **Add New → Project** e importe o repositório.
4. O Vercel deve detectar **Vite** automaticamente.
5. Não é necessário configurar variáveis de ambiente.
6. Confirme as configurações abaixo, caso o painel peça:

```text
Framework Preset: Vite
Install Command: npm install --no-audit --no-fund
Build Command: npm run build:vercel
Output Directory: dist
Node.js: 24.x
```

7. Clique em **Deploy**.

## Verificação após publicar

Abra:

```text
https://SEU-PROJETO.vercel.app/health.txt
```

Deve aparecer:

```text
Virtum SVS Viewer v0.5.3
status=ok
build=vercel-ready
```

Depois abra o Viewer e confirme em **Diag. → Compatibilidade** que o navegador está em contexto seguro e isolado.

O funcionamento esperado inclui:

```text
secure=true
isolated=true
SAB=true
```

## Headers obrigatórios

O `vercel.json` já envia:

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin
```

Esses headers são importantes para o OpenSlide JS / SharedArrayBuffer.

## Privacidade

A hospedagem contém somente o aplicativo. Ao selecionar uma lâmina `.SVS`, o arquivo permanece sendo processado no navegador do usuário. Este projeto não inclui endpoint de upload de lâminas.

## Atualizações futuras

Com o repositório ligado ao Vercel, cada `push` para a branch de produção pode gerar uma nova implantação automaticamente. Para uma nova versão do Viewer, substitua/atualize os arquivos do projeto e envie o commit.

## Mobile WASM v0.5.3

A aplicação pode ser publicada antes de gerar o WASM móvel; nesse caso ela usa o
engine padrão automaticamente.

Para ativar o engine móvel de 512 MiB, depois de subir este projeto ao GitHub:

1. GitHub → **Actions**;
2. **Build Mobile OpenSlide WASM**;
3. **Run workflow**;
4. aguarde o commit automático em `public/wasm-mobile/`;
5. a Vercel fará um novo deploy se a integração Git estiver ativa.

Após o deploy, abra `/wasm-mobile/manifest.json`. Ele deve mostrar
`"ready": true` e `"maximumMemoryMiB": 512`.
