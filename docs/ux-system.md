# Sistema de UX Territorial

Este documento consolida a linguagem visual e de interacao do Territorio Tomado como ferramenta territorial. A regra central: o produto deve parecer uma mesa de leitura e operacao do territorio, nao uma landing repetida nem um dashboard corporativo.

## Tese Visual

- Material: escuro, seco, brutalista limpo, com superficie de papel gasto e acento de sinal.
- Energia: urgencia territorial, leitura rapida, acao concreta.
- Densidade: mais informacao util por dobra, sem empilhar cards vazios.

## Home

- A home e a unica pagina monumental.
- Hero pode ser maior, editorial e manifesto.
- CTAs da home apontam para trabalho real: mapa, imoveis e agir.
- Evitar transformar rotas internas em novas landings.

## Cabecalho Interno

Componente padrao: `InternalPageHeader`.

- Usar em rotas internas publicas e admin.
- Sempre compacto.
- Deve conter:
  - eyebrow operacional
  - titulo direto
  - uma frase de orientacao
  - metricas compactas quando houver estado mensuravel
- Conteudo util deve vir imediatamente depois do cabecalho.

## Metricas

Componente padrao: `MetricCard`.

- Usar para contadores e estado rapido.
- Preferir 2 a 4 metricas por cabecalho.
- Nao usar mosaicos grandes para metricas simples.
- `tone="critical"` apenas para pressao real: criticidade alta, pendencias, prioridade ou conflito.
- `tone="muted"` para estados informativos sem urgencia.

## Cards

- Cards sao superficies de leitura e acao, nao ornamento.
- Cada card deve responder rapido:
  - onde fica
  - qual estado
  - qual criticidade
  - existe acao
  - existe prova/documento
  - qual o proximo clique
- Titulo e CTA nao devem competir.
- Badges ficam no topo; metadados densos ficam em chips ou mini-metricas; CTA principal fica no rodape.

## Filtros

- Filtros sao recortes territoriais compartilhaveis, nao controles decorativos.
- Padrao de filtros:
  - status
  - criticidade
  - bairro
  - limpar recorte
- Quando possivel, filtros devem sincronizar com URL.
- Mobile deve preservar toque facil e evitar formulario longo acima do conteudo.

## CTAs

### CTA Principal

Componente: `ButtonLink` sem `variant`.

- Usar para a acao dominante do bloco.
- Exemplos: abrir mapa, abrir ficha, enviar contribuicao, agir agora.
- Deve ficar perto do conteudo que justifica a acao.

### CTA Secundario

Componente: `ButtonLink variant="secondary"`.

- Usar para rota complementar ou aprofundamento.
- Exemplos: ver lista, abrir ficha, revisar contribuicoes.

### CTA Terciario

Componente: `ButtonLink variant="ghost"`.

- Usar para compartilhamento, retorno, leitura alternativa ou fluxo lateral.
- Nunca deve competir com a acao principal.

## Navegacao Mobile

- Mobile usa barra inferior fixa como modo de app de campo.
- Rotas principais:
  - inicio
  - bairros
  - mapa
  - imoveis
  - agir
- A topbar continua existindo como identidade e contexto, mas a operacao no mobile acontece pela barra inferior.
- A rota `/admin` nao entra na barra mobile publica.

## Ritmo Por Area

- `/mapa`: superficie de trabalho cartografico; mapa domina, filtros e foco ficam como painel.
- `/imoveis`: lista operacional; cards densos e filtros compartilhaveis.
- `/bairros`: leitura politica por unidade territorial; cards agregam pressao, prova e acao.
- `/agir`: frente concreta; CTA nasce de imovel, nao de agenda generica.
- `/enviar`: contribuicao moderada; explicar fila e reduzir medo de envio.
- `/admin`: mesa editorial; atalhos, pendencias e decisao rapida.

## Componentes-Base Atuais

- `AppShell`: shell unica, topbar desktop, bottom nav mobile e footer.
- `InternalPageHeader`: cabecalho interno operacional.
- `SectionHeader`: cabecalho de secao, ainda permitido dentro de paginas e na home.
- `MetricCard`: metrica compacta e reutilizavel.
- `Badge`: status, criticidade, prioridade e moderacao.
- `ButtonLink`: CTA principal, secundario e terciario.
- `PropertyCard`: card denso de leitura publica do imovel.
- `EmptyState`: vazio operacional com proxima leitura possivel.

## Regra De Ouro

Se um bloco nao ajuda a decidir, recortar, abrir ficha, enviar prova ou agir, ele deve ser removido, compactado ou movido para uma camada secundaria.
