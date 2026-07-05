# TreeViewer — Arquitetura

> Documento derivado do código atual (`index.html`,
> `treeviewer.css`, `treeviewer.js`). Cada afirmação aponta para
> uma âncora concreta (`arquivo:linha` ou identificador) para
> permitir verificação rápida. **Em caso de divergência, o código
> prevalece.**

## Índice

1. [Visão geral](#1-visão-geral) — _capability: `architecture-overview`_
2. [Modelo de dados](#2-modelo-de-dados) — _capability: `data-model`_
3. [Renderização e templates](#3-renderização-e-templates) — _capability: `rendering-system`_
4. [Módulos de funcionalidade](#4-módulos-de-funcionalidade) — _capability: `feature-modules`_

## 1. Visão geral

_Capability: `architecture-overview`._

### 1.1 Os três arquivos de runtime

O app inteiro cabe em três arquivos no root do repositório:

| Arquivo          | Papel                                                                       |
| ---------------- | --------------------------------------------------------------------------- |
| `index.html`     | Markup completo, templates DOM (`<template>`) e modais estáticos.           |
| `treeviewer.css` | Estilos, organizados por banners `/* ── Section ── */` e variantes de tema. |
| `treeviewer.js`  | Lógica em módulo único `strict mode` (2088 linhas), organizado por banners. |

Sem build, sem `package.json` no root, sem `node_modules`. O app
precisa funcionar aberto direto via `file://` (ver `AGENTS.md`).

Documentos de orientação complementares (não-técnicos):

- `README.md` — uso e features.
- `CONTRIBUTING.md` — como contribuir.
- `AGENTS.md` — convenções para agentes (inclui restrições de
  segurança e o invariante `textContent` / `innerHTML`).
- `SECURITY.md` — threat model.
- `THIRD_PARTY_NOTICES` — atribuições (ícones Lucide/Feather).

`ARCHITECTURE.md` (este arquivo) é a referência técnica derivada
por engenharia reversa do código atual.

### 1.2 Fluxo de bootstrap

A inicialização está concentrada no final de `treeviewer.js`:

1. `window.TreeViewer = { addRoot, exportJSON, importJSON, newProject }`
   (`treeviewer.js:1881`) — expõe a API pública mínima.
2. `document.addEventListener('DOMContentLoaded', …)`
   (`treeviewer.js:1883`) — registra o callback de boot.
3. O callback chama, em ordem: `loadState()`
   (`treeviewer.js:360`), `render()` (`treeviewer.js:829`).
4. Em seguida registra listeners do header (novo projeto, abrir/
   salvar JSON, nova árvore, zoom, tema, atalhos), do modal de
   notas (OK/cancel/fechar, modo, toolbar, contador, atalhos
   `Ctrl+B`/`Ctrl+I`), do modal de atalhos, do icon picker
   (busca, limpar, click-fora) e o **handler global de teclado**
   (`treeviewer.js:2015`).

### 1.3 Camadas lógicas de `treeviewer.js`

O arquivo é um único módulo IIFE-less com `'use strict'`. As
camadas são separadas por banners de comentário, não por módulos
ES. Em ordem aproximada de aparição:

| Banner                          | Conteúdo                                                  |
| ------------------------------- | --------------------------------------------------------- |
| `ICON_REGISTRY` (linhas 11–239) | Array de ~200 ícones Lucide/Feather inline.               |
| `STATE` (linha 268)             | `let state = { … }` e helpers de criação/ID.             |
| Helpers de árvore (linha 284)   | `findNode`, `findParentList`, `findParentNode`, `getDepth`, `flattenVisible`, `countAll`. |
| Persistência (linha 348)        | `STORAGE_KEY`, `saveState`, `loadState`.                  |
| Projeto (linha 386)             | `showConfirm`, `showPrompt`, `exportJSON`, `importJSON`, `newProject`. |
| DOM helpers (linha 602)         | `el()`, `buildNodeEl`, `updateExpanderState`, `render`, `rerenderNode`. |
| Ações da árvore (linha 967)     | `addRoot`, `addChild`, `removeNode`, `toggleExpand`, `moveNode`, `selectNode`, edição inline, indentação. |
| ASCII art (linha 1178)          | `treeToAscii`, `copyCardAsAscii`.                         |
| DnD de cards (linha 1241)       | `attachCardDrag`, `_removeCardDropIndicators`.            |
| Zoom (linha 1346)               | `setZoom`.                                                |
| Navegação por teclado (linha 1366) | `selectPrev`, `selectNext`, `selectParent`, `selectFirstChild`, `scrollToSelected`. |
| Icon picker (linha 1405)        | `openIconPicker`, `closeIconPicker`, `renderIconGrid`.    |
| Modal de anotações (linha 1465) | Conversores markdown, modos, formatação, contador.        |
| Inicialização (linha 1877)      | `window.TreeViewer` e `DOMContentLoaded`.                 |

## 2. Modelo de dados

_Capability: `data-model`._

### 2.1 `TreeNode`

Forma canônica, construída por `createNode(name, depth)` em
`treeviewer.js:280`:

| Campo       | Tipo                  | Notas                                                                                |
| ----------- | --------------------- | ------------------------------------------------------------------------------------ |
| `id`        | `string`              | Formato `n<counter>_<rand>` (ver §2.4).                                              |
| `name`      | `string`              | Nome editável inline.                                                                |
| `iconName`  | `string`              | Nome de entrada em `ICON_REGISTRY`; default por profundidade via `defaultIconName` (`treeviewer.js:242`). |
| `notes`     | `string`              | Markdown bruto. Cap em `NOTES_MAX = 4000` (`treeviewer.js:1469`).                    |
| `children`  | `TreeNode[]`          | Recursivo.                                                                           |
| `expanded`  | `boolean`             | Controla visibilidade dos filhos. Default `true`.                                    |
| `minimized` | `boolean`             | Só usado em raízes; default `false`.                                                 |
| `widthLevel` | `1 \| 2 \| 3`        | Só usado em raízes. Nível de largura do card. Mapeado em pixels via `CARD_WIDTH_PX`: `1→480px`, `2→720px`, `3→1080px` (`treeviewer.js:289`). Default `1`. Normalizado por `normalizeWidthLevel` (`treeviewer.js:286`). |

### 2.2 `state` global

Declarado em `treeviewer.js:268`:

| Campo              | Tipo / faixa                            |
| ------------------ | --------------------------------------- |
| `roots`            | `TreeNode[]`                            |
| `selectedId`       | `string \| null`                        |
| `editingId`        | `string \| null`                        |
| `editingPrevName`  | `string \| null`                        |
| `zoom`             | número, faixa `[0.5, 2.0]`, passo 0.1.  |
| `theme`            | `'dark' \| 'light'`.                    |

### 2.3 Persistência (`localStorage`)

- Chave: `STORAGE_KEY = 'treeviewer_v1'` (`treeviewer.js:348`).
  Bump (e.g. `_v2`) só em mudança de schema incompatível.
- `saveState()` (`treeviewer.js:350`) grava `{ roots, zoom, theme }`.
  Envolve em `try/catch` (ignora quota excedida).
- `loadState()` (`treeviewer.js:360`) lê, faz `JSON.parse`,
  restaura os três campos, e recalcula `_idCounter` (ver §2.4).
  Envolve em `try/catch` (ignora JSON inválido).

### 2.4 Geração de IDs

- `newId()` (`treeviewer.js:278`):
  ```js
  'n' + (++_idCounter) + '_' + Math.random().toString(36).slice(2, 7)
  ```
- `_idCounter` é recalculado em `loadState` (via `maxId`
  recursivo em `treeviewer.js:369`) e em `importJSON` (via
  `maxId` em `treeviewer.js:549`) para evitar colisão com IDs
  importados ou restaurados.

### 2.5 Import / Export JSON

**Export** (`exportJSON`, `treeviewer.js:457`):

- Payload: `{ roots: state.roots }` serializado com
  `JSON.stringify(payload, null, 2)`.
- Nome sugerido: `YYYY-MM-DD-<nome-da-primeira-raiz>` (após
  sanitização do nome via `replace(/[^a-zA-Z0-9À-ÿ _-]/g, '')`)
  ou `treeviewer` se vazio. Usuário pode editar via `showPrompt`.
- Download via `Blob` + `URL.createObjectURL` + `<a download>`.
- Em estado vazio, é no-op.

**Import** (`importJSON`, `treeviewer.js:487`):

- Pede confirmação se já há `roots`.
- Lê arquivo via `<input type="file" id="file-input-json">` +
  `FileReader.readAsText`.
- Se o JSON for inválido ou não contiver `Array.isArray(parsed.roots)`,
  exibe `alert` e aborta.
- Cada nó passa por `sanitizeNode` (`treeviewer.js:512`), que:
  - usa `Object.create(null)` transitório para evitar prototype
    pollution;
  - valida `iconName` contra `ICON_REGISTRY` (default por
    profundidade se ausente);
  - aplica defaults: `expanded !== false`, `minimized === true`;
  - normaliza `widthLevel` para `{1, 2, 3}` via
    `normalizeWidthLevel` (default `1`);
  - trunca `id` (64), `name` (512) e `notes` (4000);
  - filtra `children` recursivamente.
- Após a sanitização, recalcula `_idCounter` via `maxId`.
- Limpa `selectedId`, `editingId`, `editingPrevName` e chama
  `render()`.

## 3. Renderização e templates

_Capability: `rendering-system`._

### 3.1 Templates DOM

`index.html` define dois `<template>` clonados pelo JS via
`cloneNode(true)`:

- `#tpl-node` (`index.html:207`): `<li class="tv-node">`. Estrutura
  interna usada pelo JS (seletores exatos em `buildNodeEl`,
  `treeviewer.js:605`):
  - `.tv-level` — linha clicável que seleciona o nó.
  - `.tv-expander` — botão expand/collapse (mostra `▶`/`▼`).
  - `.tv-node-icon` — botão que abre o icon picker.
  - `.tv-node-name` — nome (substituído por `<input>` em edição).
  - `.tv-drag-handle` — alça de drag (visível no hover).
  - `.tv-action-notes` — botão de anotações (fica fora de
    `.tv-node-actions` para ter visibilidade independente).
  - `.tv-node-actions` — grupo de botões de ação:
    `.tv-action-indent-out`, `.tv-action-indent-in`,
    `.tv-action-up`, `.tv-action-down`, `.tv-action-add`,
    `.tv-action-del`.
  - `.tv-children` — `<ul>` recursivo, populado em
    `buildNodeEl` chamando a si mesmo para cada filho
    (`treeviewer.js:641`).
- `#tpl-card` (`index.html:286`): `<div class="tv-card">`.
  Estrutura interna:
  - `.tv-card__header` — contém `.tv-card__drag-handle`,
    `.tv-card__title` (preenchido com `root.name` em
    `treeviewer.js:851`), `.tv-card__width-btn` (abre o
    popover de largura), `.tv-card__paste-btn` (abre o
    popover de paste ASCII) e `.tv-card__minimize-btn`.
  - `.tv-card__body` — contém `.tv-card__tree` com
    `.tv-root-list` (populado em `treeviewer.js:870`).
  - O botão "Copiar" (`.tv-copy-btn`) é injetado dinamicamente
    em `.tv-card__body` em `treeviewer.js:854`.
  - `#tpl-paste-popover` (`index.html:321`): template
    clonado por `openPastePopover`
    (`treeviewer.js:1327`) — wrapper
    `.tv-card__paste-popover`, header,
    `.tv-card__paste-textarea`, e actions com
    `.tv-card__paste-cancel` / `.tv-card__paste-import`.
  - `#tpl-width-popover` (`index.html:357`): template
    clonado por `openWidthPopover` — wrapper
    `.tv-width-popover`, header
    `.tv-width-popover__header`, e três botões
    `.tv-width-popover__option[data-level="1|2|3"]` com
    label (`1x`/`2x`/`3x`) e check
    `.tv-width-popover__check`.

### 3.2 Pipeline: `render` vs `rerenderNode`

- `render()` (`treeviewer.js:829`) — **rebuild completo** do
  canvas. Chamado por:
  - `addRoot`, `addChild`, `removeNode`;
  - `moveNode` (após reordenar);
  - `indentOut`, `indentIn`;
  - DnD de nós e de cards (sucesso);
  - `newProject`, `importJSON`;
  - `selectNode` não chama `render`; só ajusta classes.
- `rerenderNode(id)` (`treeviewer.js:933`) — **substituição
  cirúrgica** do `<li>` por uma nova instância gerada por
  `buildNodeEl`. Chamado por:
  - `toggleExpand` (evita perder foco em outros nós);
  - `commitEditing`, `cancelEditing` (preserva foco do input
    de edição);
  - callback de seleção dentro do icon picker
    (`treeviewer.js:1453`).

### 3.3 Classes CSS principais

Todas as classes usam o prefixo `tv-`. Papéis estruturais:

- **Header / chrome:** `tv-header`, `tv-header__brand`,
  `tv-header__actions`, `tv-header__logo`, `tv-header__title`,
  `tv-header__sub`, `tv-header__sep`, `tv-icon-btn`,
  `tv-zoom-group`, `tv-zoom-btn`, `tv-zoom-label`.
- **Botões:** `tv-btn`, `tv-btn--primary`, `tv-btn--ghost`,
  `tv-btn--danger`, `tv-btn--lg`.
- **Canvas:** `tv-canvas-wrap`, `tv-canvas`, `tv-card`,
  `tv-card--minimized`, `tv-card--dragging`, `tv-card--focused`,
  `tv-card__header`, `tv-card__title`, `tv-card__body`,
  `tv-card__tree`, `tv-card__minimize-btn`, `tv-card__drag-handle`,
  `tv-card__width-btn`, `tv-card__paste-btn`,
  `tv-card-drop-indicator`.
- **Árvore (ul/li):** `tv-root-list`, `tv-node`, `tv-node--dragging`,
  `tv-node--drag-over`, `tv-level`, `tv-expander`, `tv-node-icon`,
  `tv-node-name`, `tv-node-name-input`, `tv-node-actions`,
  `tv-children`, `tv-action-btn` (e variantes `tv-action-add`,
  `tv-action-del`, `tv-action-up`, `tv-action-down`,
  `tv-action-indent-in`, `tv-action-indent-out`, `tv-action-notes`),
  `tv-action-notes--has-notes`, `tv-drag-handle`,
  `tv-drop-indicator`.
- **Status:** `tv-statusbar`, `tv-statusbar__dot`,
  `tv-statusbar__hints`.
- **Empty state:** `tv-empty`, `tv-empty__icon`, `tv-empty__hint`.
- **Icon picker:** `tv-icon-picker`, `tv-icon-picker__search`,
  `tv-icon-picker__grid`, `tv-icon-picker__footer`.
- **Modal genérico:** `tv-modal-overlay`, `tv-modal`, `tv-modal--sm`,
  `tv-modal--notes`, `tv-modal__header`, `tv-modal__body`.
- **Modal de notas:** `tv-notes-header-left`, `tv-notes-toolbar`,
  `tv-notes-toolbar-btn`, `tv-notes-toolbar-btn--icon`,
  `tv-notes-toolbar-sep`, `tv-notes-mode-toggle`,
  `tv-notes-mode-toggle--active`, `tv-notes-mode-label`,
  `tv-notes-icon-visual`, `tv-notes-icon-raw`, `tv-notes-body`,
  `tv-notes-preview`, `tv-notes-raw`, `tv-notes-footer`,
  `tv-notes-footer-actions`, `tv-notes-counter`,
  `tv-notes-counter--warn`, `tv-notes-counter--over`.
- **Cópia ASCII:** `tv-copy-btn`, `tv-copy-btn--ok`.
- **Paste ASCII (popover):** `tv-card__paste-popover`,
  `tv-card__paste-header`, `tv-card__paste-textarea`,
  `tv-card__paste-actions`, `tv-card__paste-cancel`,
  `tv-card__paste-import`.
- **Largura do card (popover):** `tv-width-popover`,
  `tv-width-popover__header`, `tv-width-popover__options`,
  `tv-width-popover__option`,
  `tv-width-popover__option--active`,
  `tv-width-popover__label`, `tv-width-popover__check`.
- **Atalhos:** `tv-shortcuts-table`.

### 3.4 Ciclo de seleção

- Fonte da verdade: `state.selectedId` (string ou `null`).
- Visual: classe `selected` aplicada no `.tv-level` do nó.
  Removida de todos os outros `treeviewer.js:1037`.
- `selectNode(id)` (`treeviewer.js:1030`):
  1. Se há edição em aberto em outro nó, chama `commitEditing()`
     automaticamente.
  2. Atualiza `state.selectedId`.
  3. Limpa `.selected` de todos os `.tv-level`.
  4. Aplica `.selected` no `.tv-level` do nó alvo.
  5. Alterna `.focused` em cada `.tv-card` com base em "este
     card contém um nó selecionado?".
- `scrollToSelected()` (`treeviewer.js:1385`) faz
  `scrollIntoView({ block: 'nearest', behavior: 'smooth' })` no
  `.tv-level` selecionado.

## 4. Módulos de funcionalidade

_Capability: `feature-modules`._

### 4.1 Atalhos de teclado

Handler global em `treeviewer.js:2015` (`switch (e.key)`). Guardas
na entrada do handler:

1. Se `#notes-overlay` está visível, o handler sai (a modal tem
   listener próprio que trata `Escape`, `Ctrl+B`, `Ctrl+I`).
2. Se o foco está em `<input>`/`<textarea>` que **não** é o input
   inline de nome de nó (`.tv-node-name-input`) nem
   `#icon-search`, o handler sai.
3. Se `#icon-picker` está visível, só `Escape` é tratado (fecha
   o picker) e o handler sai.

Mapa de teclas:

| Tecla                | Ação                                                                  |
| -------------------- | --------------------------------------------------------------------- |
| `F2`                 | Renomear nó selecionado (`startEditing`).                             |
| `Insert`             | Se há seleção: `addChild`. Senão: `addRoot`.                          |
| `Delete`             | Remover nó selecionado (`removeNode`).                                |
| `↑` / `↓`            | Navegar entre nós visíveis (`selectPrev` / `selectNext`).             |
| `Alt+↑` / `Alt+↓`    | Mover nó entre irmãos (`moveNode`).                                   |
| `Alt+←`              | Promover: `indentOut`.                                                |
| `Alt+→`              | Rebaixar: `indentIn`.                                                 |
| `→`                 | Expandir (se colapsado com filhos) ou ir para o primeiro filho.      |
| `←`                 | Recolher (se expandido com filhos) ou ir para o pai.                 |
| `Enter`              | Confirmar edição inline (tratado no input em `startEditing`).         |
| `Escape`             | Cancelar edição inline (`cancelEditing`) ou fechar picker.            |
| `Ctrl+B` / `Ctrl+I`  | Aplicar bold/italic na modal de notas (`treeviewer.js:1960`).         |

### 4.2 Drag-and-drop de nós

Implementado em `buildNodeEl` (`treeviewer.js:712-807`):

- `dataTransfer.setData('text/plain', node.id)` no `dragstart`.
- `dragover` calcula `before`/`after` pela metade do `rect` do `<li>`
  e cria/insere um `<div class="tv-drop-indicator">` no DOM
  (limpa indicadores antigos antes).
- `drop` lê `dragId` e `dropPos`, valida com `isAncestor(dragId, nodeId)`
  para impedir ciclo (o nó arrastado não pode ser ancestral do alvo),
  faz `splice` na lista de origem, insere na lista de destino,
  atualiza `state.selectedId = dragId`, chama `render()` e re-aplica
  `selectNode` + `scrollToSelected` no próximo frame.
- `dragend` limpa indicadores e classes residuais.

### 4.3 Drag-and-drop de cards (reordenar raízes)

- Constante: `CARD_DRAG_PREFIX = 'card:'` (`treeviewer.js:1244`).
- Flag global: `let _cardDragActive = false` (`treeviewer.js:1247`).
- `attachCardDrag(card, rootId)` (`treeviewer.js:1249`):
  - `draggable="true"` é setado no card.
  - Drag só inicia se o `mousedown` foi em
    `.tv-card__drag-handle` (controlado por
    `dragStartedFromHandle`).
  - `dataTransfer` carrega `CARD_DRAG_PREFIX + rootId`.
  - Em `dragover`, se `_cardDragActive` é falso, ignora (rejeita
    drags de nós internos).
  - Em `drop`, verifica o prefixo, faz `splice` em `state.roots`,
    chama `render()`.
- Exclusão mútua: drags de nó usam `text/plain` com o `id` puro;
  drags de card usam `text/plain` com `card:`. O `dragover` do nó
  não tem `CARD_DRAG_PREFIX` mas também não tem `_cardDragActive`,
  enquanto o de card checa `_cardDragActive` antes de reagir.

### 4.4 Indentação

- `indentOut(id)` (`treeviewer.js:1132`, `Alt+←`): "promover" — o nó
  deixa de ser filho do pai e vira irmão do pai (inserido logo
  abaixo na lista do avô). No-op se o nó já é raiz (sem pai).
- `indentIn(id)` (`treeviewer.js:1157`, `Alt+→`): "rebaixar" — o nó
  vira filho do irmão imediatamente acima. No-op se não há irmão
  acima. O novo pai é automaticamente expandido
  (`newParent.expanded = true`).

### 4.5 Edição inline

- `startEditing(id)` (`treeviewer.js:1051`): se já há edição em
  outro nó, comita primeiro. Salva `state.editingPrevName =
  node.name` e `state.editingId = id`. Substitui o `<span
  class="tv-node-name">` por `<input class="tv-node-name-input">`,
  foca e seleciona o texto.
- Teclas: `Enter` chama `commitEditing`; `Escape` chama
  `cancelEditing`. `blur` chama `commitEditing` com delay de 100ms
  para não conflitar com cliques em outros nós.
- `commitEditing()` (`treeviewer.js:1093`): lê `input.value.trim()`
  ou cai para `state.editingPrevName` se vazio; persiste em
  `node.name`; chama `rerenderNode(id)`; se for raiz, atualiza
  também o título do card; re-aplica `selectNode`.
- `cancelEditing()` (`treeviewer.js:1116`): restaura
  `node.name = state.editingPrevName`; chama `rerenderNode(id)`;
  re-aplica `selectNode`.

### 4.6 Icon picker

- `ICON_REGISTRY` (`treeviewer.js:11-239`): array com ~200 entradas
  no formato `{ name, kw: string[], svg: '<svg…>…</svg>' }`. Cada
  entrada traz palavras-chave em PT e EN (e.g. `'pasta'`,
  `'folder'`, `'ideia'`, `'idea'`, `'luz'`).
- `iconSvg(name, size = 16)` (`treeviewer.js:248`): busca a entrada
  pelo nome; se não encontrar, faz fallback para `'File'`. Injeta
  `width`/`height` no `<svg>` via `replace`.
- `searchIcons(query)` (`treeviewer.js:256`): case-insensitive,
  match em `name` ou em qualquer `kw`. Sem query, retorna tudo.
- `openIconPicker(nodeId, anchorEl)` (`treeviewer.js:1410`): zera
  a busca, chama `renderIconGrid('')`, mostra `#icon-picker`,
  posiciona abaixo do botão. Se a altura do picker
  (`pickerH = 310`) estourar `window.innerHeight`, posiciona acima
  (`rect.top - pickerH - 4`). Ajusta top/left somando
  `window.scrollY`/`window.scrollX`. Foca `#icon-search`.
- `renderIconGrid(query)` (`treeviewer.js:1438`): para cada
  resultado, cria um `<button>` cujo `innerHTML` é o `svg`
  reescrito para 18×18. No click, atualiza `node.iconName`,
  chama `rerenderNode` e `selectNode` no nó alvo, e fecha o
  picker.
- Fechamento por click-fora: `document.addEventListener('mousedown', …)`
  em `treeviewer.js:1987` fecha o picker se o clique for fora dele.
- `closeIconPicker()` (`treeviewer.js:1433`): esconde e limpa
  `_pickerTargetId`.

### 4.7 Modal de anotações

**Estrutura** (em `index.html:369-459`):

- `#notes-overlay` — overlay do modal.
- `#notes-title` — "Anotações: <nome do nó>" (nome truncado a
  40 chars em `openNotesModal`).
- `#notes-preview` (`<div contenteditable>`) — modo visual.
- `#notes-raw` (`<textarea maxlength="4000">`) — modo raw.
- `#notes-counter` — mostra `N / 4000`; vira `--warn` aos 90% e
  `--over` ao chegar no limite (`_updateNotesCounter`,
  `treeviewer.js:1628`).
- Toolbar com botões `.tv-notes-toolbar-btn[data-action="…"]`
  para `normal`, `h1`, `h2`, `h3`, `bold`, `italic`, `ul`, `ol`
  (dispatch em `applyFormat`).
- `#btn-notes-mode` — alterna entre visual e raw
  (`toggleNotesMode`).

**Limite:** `NOTES_MAX = 4000` (`treeviewer.js:1469`). No modo
visual, ao ultrapassar, o último caractere é truncado de forma
não-destrutiva e o cursor vai para o final
(`treeviewer.js:1930`).

**Conversores** (`treeviewer.js:1471-1606`):

- `markdownToHtml(md)` — parser próprio. Escapa HTML antes de
  qualquer inserção (`escHtml`). Suporta headings `#`/`##`/`###`,
  listas `-`/`*` e ordenadas `1.`, parágrafos, `<br>` em linha
  vazia, bold `**`/`__`, italic `*`/`_` e negrito-itálico
  `***`/`___` via `inlineFormat`.
- `htmlToMarkdown(html)` — DOM-based. Cria um `<div>` temporário,
  serializa recursivamente via `nodeToMd` mapeando `h1`-`h3`,
  `strong`/`b`, `em`/`i`, `ul`/`ol`/`li` (com numeração 1./2./…
  para `ol`), `br`, `p`, `div`. Normaliza quebras triplas
  (`\n{3,}` → `\n\n`) e `trimEnd()`.

**Formatação por modo** (`treeviewer.js:1734-1866`):

- `applyFormat(action)` (`treeviewer.js:1869`) despacha:
  - Modo raw → `_applyFormatRaw` (manipula
    `selectionStart`/`selectionEnd` da `#notes-raw`, injeta
    markdown, ajusta cursor).
  - Modo visual → `_applyFormatVisual` (usa `document.execCommand`:
    `bold`, `italic`, `formatBlock` para `h1`/`h2`/`h3`/`p`,
    `insertUnorderedList`, `insertOrderedList`).
- `_getCurrentMarkdown()` (`treeviewer.js:1637`) lê do modo ativo
  (`#notes-raw.value` ou `htmlToMarkdown(#notes-preview.innerHTML)`).
- Ao alternar de visual para raw, o HTML atual é convertido para
  markdown; ao alternar de raw para visual, o markdown é
  renderizado (`toggleNotesMode`, `treeviewer.js:1715`).

### 4.8 Zoom

- `setZoom(z)` (`treeviewer.js:1347`): clampa para
  `[0.5, 2.0]` e arredonda para 1 casa decimal. Em `1.0`, limpa
  `transform`/`width`/`height` do `#canvas` (volta ao layout
  padrão). Em outros valores, aplica
  `transform: scale(state.zoom)` e compensa
  `width`/`height` para `(1 / state.zoom) * 100%` (mantém o
  scroll responsivo).
- Botões `#btn-zoom-in`/`#btn-zoom-out` (`treeviewer.js:1893-1894`)
  ajustam em passos de 0.1. `#btn-zoom-reset` volta a 1.0.
- `#btn-zoom-out` é desabilitado em `zoom <= 0.5`;
  `#btn-zoom-in` em `zoom >= 2.0` (verificado em
  `treeviewer.js:1361-1362`).

### 4.9 Clipboard (com fallback para `file://`)

- `copyCardAsAscii(rootId, btnEl)` (`treeviewer.js:1199`):
  1. Calcula o texto via `treeToAscii(root)`.
  2. Tenta `navigator.clipboard.writeText(text)`.
  3. Em caso de sucesso, troca o `innerHTML` do botão para
     "✓ Copiado" e marca `.tv-copy-btn--ok` por 1.5s.
  4. Em caso de falha (comum em `file://`), faz fallback:
     cria um `<textarea>` com `position: fixed; opacity: 0`,
     seleciona, executa `document.execCommand('copy')`, remove.
     Mesmo feedback visual de 1.5s.
- `treeToAscii(node)` (`treeviewer.js:1179`): serializa usando
  conectores `├──` / `└──` estilo `tree(1)`.

### 4.10 Importação de árvore via ASCII (paste)

Operação **reversa** de `copyCardAsAscii` / `treeToAscii`.

- **Botão na UI:** `.tv-card__paste-btn` (ícone clipboard/paste)
  no `.tv-card__header`, à esquerda de
  `.tv-card__minimize-btn`. Adicionado por esta change
  (`index.html:301`).
- **Popover** (`.tv-card__paste-popover`, template
  `#tpl-paste-popover` em `index.html:321`):
  - Aberto por `openPastePopover(rootId, anchorEl)`
    (`treeviewer.js:1327`). Fecha qualquer popover aberto em
    outro card antes de abrir o novo.
  - Posicionado em `position: absolute` ancorado no botão
    (canto direito, abaixo).
  - Foco inicial no `<textarea>` (`.tv-card__paste-textarea`)
    com placeholder em pt-BR.
  - Botão "Importar" (`.tv-card__paste-import`) começa
    `disabled`; libera ao digitar (handler em
    `_updatePasteImportState`).
  - `Ctrl+Enter` (ou `Cmd+Enter`) também submete.
  - Fechamento: click em "Cancelar" (`closePastePopover`),
    `Escape`, click-fora, ou paste com sucesso.
  - Listener `mousedown` em capture para fechar por
    click-fora; ignora cliques dentro do popover e no botão
    que o abriu (mesma estratégia do icon picker em
    `treeviewer.js:2011`).
- **Parser** `asciiToTree(text)` (`treeviewer.js:1199`):
  - Recebe exatamente o formato produzido por `treeToAscii`.
  - Quebra em linhas, descarta vazias, identifica a primeira
    como raiz (sem conector).
  - Para cada linha subsequente, encontra o primeiro `├── `
    ou `└── `; calcula `depth = pos / 4 + 1`.
  - Mantém pilha `parents[depth - 1] = nodeRef` para anexar
    cada novo nó ao pai certo.
  - Trunca a pilha a cada linha para que siblings
    sucessivos descartem irmãos antigos.
  - `name` é truncado em 512 chars (mesma política de
    `importJSON` em `treeviewer.js:517`).
  - Erros explícitos em pt-BR: texto vazio, primeira linha
    com conector, sem conectores, profundidade inválida
    (múltiplo de 4 ou pula de mais de 1 nível), nome vazio
    após conector.
- **Substituição** `pasteAsciiToCard(rootId, text)`
  (`treeviewer.js:1244`):
  1. Localiza a raiz via `findNode`.
  2. Tenta `asciiToTree(text)` em `try/catch`; em erro,
     `alert('Erro ao colar ASCII: …')` e retorna `false`
     sem alterar estado.
  3. Em sucesso: substitui `name`, `iconName`, `notes`,
     `children`, `expanded`, `minimized` na raiz.
     **`id` é preservado** para não invalidar DnD, foco ou
     minimizar do card.
  4. Recalcula `_idCounter` via `maxId` recursivo (mesma
     função usada por `importJSON` em `treeviewer.js:549`).
  5. Reseta `selectedId`, `editingId`, `editingPrevName`.
  6. `render()` e retorna `true`.
- **Estado de erro:** o parser nunca chama `render`; em
  caso de falha, `state.roots` permanece inalterado.
- **Sem mudanças** em `treeToAscii` / `copyCardAsAscii` /
  `localStorage` / esquema `treeviewer_v1`. O `widthLevel`
  da raiz é preservado pelo paste (não é tocado).

### 4.11 Largura do card (1x / 2x / 3x)

Cada raiz pode ter um `widthLevel ∈ {1, 2, 3}` (default
`1`) mapeado em pixels via `CARD_WIDTH_PX`
(`treeviewer.js:289`): `1→480px`, `2→720px`,
`3→1080px`. Mínimo 480px, máximo 1080px. Cards maiores
quebram linha automaticamente via `flex-wrap: wrap` no
`.tv-canvas` (`treeviewer.css:250`).

- **Modelo:** `widthLevel` no `TreeNode` raiz. Default
  `1` em `createNode` (`treeviewer.js:280`). Persistido
  automaticamente via `saveState`/`loadState` (sem bump
  de `STORAGE_KEY`). Normalizado em
  `normalizeWidthLevel` (`treeviewer.js:286`) e em
  `loadState` (eager, `treeviewer.js:381-389`) e em
  `sanitizeNode` (import).
- **CSS:** `.tv-card` usa `width: var(--width-level, 480px)`
  (`treeviewer.css:312`). O `width` é fixo em pixels,
  dispensando `min-width`/`max-width` no card.
- **Aplicação no `render()`:** cada card recebe
  `card.style.setProperty('--width-level',
    CARD_WIDTH_PX[normalizeWidthLevel(root.widthLevel)] + 'px')`
  antes de ser inserido no canvas.
- **Botão na UI:** `.tv-card__width-btn` (ícone
  sliders) no `.tv-card__header`, à esquerda do
  `tv-card__paste-btn`.
- **Popover** (`.tv-width-popover`, template
  `#tpl-width-popover` em `index.html:357`):
  - Aberto por `openWidthPopover(rootId, anchorEl)`
    (`treeviewer.js:1507`). Fecha qualquer popover
    aberto (paste ou width) antes de abrir o novo.
  - Posicionado em `position: absolute` ancorado no
    botão (canto direito, abaixo).
  - Marca visualmente o nível atual via classe
    `tv-width-popover__option--active` e
    `aria-pressed="true"`.
  - Fechamento: click numa opção, `Escape`, click-fora.
  - Mesmo padrão de listeners do popover de paste
    (`mousedown` em capture, `keydown` para Escape).
- **Aplicação do nível** `setCardWidthLevel(rootId, N)`
  (`treeviewer.js:1592`): se o nível já é o atual,
  apenas fecha o popover; caso contrário define
  `root.widthLevel`, `saveState()`, `closeWidthPopover()`
  e `render()`.
- **Substituição por paste:** `pasteAsciiToCard` não
  toca em `widthLevel` — a largura escolhida pelo
  usuário é preservada.
- **Import:** `sanitizeNode` em `importJSON` valida
  `widthLevel` via `normalizeWidthLevel` e cai para `1`
  se inválido/ausente.

### 4.12 API pública

`window.TreeViewer = { addRoot, exportJSON, importJSON, newProject }`
(`treeviewer.js:1881`). É a única API exposta no escopo global.
A partir do `index.html`, apenas `addRoot` é referenciado
diretamente, no botão do empty state (`index.html:145`,
`onclick="TreeViewer.addRoot()"`). As outras três são
acionadas exclusivamente pelos botões do header
(`treeviewer.js:1888-1891`).
