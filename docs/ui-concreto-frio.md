# UI: Concreto Frio

## Conceito

O refresh visual do Territorio Tomado parte da imagem do antigo Escritorio Central da CSN como referencia atmosferica: concreto claro, vidro azulado, azul corporativo gasto, rigidez modernista e monumentalidade institucional.

A interface nao deve virar site institucional nem dashboard SaaS. A leitura correta e uma ferramenta territorial popular ocupando a linguagem fria do comando industrial.

## Paleta

- `ink`: grafite frio estrutural, usado como base escura respiravel.
- `ink-alt`: chumbo azulado para profundidade, formularios e areas operacionais.
- `ink-deep`: grafite profundo para casos de alto contraste, evitando voltar ao preto absoluto.
- `paper`: mineral claro para texto de alto contraste.
- `concrete`: concreto claro aplicado em superficies, linhas e massas de apoio.
- `concrete-pale`: concreto mais claro para massas leves.
- `concrete-line`: linha mineral para divisores e bordas.
- `glass`: vidro azulado dessaturado para bordas, hover e atmosfera.
- `glass-cold`: vidro claro para atmosferas e gradientes.
- `steel`: azul corporativo gasto, institucional sem brilho.
- `signal`: amarelo de alerta, foco, chamada e conflito.
- `rust`: ferrugem pontual, memoria industrial e desgaste, nunca base dominante.

## Regras de Uso

- Evitar preto absoluto como campo dominante.
- Preferir grafite frio, chumbo azulado e concreto mineral em camadas.
- Usar bordas, grades e linhas modulares para sugerir fachada, esquadria e mesa tecnica.
- Manter tipografia forte, caixa alta e contraste alto.
- Encurtar herois internos: paginas operacionais devem abrir rapido, com metricas e acoes visiveis.
- Ferrugem aparece em estados de desgaste ou vacancia, de forma controlada.
- Amarelo segue como cor politica de alerta e acao.

## Tokens Tailwind

`tailwind.config.ts` concentra a paleta e os efeitos reutilizaveis:

- `shadow-tt-panel`: sombra interna mineral e sombra externa fria para paineis importantes.
- `shadow-tt-card`: sombra contida para cards e chapas de leitura.
- `shadow-tt-map`: enquadramento do mapa.
- `shadow-tt-signal`: foco amarelo VR Abandonada.
- `bg-tt-concrete-field`: campo atmosferico geral.
- `bg-tt-glass-panel`: painel frio com vidro azulado.
- `bg-tt-hero`: hero mineral curto.
- `bg-tt-alert-line`: linha de alerta amarelo + vidro.

## Classes Globais

As classes globais em `globals.css` sao a convencao de aplicacao:

- `tt-shell`: atmosfera global fria, aplicada no shell.
- `tt-hero`: hero curto e mineral para home e cabecalhos internos.
- `tt-panel`: painel operacional padrao.
- `tt-card`: card territorial, mais denso que panel.
- `tt-metric`: bloco numerico compacto.
- `tt-chip`: marcador, filtro ou etiqueta pequena.
- `tt-button`, `tt-button-primary`, `tt-button-secondary`, `tt-button-ghost`: botoes do sistema.
- `tt-input`: select, input e textarea em chumbo azulado.
- `tt-sidebar`: paineis laterais e blocos de apoio.
- `tt-rule-grid`: grade arquitetonica discreta, aplicada apenas onde a monumentalidade ajuda.

Bordas devem aparecer mais que sombras. A UI precisa parecer mineral e vitrificada, nao pesada ou subterranea.

## Paginas Aplicadas

- Home: hero mais claro, monumental e mineral, sem abandonar o manifesto.
- Mapa: composicao mais central e operacional, com mapa maior e filtros como apoio lateral.
- Bairros: cards territoriais tratados como chapas frias de leitura politica.
- Agir: frentes de acao em superficies mais claras, com prioridade e CTA preservados.
- Admin: mesa editorial seca, mais legivel e menos escura.

## Ordem de Aplicacao

1. Usar componentes compartilhados quando existirem: `ButtonLink`, `Badge`, `MetricCard`, `InternalPageHeader`, `PropertyCard`.
2. Em blocos especificos de rota, preferir `tt-panel`, `tt-card` e `tt-sidebar`.
3. Em formularios, usar `tt-input` com padding local.
4. Usar `tt-hero` apenas para aberturas de pagina, mantendo altura compacta em telas operacionais.
5. Usar amarelo apenas para acao, foco e conflito.

## O Que Evitar

- Light mode generico.
- Azul saturado demais.
- Vidro futurista brilhante.
- Ferrugem como tema principal.
- Cards com cara de CRM corporativo.
- Hero interno alto demais em paginas de operacao.

## Resultado Esperado

Uma interface mais clara, respiravel e viva, ainda dura, seria e politica. A sensacao deve ser de poder institucional frio reaproveitado como instrumento de leitura popular do territorio.

## Decisoes Finais de QA

- Home permanece como pagina mais monumental, mas com profundidade cromatica e menos massa escura opaca.
- Rotas publicas e administrativas operacionais abrem com topo compacto em `PanelCard` + `SectionHeader` quando a prioridade e leitura rapida e CTA.
- `InternalPageHeader` deixa de ser o padrao dominante das rotas publicas principais.
- `MetricCard` segue como apoio narrativo e orientacao rapida, nunca como grade de dashboard autonoma.
- `Badge` concentra status, criticidade e marcadores territoriais para reduzir ruido de leitura.
- Estados vazios devem sempre orientar o proximo passo, preferindo mapa, acervo ou acao quando fizer sentido.
- Mobile deve empilhar blocos sem depender de colunas auxiliares escondidas; CTA principal precisa continuar visivel na primeira dobra util.
- Evitar excesso de azul: `steel` e `glass` entram como atmosfera e profundidade, nao como tinta dominante da interface.
- Evitar preto absoluto: usar `ink`, `ink-alt` e gradientes minerais como base escura respiravel.
- Ferrugem fica restrita a desgaste, vacancia, alerta localizado ou memoria industrial, sem virar tema principal.
