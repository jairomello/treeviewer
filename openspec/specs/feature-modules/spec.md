# feature-modules Specification

## Purpose
TBD - created by archiving change add-initial-architecture-documentation. Update Purpose after archive.
## Requirements
### Requirement: Atalhos de teclado
A documentação MUST listar todos os atalhos implementados no handler
global de `keydown` e os casos especiais (modo de edição aberto,
modal aberta, picker aberto).

#### Scenario: Documento lista os atalhos
- **WHEN** o leitor consulta "quais teclas estão mapeadas"
- **THEN** o documento MUST listar: `F2` (renomear), `Insert`
  (filho ou nova raiz), `Delete` (remover), `↑`/`↓` (navegar
  visíveis), `Alt+↑`/`Alt+↓` (mover entre irmãos), `Alt+←`/
  `Alt+→` (promover/rebaixar), `→` (expandir ou ir para o
  primeiro filho), `←` (recolher ou ir para o pai), `Enter`
  (confirma edição inline), `Escape` (cancela edição ou fecha
  picker), e MUST observar que `Ctrl+B`/`Ctrl+I` funcionam
  dentro da modal de anotações.

#### Scenario: Documento cita os pontos onde cada atalho é tratado
- **WHEN** o leitor verifica o handler
- **THEN** o documento MUST apontar para o `switch (e.key)` em
  `treeviewer.js` (próximo da linha 2015) e MUST indicar as
  guardas: modal de notas aberta (saí), picker aberto (só
  `Escape` é tratado), input/textarea externo focado (saí).

### Requirement: Drag-and-drop de nós
A documentação MUST descrever o DnD de nós internos e a proteção
contra loops.

#### Scenario: Documento explica o DnD de nós
- **WHEN** o leitor consulta "como nós são arrastados"
- **THEN** o documento MUST descrever o uso de `dataTransfer`
  com `text/plain` carregando o `id`, o cálculo de posição
  (`before`/`after` baseado na metade do `li`), o uso de
  `.tv-drop-indicator` e a trava anti-ciclo via
  `isAncestor(dragId, nodeId)`.

#### Scenario: Documento distingue do DnD de cards
- **WHEN** o leitor consulta "como reordenar raízes"
- **THEN** o documento MUST indicar que o DnD de cards usa o
  prefixo `CARD_DRAG_PREFIX = 'card:'` no `dataTransfer`,
  controlado por `attachCardDrag`, e MUST explicar que os
  dois fluxos são mutuamente exclusivos (cards ignoram
  drags de nós e vice-versa).

### Requirement: Indentação
A documentação MUST descrever `indentIn`/`indentOut` e suas
pré-condições.

#### Scenario: Documento explica promover
- **WHEN** o leitor consulta `Alt+←`
- **THEN** o documento MUST descrever que o nó deixa de ser
  filho do pai e vira irmão do pai (inserido logo abaixo na
  lista do avô), e MUST observar que é no-op se o nó já é
  raiz.

#### Scenario: Documento explica rebaixar
- **WHEN** o leitor consulta `Alt+→`
- **THEN** o documento MUST descrever que o nó vira filho do
  irmão imediatamente acima, e MUST observar que é no-op se
  não há irmão acima e que o novo pai é expandido
  automaticamente.

### Requirement: Edição inline
A documentação MUST descrever `startEditing`/`commitEditing`/
`cancelEditing`.

#### Scenario: Documento explica o ciclo de edição
- **WHEN** o leitor consulta "como o nome é editado"
- **THEN** o documento MUST descrever a substituição de
  `.tv-node-name` por um `<input class="tv-node-name-input">`,
  o tratamento de `Enter` (commit), `Escape` (cancel) e
  `blur` (commit com delay), e MUST observar que
  `state.editingPrevName` guarda o nome anterior para
  cancelamento.

### Requirement: Icon picker
A documentação MUST descrever `ICON_REGISTRY`, a busca, o
posicionamento e a aplicação do ícone.

#### Scenario: Documento descreve o registry
- **WHEN** o leitor consulta "onde estão os ícones"
- **THEN** o documento MUST apontar para `ICON_REGISTRY` em
  `treeviewer.js` (linhas 11–239) e MUST explicar a forma
  `{ name, kw: [...], svg: '<svg…>…</svg>' }`, com palavras-
  chave em PT e EN.

#### Scenario: Documento descreve a busca e o posicionamento
- **WHEN** o leitor consulta "como o picker funciona"
- **THEN** o documento MUST descrever `searchIcons` (case-
  insensitive, `name` + `kw`), o ancoramento do picker
  abaixo do botão (com fallback para cima se não couber na
  viewport), o uso de `requestAnimationFrame` implícito via
  `rerenderNode` no callback de seleção, e o fechamento por
  click-fora via listener global de `mousedown`.

### Requirement: Modal de anotações
A documentação MUST descrever a estrutura do modal, os dois
modos (visual/raw), os conversores e o limite.

#### Scenario: Documento descreve a estrutura
- **WHEN** o leitor consulta "o que é o modal de notas"
- **THEN** o documento MUST identificar os elementos:
  `#notes-overlay`, `#notes-title`, `#notes-preview`
  (contenteditable, modo visual), `#notes-raw` (`<textarea>`,
  modo raw), `#notes-counter`, toolbar com
  `[data-action="normal|h1|h2|h3|bold|italic|ul|ol"]` e
  `#btn-notes-mode` (alternar visual/raw), e MUST indicar
  `NOTES_MAX = 4000`.

