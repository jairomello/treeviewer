## ADDED Requirements

### Requirement: Botão "Colar ASCII" no header do card
O `tpl-card` em `index.html` MUST incluir um botão
`.tv-card__paste-btn` posicionado **antes** (visualmente à
esquerda) do `.tv-card__minimize-btn` dentro de
`.tv-card__header`.

#### Scenario: Botão presente no template
- **WHEN** o template é renderizado para um card
- **THEN** o card MUST conter um botão com classe
  `tv-card__paste-btn` e MUST estar adjacente ao botão
  minimizar.

#### Scenario: Botão tem ícone e label em pt-BR
- **WHEN** o botão é renderizado
- **THEN** ele MUST conter um ícone (paste/clipboard do
  Lucide) e o label "Colar" (ou título acessível
  equivalente).

#### Scenario: Botão abre o popover
- **WHEN** o usuário clica no botão
- **THEN** o popover MUST abrir e MUST estar ancorado
  visualmente no botão.

### Requirement: Popover com textarea e botões de ação
Ao abrir, o popover MUST mostrar um `<textarea>` de
altura fixa, um botão "Importar" e um botão "Cancelar".

#### Scenario: Estrutura do popover
- **WHEN** o popover está aberto
- **THEN** ele MUST conter um `<textarea class="tv-card__paste-textarea">`,
  um botão "Importar" e um botão "Cancelar", nessa
  ordem.

#### Scenario: Textarea com placeholder em pt-BR
- **WHEN** o popover abre com textarea vazio
- **THEN** o `<textarea>` MUST exibir um placeholder
  curto em pt-BR sugerindo o formato (referenciando
  implicitamente o output do botão "Copiar").

#### Scenario: Foco inicial no textarea
- **WHEN** o popover abre
- **THEN** o `<textarea>` MUST receber foco
  automaticamente.

### Requirement: Botão "Importar" desabilitado com textarea vazio
O botão "Importar" MUST estar desabilitado enquanto o
`<textarea>` estiver vazio (apenas whitespace).

#### Scenario: Estado inicial
- **WHEN** o popover abre e o textarea está vazio
- **THEN** "Importar" MUST estar com `disabled`.

#### Scenario: Habilitar ao digitar
- **WHEN** o usuário digita ou cola qualquer caractere
  não-whitespace no textarea
- **THEN** "Importar" MUST passar a `enabled`.

### Requirement: Fechamento do popover
O popover MUST fechar em qualquer das seguintes condições:
clique em "Cancelar"; pressionar `Escape`; clicar fora do
popover e do botão que o abriu; ou após um paste com
sucesso.

#### Scenario: Cancelar
- **WHEN** o usuário clica em "Cancelar"
- **THEN** o popover MUST fechar sem alterar `state.roots`.

#### Scenario: Tecla Escape
- **WHEN** o popover está aberto e o usuário pressiona
  `Escape`
- **THEN** o popover MUST fechar.

#### Scenario: Click-fora
- **WHEN** o usuário clica fora do popover e fora do
  `.tv-card__paste-btn`
- **THEN** o popover MUST fechar.

#### Scenario: Paste com sucesso
- **WHEN** o usuário clica em "Importar" e o parser
  aceita o texto
- **THEN** o popover MUST fechar após a substituição.

#### Scenario: Paste com erro
- **WHEN** o parser rejeita o texto
- **THEN** o popover MUST permanecer aberto e o caller
  MUST exibir `alert` com a mensagem de erro em pt-BR.

### Requirement: Apenas um popover aberto por vez
Abrir o popover em um card MUST fechar qualquer popover
aberto em outro card.

#### Scenario: Troca de popover entre cards
- **WHEN** o popover do card A está aberto e o usuário
  clica no botão "Colar" do card B
- **THEN** o popover do card A MUST fechar e o popover
  do card B MUST abrir.

### Requirement: Estilo coerente com o restante do app
O botão e o popover MUST usar o prefixo de classe `tv-` e
devem herdar as variáveis CSS de tema (`--border`,
`--bg-card-hd`, `--text-dim`, `--text-muted`,
`--bg-node-hov`, `--font`, etc.).

#### Scenario: Variáveis de tema
- **WHEN** o tema é alternado (`data-theme="light"` /
  `"dark"`)
- **THEN** o botão e o popover MUST refletir
  automaticamente as cores do tema atual.

#### Scenario: Posicionamento do popover
- **WHEN** o popover está aberto
- **THEN** ele MUST estar visualmente conectado ao botão
  (sem gap), com fundo opaco, borda sutil e leve sombra,
  e MUST estar acima do `.tv-card__body` no eixo Z
  (`z-index` suficiente).
