# Convenções Visuais - UI Concreto Frio

Este guia descreve os padrões visuais e tokens de design adotados na modernização da interface do **Território Tomado**, sob a direção de design **Concreto Frio**. O objetivo é manter a identidade do projeto (*VR Abandonada*), mas garantir uma interface operacional de alta densidade e legibilidade, afastando-se do preto puro e focando em tons minerais frios.

---

## 1. Paleta de Cores (Tokens CSS)

As cores principais são definidas no `:root` do arquivo `globals.css` utilizando variáveis nativas para facilidade de manutenção e integração com classes Tailwind.

| Variável CSS | Valor | Aplicação Principal |
| :--- | :--- | :--- |
| `--background` | `#0c0f12` | Fundo principal da aplicação (Grafite/Chumbo mineral) |
| `--background-alt` | `#12181c` | Fundo secundário, lateral drawers e cabeçalhos fixos |
| `--foreground` | `#f2f4ef` | Texto principal (Papel/Concreto claro de alto contraste) |
| `--muted` | `#8fa3ad` | Texto de apoio e cabeçalhos de tabelas |
| `--signal` | `#e9ad12` | Amarelo VR (Pontos de tensão, CTAs primários e status publicado) |
| `--signal-light` | `#ffd76a` | Amarelo de foco e hover sobre CTAs primários |
| `--rust` | `#8f5944` | Ferrugem (Utilizado estritamente em alertas e pendências críticas) |
| `--rust-light` | `#c48b70` | Variação clara de alerta para melhor legibilidade |
| `--steel` | `#60737d` | Azul-chumbo metálico para elementos de estrutura e bordas |
| `--concrete` | `#c9d1cc` | Cinza mineral concreto para chips e status neutros |
| `--line` | `rgba(144, 164, 174, 0.22)` | Bordas minerais finas de baixa opacidade |
| `--line-strong` | `rgba(144, 164, 174, 0.38)` | Bordas divisórias de alta visibilidade |

---

## 2. Componentes e Estilos Utilitários

### Painéis e Superfícies Glassmorphic
Utilizam transparência sutil e `backdrop-filter: blur(...)` para passar a sensação de painel tático operacional sobreposto à cartografia.

*   `.tt-panel`: Fundo translúcido mineral (`rgba(16, 22, 26, 0.72)`) com blur de `12px` e borda fina.
*   `.tt-card`: Fundo chumbo suave (`rgba(18, 24, 28, 0.55)`) com blur de `8px`, ótimo para cards repetitivos (ex: lista de bairros ou blocos do histórico).
*   `.tt-surface-solid`: Fundo sólido (`#11161a`) com brilho interno, utilizado para fixar painéis de estatísticas.

### Tabelas Operacionais
Adotam uma convenção estrita de densidade útil e legibilidade:

*   `.tt-table-container`: Envelopamento com rolagem (`max-h-[75vh] overflow-auto`), borda mineral e sombra suave.
*   `.tt-table`: Ocupa `100%` da largura, com zebras automáticas (`even:bg-white/[0.015]`) e hover de contraste sutil nas linhas.
*   `thead`: Configurado como `sticky top-0 z-10` e fundo escuro sólido para manter o cabeçalho sempre visível e opaco ao rolar longos conjuntos de dados (como os 197 registros).

### Botões e Entradas (Inputs)
*   `.tt-button-primary`: Amarelo VR em degradê metálico com texto em chumbo escuro.
*   `.tt-button-secondary`: Borda mineral fina com preenchimento cinza-chumbo translúcido e blur.
*   `.tt-button-danger`: Borda ferrugem translúcida e hover voltado a realçar a tensão do amarelo VR.
*   `.tt-input`: Caixa com fundo escuro sólido, borda mineral fina que brilha em amarelo VR no foco (`focus:border-signal`).

---

## 3. Diretrizes de Usabilidade

1.  **Sem Placeholders**: Imagens de capas e thumbnails devem ser reais ou geradas com qualidade; na ausência, deve ser utilizado o ícone de fallback estruturado.
2.  **Densidade de Dados**: Evitar paddings exagerados que diminuam a quantidade de informações visíveis na tela ao mesmo tempo. A mesa de operação exige leitura rápida.
3.  **Contraste Alto**: Todo texto sobre fundos de status deve seguir as cores contrastantes corretas para garantir acessibilidade, mesmo sob luz solar no uso móvel (PWA).
