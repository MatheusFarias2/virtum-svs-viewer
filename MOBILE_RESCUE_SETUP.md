# Ativar o Mobile Heavy Open Rescue

A v0.5.10 bloqueia propositalmente o WASM stock em tablets quando o SVS tem 250 MB ou mais. Antes do teste heavy mobile, gere o Mobile WASM Rescue.

## GitHub Actions

1. Envie o projeto para o GitHub.
2. Abra **Actions**.
3. Selecione **Build Mobile OpenSlide WASM**.
4. Clique em **Run workflow**.
5. Mantenha `upstream_ref=main` (ou fixe um commit/tag do openslide-js).
6. Aguarde o workflow gerar e commitar:
   - `public/wasm-mobile/manifest.json`
   - `public/wasm-mobile/openslide.js`
   - `public/wasm-mobile/openslide.wasm`
7. Faça/deixe ocorrer o novo deploy na Vercel.

O manifest deve indicar `maximumMemoryMiB: 384`.

## Como confirmar no Viewer

Abra **Diagnóstico** antes da lâmina. Em tablet pesado, o esperado é:

```text
Engine: Rescue · Mobile WASM 384 MiB · ativo
Heavy Open Rescue: ...
```

Se aparecer `Rescue bloqueado · Mobile WASM ausente`, os três arquivos ainda não estão presentes no deploy.

## Perfil de sobrevivência

- 1 worker
- 1 leitura concorrente
- read-ahead 0
- bloco de 1 MiB
- broker 12 MiB (250–599 MB)
- broker 8 MiB (>=600 MB)
- fila 1
- cache 10/8 tiles
- Predictive Navigation off
- preload off
