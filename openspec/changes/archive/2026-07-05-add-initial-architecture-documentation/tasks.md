## 1. Bootstrap do documento

- [x] 1.1 Criar `docs/` (caso não exista) e o arquivo
      `docs/ARCHITECTURE.md` com frontmatter mínimo (título,
      intenção: "documento derivado do código atual") e um
      índice (TOC) com as 4 seções principais alinhadas aos
      capabilities do `proposal.md`.
- [x] 1.2 Adicionar cabeçalho de "fonte da verdade" deixando
      explícito que o código prevalece sobre o doc em caso de
      divergência e que toda referência usa o formato
      `arquivo:linha` ou identificador concreto.

## 2. Seção `architecture-overview`

- [x] 2.1 Listar os três arquivos de runtime e a função de cada
      um (markup, estilos, lógica), citando
      `README.md`/`CONTRIBUTING.md`/`AGENTS.md` como docs
      complementares.
- [x] 2.2 Descrever o fluxo de boot na ordem: registro de
      `DOMContentLoaded` → `loadState()` → `render()` →
      registro de listeners (header, modais, picker, teclado
      global). Apontar para o listener no final de
      `treeviewer.js` (~linha 1883).
- [x] 2.3 Mapear as camadas lógicas e seus banners de seção
      (ICON_REGISTRY, STATE, helpers de árvore, persistência,
      projeto, DOM helpers, ações, icon picker, modal de
      notas, inicialização).

## 3. Seção `data-model`

- [x] 3.1 Descrever `TreeNode` (campos `id`, `name`, `iconName`,
      `notes`, `children`, `expanded`, `minimized`) apontando
      para `createNode` em `treeviewer.js` (~linha 280).
- [x] 3.2 Descrever o objeto `state` global (`roots`,
      `selectedId`, `editingId`, `editingPrevName`, `zoom`,
      `theme`).
- [x] 3.3 Documentar `STORAGE_KEY = 'treeviewer_v1'`, o payload
      gravado em `localStorage` por `saveState` e a regra de
      bump de versão apenas em schema quebrado.
- [x] 3.4 Documentar `newId` (formato) e a invariante de
      `_idCounter` (recalculado em `loadState` e após
      `importJSON` via `maxId` recursivo).
- [x] 3.5 Documentar o payload de export (`{ roots: [...] }`,
      sugestão de nome `YYYY-MM-DD-<raiz>`) e a sanitização em
      `importJSON` (`Object.create(null)` transitório,
      validação de `iconName`, defaults, truncamentos, recálculo
      de `_idCounter`).

## 4. Seção `rendering-system`

- [x] 4.1 Listar os dois `<template>` (`#tpl-node`, `#tpl-card`)
      e descrever a estrutura interna do template de nó
      (sub-partes usadas pelo JS).
- [x] 4.2 Diferenciar `render()` (rebuild completo) de
      `rerenderNode(id)` (substituição cirúrgica) e listar
      quem chama cada um.
- [x] 4.3 Listar as classes CSS principais (header, canvas,
      card e variantes, nó e variantes, modal e variantes,
      notas, picker, zoom, atalhos, status bar) com uma linha
      de papel de cada uma.
- [x] 4.4 Descrever o ciclo de seleção: classe `.selected` no
      `.tv-level`, fonte da verdade em `state.selectedId`,
      auto-commit de edição em `selectNode`, e o toggle de
      `.focused` no card que contém o nó selecionado.

## 5. Seção `feature-modules`

- [x] 5.1 Atalhos: listar todos os atalhos e as guardas do
      handler global (modal aberta, picker aberto, input
      externo focado). Apontar para o `switch (e.key)` em
      `treeviewer.js` (~linha 2015).
- [x] 5.2 DnD de nós: descrever `dataTransfer` (texto = `id`),
      cálculo de posição (`before`/`after`), indicador visual
      e trava anti-ciclo via `isAncestor`.
- [x] 5.3 DnD de cards: descrever `CARD_DRAG_PREFIX = 'card:'`,
      `_cardDragActive` e a exclusão mútua com DnD de nós.
- [x] 5.4 Indentação: descrever `indentOut` (promover: vira
      irmão do pai, no-op se já é raiz) e `indentIn`
      (rebaixar: vira filho do irmão acima, expande o novo
      pai, no-op se não há irmão acima).
- [x] 5.5 Edição inline: descrever o ciclo (`startEditing` →
      input → `commitEditing`/`cancelEditing`), teclas
      (`Enter`/`Escape`/`blur`) e o uso de `state.editingPrevName`.
- [x] 5.6 Icon picker: descrever `ICON_REGISTRY` (linhas 11–239,
      shape `{ name, kw, svg }`), `searchIcons` (case-
      insensitive, name + kw), ancoramento com fallback para
      cima e fechamento por click-fora.
- [x] 5.7 Modal de notas: descrever a estrutura (overlay,
      título, preview contenteditable, textarea raw, contador,
      toolbar com `data-action`, botão de modo), `NOTES_MAX
      = 4000`, e o limite com truncamento não destrutivo.
- [x] 5.8 Modal de notas (conversores): descrever
      `markdownToHtml` (escapa HTML, headings, listas,
      bold/italic, negrito-itálico) e `htmlToMarkdown`
      (DOM-based, recursivo, normaliza quebras triplas).
- [x] 5.9 Modal de notas (formatação): descrever `applyFormat`
      despachando para `_applyFormatVisual` (`document.execCommand`)
      e `_applyFormatRaw` (manipula `selectionStart`/`selectionEnd`),
      e `_getCurrentMarkdown` lendo do modo ativo.
- [x] 5.10 Zoom: descrever `setZoom` (clamp 0.5–2.0 com passo
      0.1, transform + compensação de width/height) e o
      estado disabled dos botões nos extremos.
- [x] 5.11 Clipboard: descrever `copyCardAsAscii` (tentativa
      via `navigator.clipboard.writeText` + fallback com
      `<textarea>` off-screen + `document.execCommand('copy')`),
      feedback visual "Copiado" (1.5s) em ambos.
- [x] 5.12 API pública: listar `window.TreeViewer` (`addRoot`,
      `exportJSON`, `importJSON`, `newProject`) e observar que
      só `addRoot` é usado a partir do HTML (botão do empty
      state).

## 6. Revisão final

- [x] 6.1 Cross-check manual: para cada `arquivo:linha` citado
      no doc, abrir o arquivo e confirmar que o trecho/identificador
      ainda está lá.
- [x] 6.2 Conferir se toda seção/capability do `proposal.md`
      está coberta no doc (1:1 com `proposal.md` Capabilities).
- [x] 6.3 Conferir se nenhuma afirmação extrapola o código
      (sem recomendações, sem tutoriais, sem cobertura de
      features não implementadas).
- [x] 6.4 Verificar que o doc é renderizável como Markdown
      puro (apenas tags de tabela GFM, `<kbd>` em §4.1 e
      cabeçalhos — sem HTML arbitrário) e que abre corretamente
      na preview do GitHub.
- [x] 6.5 Conferir pt-BR na prosa e inglês em
      identificadores/classes/IDs, conforme convenção do
      `AGENTS.md`.
