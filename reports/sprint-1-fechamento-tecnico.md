# Sprint 1: Fechamento Tecnico

Data: 2026-06-01
Projeto: Territorio Tomado
Escopo: fechamento tecnico da rodada de marca/PWA, limpeza local e validacao de build

## Resumo

A rodada foi fechada sem mudanca de arquitetura. O trabalho ficou restrito a revisar e estabilizar os ajustes ja em andamento de marca, PWA, home e shell global.

O projeto esta lintado, typecheckado e buildavel localmente.

## Arquivos revisados

- `src/app/layout.tsx`
- `src/app/manifest.ts`
- `src/app/page.tsx`
- `src/components/layout/app-shell.tsx`

Conclusao da revisao:

- `layout.tsx` declara os icones PNG finais na metadata do Next.
- `manifest.ts` usa os PNGs finais em vez dos SVGs antigos.
- `page.tsx` usa o simbolo de marca na home e o lockup no rodape.
- `app-shell.tsx` usa o simbolo de marca no header global.
- O H1 da home recebeu ajuste minimo de escala/quebra em mobile para evitar palavra isolada e preservar a leitura.
- Nao houve alteracao estrutural de rotas, dados, Supabase ou componentes de dominio.

## Assets revisados e otimizados

Assets finais mantidos:

- `public/brand/territorio-lockup.png`
- `public/brand/territorio-stamp.png`
- `public/brand/territorio-symbol.png`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`

Otimizacao aplicada:

- `territorio-lockup.png`: 631041 bytes -> 199682 bytes
- `territorio-stamp.png`: 1484881 bytes -> 468276 bytes
- `territorio-symbol.png`: 192258 bytes -> 63943 bytes
- `icon-192.png`: 96679 bytes -> 32769 bytes
- `icon-512.png`: 770187 bytes -> 251435 bytes

Observacao:

- `territorio-stamp.png` ainda nao e referenciado pelo codigo, mas foi mantido como parte do pacote de marca.
- Os SVGs antigos em `public/icons` continuam no repositorio, mas nao sao mais usados pelo manifest nem pela metadata.

## Limpeza local

Logs locais removidos:

- `.next-dev.err.log`
- `.next-dev.out.log`

Tambem foi removido cache/build local reconstruivel de `.next` para liberar espaco em disco antes da validacao final.

`.gitignore` atualizado:

- adicionado `.next-dev.*.log`

## Verificacao tecnica

Executado com sucesso:

```bash
npm run lint
npm run typecheck
npm run build
```

Resultado do build:

- compilacao concluida com sucesso
- rotas geradas/coletadas normalmente
- `manifest.webmanifest` aparece na saida do build
- aviso remanescente do Next: uso de edge runtime desabilita geracao estatica para paginas afetadas

## QA visual e PWA

Verificacao local feita em `http://127.0.0.1:3002`.

Sinais confirmados no browser:

- title da pagina correto
- header carregando `territorio-symbol.png`
- H1 mobile sem quebra isolada do "O"
- footer carregando `territorio-lockup.png`
- link de manifest presente: `/manifest.webmanifest`
- links de icones presentes:
  - `/icons/icon-192.png`
  - `/icons/icon-512.png`
  - `/icons/icon-192.png` como apple touch icon

Manifest servido localmente:

```json
{
  "name": "Territorio Tomado",
  "short_name": "Territorio",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#3b474f",
  "theme_color": "#3b474f",
  "lang": "pt-BR",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Estado final observado

Worktree ainda possui mudancas aguardando decisao de commit:

- `.gitignore`
- `src/app/layout.tsx`
- `src/app/manifest.ts`
- `src/app/page.tsx`
- `src/components/layout/app-shell.tsx`
- `public/brand/`
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`
- `reports/sprint-1-fechamento-tecnico.md`

Tambem existe o relatorio anterior ainda nao versionado:

- `reports/relatorio-estado-atual-2026-06-01.md`

## Pendencias antes de deploy

- Decidir se `reports/relatorio-estado-atual-2026-06-01.md` entra no mesmo commit ou fica fora.
- Staging/commit dos assets finais e dos ajustes de PWA.

## Diagnostico final

A rodada tecnica e de marca/PWA esta fechada em estado buildavel. Os logs locais foram tratados, os PNGs pesados foram reduzidos, o manifest e a metadata apontam para os icones finais, e a home/header usam os assets de marca corretos sem abrir nova frente funcional.