#### Scenario: Documento descreve os conversores
- **WHEN** o leitor consulta "como markdown é renderizado"
- **THEN** o documento MUST descrever `markdownToHtml`
  (parser próprio, escapa HTML, suporta `#`/`##`/`###`,
  listas `-`/`*` e ordenadas, bold `**`/`__`, italic
  `*`/`_`, negrito-itálico `***`/`___`) e `htmlToMarkdown`
  (DOM-based, recursivo sobre `tmp.childNodes`,
  remove quebras triplas).

#### Scenario: Documento descreve a formatação por modo
- **WHEN** o leitor consulta "como a toolbar aplica formatação"
- **THEN** o documento MUST explicar `applyFormat` despacha
  para `_applyFormatVisual` (`document.execCommand`) ou
  `_applyFormatRaw` (manipula `selectionStart`/`selectionEnd`
  e injeta markdown), e MUST observar que `_getCurrentMarkdown`
  lê de acordo com `_notesMode`.

### Requirement: Zoom
A documentação MUST descrever `setZoom` e o invariante do range.

#### Scenario: Documento explica o zoom
- **WHEN** o leitor consulta "como o zoom funciona"
- **THEN** o documento MUST descrever que `setZoom(z)` clampa
  para `[0.5, 2.0]` com passo de 0.1, aplica `transform: scale`
  no `#canvas` e compensa largura/altura para o scroll
  continuar responsivo, e MUST indicar que os botões
  `#btn-zoom-in`/`#btn-zoom-out` são desabilitados nos
  extremos e que `#btn-zoom-reset` volta a 1.0.

### Requirement: Clipboard com fallback para file://
A documentação MUST descrever a estratégia usada em
`copyCardAsAscii` para contornar `navigator.clipboard`
indisponível em `file://`.

#### Scenario: Documento explica o fallback
- **WHEN** o leitor consulta "como a cópia ASCII funciona"
- **THEN** o documento MUST descrever que
  `navigator.clipboard.writeText` é tentado primeiro; em caso
  de falha, MUST indicar que um `<textarea>` é criado
  off-screen (`position: fixed; opacity: 0`), selecionado,
  copiado via `document.execCommand('copy')` e removido, e
  MUST observar o feedback visual "Copiado" (1.5s) em ambos
  os caminhos.

### Requirement: API pública window.TreeViewer
A documentação MUST listar os métodos expostos em
`window.TreeViewer`.

#### Scenario: Documento lista a API
- **WHEN** o leitor consulta "qual API o app expõe"
- **THEN** o documento MUST listar `addRoot`, `exportJSON`,
  `importJSON` e `newProject` (atribuição em
  `treeviewer.js` próximo da linha 1881) e MUST observar
  que `addRoot` é a única usada a partir do HTML (botão
  no empty state).

### Requirement: Importação de árvore via ASCII (paste)
A documentação MUST descrever o botão "Colar ASCII" no
header do card, o popover, e a função
`pasteAsciiToCard` como operação reversa de
`copyCardAsAscii`.

#### Scenario: Documento lista o botão
- **WHEN** o leitor consulta "quais botões estão no
  header do card"
- **THEN** o documento MUST listar o botão "Colar ASCII"
  (classe `tv-card__paste-btn`), mencionando sua posição
  à esquerda do botão minimizar e o ícone de paste/clipboard.

#### Scenario: Documento descreve o popover
- **WHEN** o leitor consulta "o que acontece ao clicar em
  Colar ASCII"
- **THEN** o documento MUST descrever a estrutura do
  popover (textarea, botões "Importar"/"Cancelar"), o
  fechamento por click-fora/Escape/Cancelar, e o foco
  automático no textarea.

#### Scenario: Documento explica o reverso de copy
- **WHEN** o leitor consulta "qual a operação inversa de
  copiar ASCII"
- **THEN** o documento MUST indicar `pasteAsciiToCard`
  com `asciiToTree` como parser reverso de `treeToAscii`,
  descrevendo o formato esperado (conectores `├── ` /
  `└── `, prefixo `│   ` / `    ` por nível) e os casos
  de erro tratados (texto vazio, sem conectores,
  profundidade inválida, conectores unicode alternativos).

### Requirement: Largura de card via popover
A documentação MUST descrever o botão "Largura" no
header do card, o popover com `1x`/`2x`/`3x`, e a
função `setCardWidthLevel` (ou equivalente) que aplica
o nível.

#### Scenario: Documento lista o botão
- **WHEN** o leitor consulta "quais botões estão no
  header do card"
- **THEN** o documento MUST listar o botão "Largura"
  (classe `tv-card__width-btn`), mencionando sua
  posição à esquerda do botão paste e o ícone de
  sliders/resize.

#### Scenario: Documento descreve o popover
- **WHEN** o leitor consulta "como o usuário escolhe a
  largura do card"
- **THEN** o documento MUST descrever a estrutura do
  popover (3 opções `1x`/`2x`/`3x`), o fechamento por
  click-fora/Escape, e a marcação visual do nível
  atual via `aria-pressed` e
  `tv-width-popover__option--active`.

#### Scenario: Documento explica o efeito
- **WHEN** o leitor consulta "qual a relação entre o
  nível e a largura renderizada"
- **THEN** o documento MUST indicar que a largura
  renderizada é
  `calc(var(--card-base-width) * var(--width-level, 1))`,
  e MUST explicar que `widthLevel` persiste por raiz
  no `localStorage` (campo opcional, sem bump de
  `STORAGE_KEY`).

