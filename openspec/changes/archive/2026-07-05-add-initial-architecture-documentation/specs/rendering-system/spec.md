## ADDED Requirements

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
