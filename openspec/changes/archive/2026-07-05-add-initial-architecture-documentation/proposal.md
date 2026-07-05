## Why

A base de código do TreeViewer (2088 linhas em `treeviewer.js` + 1209 em
`treeviewer.css` + 463 em `index.html`) evoluiu organicamente e hoje só
dispõe de documentação de "como usar" (`README.md`) e "como contribuir"
(`CONTRIBUTING.md`). Não há uma referência técnica que descreva a
arquitetura interna, o modelo de dados, o pipeline de renderização ou os
módulos funcionais (drag-and-drop, modal de anotações, icon picker). Isso
dificulta onboarding, code review e trabalho de agentes. A mudança
propõe gerar essa referência por engenharia reversa, como **documento
inicial baseado no código atual**, sem introduzir comportamento novo.

## What Changes

- Adicionar `docs/ARCHITECTURE.md` com a descrição técnica do sistema
  derivada da leitura do código atual (linhas, identificadores, classes
  CSS, templates `<template>` referenciados por `treeviewer.js`).
- Cobrir, no mínimo: visão geral e fluxo de execução, modelo de dados
  (`TreeNode`, `state`, geração de ID), pipeline de renderização
  (templates, `render`, `rerenderNode`, classes CSS centrais), módulos
  de interação (drag-and-drop de nós e de cards, indentação, edição
  inline, navegação por teclado), modal de anotações (conversores
  markdown, modos visual/raw, toolbar, limite), icon picker
  (`ICON_REGISTRY`, busca, posicionamento), e persistência
  (`localStorage`, import/export JSON com sanitização).
- Não há mudança de comportamento, dependências ou APIs: este é um
  change puramente documental.

## Capabilities

### New Capabilities

- `architecture-overview`: visão geral do sistema, dos três arquivos,
  do fluxo de execução (bootstrap → `DOMContentLoaded` → `loadState` →
  `render`) e das camadas (estado, helpers, render, ações, I/O,
  inicialização).
- `data-model`: shape de `TreeNode`, formato do objeto `state`,
  esquema de `STORAGE_KEY` (`treeviewer_v1`), geração de ID
  (`newId` / `_idCounter`) e formato JSON de export/import
  (incluindo sanitização em `importJSON`).
- `rendering-system`: templates DOM (`#tpl-node`, `#tpl-card`),
  pipeline `render` vs `rerenderNode`, mapeamento de classes CSS
  principais (`tv-node`, `tv-level`, `tv-card`, `tv-children`,
  `tv-canvas`, etc.) e ciclo de seleção (`selectNode`,
  `scrollToSelected`).
- `feature-modules`: descrição dos módulos funcionais
  isolados — keyboard shortcuts (handler global em `keydown`),
  drag-and-drop de nós internos e de cards raiz, indentação
  (`indentIn` / `indentOut`), edição inline (`startEditing` /
  `commitEditing` / `cancelEditing`), icon picker
  (`openIconPicker` / `renderIconGrid` / `searchIcons`), modal
  de anotações (`markdownToHtml` / `htmlToMarkdown` /
  `_applyFormatRaw` / `_applyFormatVisual`), zoom
  (`setZoom`, range 0.5–2.0), e clipboard com fallback para
  `file://`.

### Modified Capabilities

_Nenhuma._ Não existem specs em `openspec/specs/`, e esta mudança
não altera requisitos de comportamento — apenas descreve o que já
está implementado.

## Impact

- **Arquivos novos:** `docs/ARCHITECTURE.md`.
- **Arquivos referenciados (somente leitura):** `index.html`,
  `treeviewer.css`, `treeviewer.js`, `README.md`,
  `CONTRIBUTING.md`, `SECURITY.md`, `THIRD_PARTY_NOTICES`.
- **Código:** nenhum. Sem mudanças em runtime, sem novas
  dependências, sem alteração de APIs.
- **Riscos:** imprecisões na doc se o documento desalinhar do
  código. Mitigação: cada afirmação da doc aponta para
  `arquivo:linha` ou identificador concreto; revisão manual do
  autor antes do merge; nenhum outro doc deve ser removido ou
  reescrito.
