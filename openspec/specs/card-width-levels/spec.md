# card-width-levels Specification

## Purpose
TBD - created by archiving change add-card-width-levels. Update Purpose after archive.
## Requirements
### Requirement: Campo widthLevel no TreeNode
O sistema MUST expor, em cada `TreeNode` raiz, um campo
opcional `widthLevel` que aceita apenas os valores `1`,
`2` ou `3`. Quando ausente ou inválido, MUST ser tratado
como `1`.

#### Scenario: Default 1 em raiz nova
- **WHEN** o caller cria uma nova raiz via `createNode`
  (`treeviewer.js:280`)
- **THEN** o nó MUST ter `widthLevel = 1` por padrão.

#### Scenario: Default 1 em raiz sem o campo
- **WHEN** o caller carrega do `localStorage` um nó
  salvo antes desta change (sem `widthLevel`)
- **THEN** o `render()` MUST aplicar o nível `1` (sem
  alterar `state.roots`).

#### Scenario: Valor inválido é ignorado
- **WHEN** `widthLevel` é qualquer valor fora de `{1, 2,
  3}` (e.g. `0`, `4`, `null`, `"2"`)
- **THEN** o `render()` MUST tratá-lo como `1`.

### Requirement: Persistência automática via saveState/loadState
O sistema MUST persistir `widthLevel` no `localStorage`
sem mudança em `STORAGE_KEY`.

#### Scenario: Salvamento
- **WHEN** o caller altera `root.widthLevel` e o ciclo
  de `saveState` ocorre
- **THEN** o valor MUST ser gravado no payload
  `{ roots: state.roots }` (campo `roots[i].widthLevel`).

#### Scenario: Carregamento
- **WHEN** o `loadState` lê o payload e o campo está
  presente
- **THEN** o valor MUST ser restaurado em
  `state.roots[i].widthLevel`.

#### Scenario: Sem bump de STORAGE_KEY
- **WHEN** esta change é aplicada
- **THEN** `STORAGE_KEY` MUST permanecer
  `'treeviewer_v1'` (o campo é opcional e aditivo).

### Requirement: Largura renderizada via CSS
O sistema MUST aplicar a largura renderizada do card
como `var(--width-level, 480px)`, onde `--width-level`
é setado inline com o pixel value correspondente a
`widthLevel` via `CARD_WIDTH_PX` (`treeviewer.js:289`):
`1→480px`, `2→720px`, `3→1080px`.

#### Scenario: Largura 1x
- **WHEN** `root.widthLevel === 1`
- **THEN** o card MUST renderizar com largura igual a
  480px.

#### Scenario: Largura 2x
- **WHEN** `root.widthLevel === 2`
- **THEN** o card MUST renderizar com largura igual a
  720px.

#### Scenario: Largura 3x
- **WHEN** `root.widthLevel === 3`
- **THEN** o card MUST renderizar com largura igual a
  1080px.

#### Scenario: Variável aplicada inline
- **WHEN** o `render()` cria o card
- **THEN** o card MUST ter
  `style.setProperty('--width-level',
    CARD_WIDTH_PX[normalizeWidthLevel(root.widthLevel)] + 'px')`
  e o CSS MUST usar essa variável no `width`.

#### Scenario: Width fixo dispensa min/max
- **WHEN** esta change é aplicada
- **THEN** o `.tv-card` MUST usar `width` fixo via
  `--width-level`, sem `min-width`/`max-width`
  separados (a largura é definida diretamente pela
  variável).

### Requirement: Reflow via flex-wrap
O sistema MUST quebrar a linha automaticamente quando
um card 2x ou 3x não cabe horizontalmente na largura
disponível do canvas, usando apenas o
`flex-wrap: wrap` já presente no `.tv-canvas`
(`treeviewer.css:250`), sem código JS novo.

#### Scenario: Card grande quebra linha
- **WHEN** o canvas tem largura `X` e há cards
  suficientes para que um card `widthLevel=3` não caiba
  na linha atual
- **THEN** esse card MUST ser posicionado na próxima
  linha do `flex-wrap`.

#### Scenario: Cards pequenos podem coexistir
- **WHEN** há espaço na linha para um card `widthLevel=1`
  e o próximo card é `widthLevel=2`
- **THEN** o `widthLevel=2` MUST permanecer na linha
  atual (sem quebra desnecessária).

### Requirement: Import/Export preserva widthLevel
`sanitizeNode` em `importJSON` MUST preservar
`widthLevel` válido.

#### Scenario: Import com widthLevel válido
- **WHEN** o JSON importado contém
  `roots[i].widthLevel: 2`
- **THEN** o nó importado MUST ter `widthLevel = 2`.

#### Scenario: Import com widthLevel inválido
- **WHEN** o JSON importado contém `widthLevel` fora de
  `{1, 2, 3}`
- **THEN** o nó importado MUST ter `widthLevel = 1`
  (default).

#### Scenario: Import sem widthLevel
- **WHEN** o JSON importado omite `widthLevel`
- **THEN** o nó importado MUST ter `widthLevel = 1`
  (default).

### Requirement: Paste ASCII preserva widthLevel
`pasteAsciiToCard` MUST manter o `widthLevel` da raiz
quando faz a substituição (junto com `id` e os demais
campos preservados).

#### Scenario: Paste mantém widthLevel
- **WHEN** o caller cola um ASCII em uma raiz com
  `widthLevel = 2`
- **THEN** após a substituição, a raiz MUST continuar
  com `widthLevel = 2` (inalterado).

