# rendering-system Specification

## Purpose
TBD - created by archiving change add-initial-architecture-documentation. Update Purpose after archive.
## Requirements
### Requirement: Templates DOM
A documentação MUST descrever os dois `<template>` definidos em
`index.html` e a forma como o JS os instancia.

#### Scenario: Documento lista os templates
- **WHEN** o leitor consulta "como o DOM é gerado"
- **THEN** o documento MUST identificar `#tpl-node` (template de
  `<li class="tv-node">`) e `#tpl-card` (template de
  `<div class="tv-card">`), e MUST apontar para o `cloneNode(true)`
  usado em `buildNodeEl` (`treeviewer.js`).

#### Scenario: Documento explica a estrutura do template de nó
- **WHEN** o leitor consulta a estrutura de um nó
- **THEN** o documento MUST listar as sub-partes usadas pelo JS:
  `.tv-level` (linha clicável), `.tv-expander` (botão
  expand/collapse), `.tv-node-icon` (abre picker), `.tv-node-name`
  (editável), `.tv-drag-handle`, `.tv-node-actions` (grupo de
  botões de ação), `.tv-action-notes`/`.tv-action-add`/etc.
  (botões), e `.tv-children` (lista recursiva).

### Requirement: Pipeline de renderização
A documentação MUST distinguir os dois caminhos de render: `render`
(rebuild completo) e `rerenderNode` (substituição cirúrgica).

#### Scenario: Documento explica quando render é chamado
- **WHEN** o leitor consulta "quando o canvas é reconstruído"
- **THEN** o documento MUST listar as operações que chamam
  `render()`: criação/remoção de raiz ou filho, drag-and-drop,
  indentação, novo projeto, import, toggle de minimizar card, e
  qualquer mutação estrutural ampla.

#### Scenario: Documento explica quando rerenderNode é chamado
- **WHEN** o leitor consulta "quando apenas um nó é re-renderizado"
- **THEN** o documento MUST listar: `toggleExpand` e
  `commitEditing`/`cancelEditing`, e MUST explicar que
  `rerenderNode` existe para evitar o flicker de perda de foco
  durante edição inline e toggle de expand.

### Requirement: Classes CSS principais
A documentação MUST listar as classes CSS centrais e o seu papel
estrutural.

#### Scenario: Documento enumera as classes
- **WHEN** o leitor consulta "quais classes estruturam o app"
- **THEN** o documento MUST listar no mínimo: `tv-header`,
  `tv-canvas`/`tv-canvas-wrap`, `tv-card`/`tv-card--minimized`/
  `tv-card__header`/`tv-card__title`/`tv-card__body`/
  `tv-card__tree`/`tv-card--dragging`/`tv-card__minimize-btn`/
  `tv-card__drag-handle`/`tv-card-drop-indicator`,
  `tv-node`/`tv-level`/`tv-expander`/`tv-node-icon`/
  `tv-node-name`/`tv-node-actions`/`tv-children`/
  `tv-action-btn` (e variantes `tv-action-{add,del,up,down,
  indent-in,indent-out,notes}`)/`tv-drag-handle`/
  `tv-node--dragging`/`tv-node--drag-over`/
  `tv-drop-indicator`, `tv-statusbar`, `tv-empty`,
  `tv-icon-picker`/`tv-icon-picker__search`/
  `tv-icon-picker__grid`/`tv-icon-picker__footer`,
  `tv-modal-overlay`/`tv-modal`/`tv-modal__header`/
  `tv-modal__body`/`tv-btn`/`tv-btn--primary`/
  `tv-btn--ghost`/`tv-btn--danger`,
  `tv-notes-*`, `tv-copy-btn`/`tv-copy-btn--ok`, `tv-zoom-*`,
  `tv-shortcuts-table`.

### Requirement: Ciclo de seleção
A documentação MUST descrever como `selectNode` interage com o DOM
e o estado, e como o card "focado" é derivado.

#### Scenario: Documento explica a seleção
- **WHEN** o leitor consulta "como um nó é marcado como
  selecionado"
- **THEN** o documento MUST indicar que a seleção é puramente
  visual (classe `.selected` no `.tv-level`) e que
  `state.selectedId` é a fonte da verdade, e MUST descrever que
  ao mudar de nó qualquer edição em aberto é
  commitada (`commitEditing` em `selectNode`).

### Requirement: Variável CSS de largura por card
A documentação MUST descrever a nova variável CSS
`--width-level` aplicada inline em cada `.tv-card` e a
variável `--card-base-width` no `:root`.

#### Scenario: Documento explica o cálculo de largura
- **WHEN** o leitor consulta "como a largura do card é
  calculada"
- **THEN** o documento MUST descrever que a largura
  renderizada é
  `calc(var(--card-base-width) * var(--width-level, 1))`,
  MUST indicar o valor atual de `--card-base-width`
  (240px) e MUST explicar que `--width-level` é setado
  inline pelo `render()` a partir de
  `root.widthLevel` (default 1).

#### Scenario: Documento lista as classes do popover
- **WHEN** o leitor consulta "quais classes novas foram
  adicionadas"
- **THEN** o documento MUST listar `tv-card__width-btn`,
  `tv-width-popover`, `tv-width-popover__option` e
  `tv-width-popover__option--active`.

#### Scenario: Documento explica o max-width
- **WHEN** o leitor consulta "qual é o `max-width` do
  card"
- **THEN** o documento MUST indicar que `max-width` é
  ≥ `calc(var(--card-base-width) * 3)` (ex.: 720px),
  garantindo que um card 3x não seja clipado.

### Requirement: Reflow via flex-wrap
A documentação MUST confirmar que cards maiores
quebram linha automaticamente via `flex-wrap: wrap`
no `.tv-canvas` (`treeviewer.css:250`).

#### Scenario: Documento explica o reflow
- **WHEN** o leitor consulta "o que acontece quando
  cards maiores não cabem"
- **THEN** o documento MUST indicar que o canvas
  é `display: flex; flex-wrap: wrap; gap: 20px` e
  MUST explicar que a quebra é puramente CSS, sem
  código JS de grid.

