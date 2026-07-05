## ADDED Requirements

### Requirement: Botão "Largura" no header do card
O `tpl-card` MUST incluir um botão `.tv-card__width-btn`
posicionado **antes** (à esquerda) de
`.tv-card__paste-btn`, dentro de `.tv-card__header`.

#### Scenario: Botão presente no template
- **WHEN** o template é renderizado para um card
- **THEN** o card MUST conter um botão com classe
  `tv-card__width-btn` e MUST estar adjacente ao botão
  paste (à esquerda dele).

#### Scenario: Botão tem ícone sem texto
- **WHEN** o botão é renderizado
- **THEN** ele MUST conter um ícone (sliders/resize) e
  `title` em pt-BR, sem texto visível.

#### Scenario: Botão abre o popover
- **WHEN** o usuário clica no botão
- **THEN** o popover MUST abrir ancorado no botão.

### Requirement: Popover com 3 opções 1x, 2x, 3x
Ao abrir, o popover MUST mostrar 3 botões com labels
`1x`, `2x`, `3x`, e MUST marcar visualmente o nível
atual da raiz.

#### Scenario: Estrutura do popover
- **WHEN** o popover está aberto
- **THEN** ele MUST conter um container
  `.tv-width-popover` com header opcional e três
  botões: `.tv-width-popover__option[data-level="1|2|3"]`.

#### Scenario: Opção atual marcada
- **WHEN** a raiz tem `widthLevel = 2`
- **THEN** o botão `[data-level="2"]` MUST ter
  `aria-pressed="true"` e classe `tv-width-popover__option--active`,
  e os outros MUST ter `aria-pressed="false"`.

### Requirement: Aplicação do nível escolhido
Click em uma opção MUST definir
`root.widthLevel = N`, fechar o popover, persistir via
`saveState()` e re-renderizar.

#### Scenario: Selecionar novo nível
- **WHEN** o usuário clica em `[data-level="3"]` em uma
  raiz com `widthLevel = 1`
- **THEN** `root.widthLevel` MUST passar a `3`, o
  popover MUST fechar, `saveState` MUST ser chamado e
  o `render()` MUST refletir a nova largura.

#### Scenario: Selecionar mesmo nível
- **WHEN** o usuário clica no nível atual
  (e.g. raiz em 2, clica em `2x`)
- **THEN** o popover MUST fechar e o estado MUST
  permanecer inalterado (sem re-render, sem novo
  `saveState`).

### Requirement: Fechamento do popover
O popover MUST fechar em qualquer das seguintes
condições: click em uma opção; pressionar `Escape`;
clicar fora do popover e do botão que o abriu.

#### Scenario: Tecla Escape
- **WHEN** o popover está aberto e o usuário pressiona
  `Escape`
- **THEN** o popover MUST fechar.

#### Scenario: Click-fora
- **WHEN** o usuário clica fora do
  `.tv-width-popover` e fora do `.tv-card__width-btn`
- **THEN** o popover MUST fechar.

### Requirement: Apenas um popover aberto por vez
Abrir o popover de largura em um card MUST fechar
qualquer popover aberto em outro card (paste ou
largura).

#### Scenario: Troca de popover entre cards
- **WHEN** o popover de paste do card A está aberto e
  o usuário clica no botão "Largura" do card B
- **THEN** o popover de paste do card A MUST fechar e
  o popover de largura do card B MUST abrir.

### Requirement: Estilo coerente com o restante do app
O botão e o popover MUST usar o prefixo de classe
`tv-` e devem herdar as variáveis CSS de tema
existentes (`--bg-card`, `--border`, `--text-dim`,
`--text-muted`, `--bg-node-hov`, `--font`,
`--accent`).

#### Scenario: Variáveis de tema
- **WHEN** o tema é alternado
- **THEN** o botão e o popover MUST refletir
  automaticamente as cores do tema atual.

#### Scenario: Opção ativa com cor de destaque
- **WHEN** a opção atual está marcada
- **THEN** ela MUST usar `--accent` (ou similar) como
  cor de destaque.
