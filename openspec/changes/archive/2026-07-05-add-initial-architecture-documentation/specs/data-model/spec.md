## ADDED Requirements

### Requirement: Shape do TreeNode
A documentação MUST descrever a estrutura de um `TreeNode` no estado
em memória, com tipo e semântica de cada campo.

#### Scenario: Documento lista os campos
- **WHEN** o leitor consulta "o que é um nó"
- **THEN** o documento MUST listar `id` (string, formato
  `n<counter>_<rand>`), `name` (string), `iconName` (string,
  presente em `ICON_REGISTRY`), `notes` (string markdown, até
  4000 caracteres), `children` (array de `TreeNode`), `expanded`
  (boolean) e `minimized` (boolean, aplicável apenas a raízes).

#### Scenario: Documento aponta para a fonte
- **WHEN** o leitor verifica a forma canônica
- **THEN** o documento MUST apontar para `createNode` em
  `treeviewer.js` (linha ~280) como o construtor usado.

### Requirement: Objeto state global
A documentação MUST descrever o objeto `state` exportado como
`let state` no topo de `treeviewer.js`.

#### Scenario: Documento lista os campos de state
- **WHEN** o leitor consulta "qual é a raiz do estado"
- **THEN** o documento MUST listar `roots` (array de `TreeNode`),
  `selectedId`, `editingId`, `editingPrevName`, `zoom` (0.5 a 2.0)
  e `theme` (`'dark'` ou `'light'`).

### Requirement: Chave de armazenamento
A documentação MUST descrever `STORAGE_KEY` e o payload gravado em
`localStorage`.

#### Scenario: Documento cita a chave
- **WHEN** o leitor consulta "onde o estado é persistido"
- **THEN** o documento MUST indicar `STORAGE_KEY = 'treeviewer_v1'`
  em `treeviewer.js` (linha ~348) e MUST explicar que a chave só
  deve ser bumpada (`_v2`) em mudança de schema incompatível.

#### Scenario: Documento descreve o payload
- **WHEN** o leitor consulta o que é serializado
- **THEN** o documento MUST listar os campos gravados: `roots`,
  `zoom`, `theme` (vide `saveState` em `treeviewer.js`).

### Requirement: Geração de identificadores
A documentação MUST descrever `newId()` e a invariante de
`_idCounter`.

#### Scenario: Documento explica o formato de ID
- **WHEN** o leitor consulta "como IDs são gerados"
- **THEN** o documento MUST indicar que o ID é
  `'n' + ++_idCounter + '_' + Math.random().toString(36).slice(2,7)`
  e MUST explicar que `_idCounter` é recalculado em `loadState` e
  após `importJSON` (via `maxId` recursivo) para evitar colisões
  com nós importados.

### Requirement: Formato de import/export JSON
A documentação MUST descrever o formato JSON usado por
`exportJSON`/`importJSON` e a sanitização aplicada na importação.

#### Scenario: Documento descreve o payload de export
- **WHEN** o leitor consulta "o que é exportado"
- **THEN** o documento MUST indicar que o JSON contém
  `{ roots: [...] }` e que o nome de arquivo sugerido é
  `YYYY-MM-DD-<nome-da-primeira-raive>`.

#### Scenario: Documento descreve a sanitização
- **WHEN** o leitor consulta "o que acontece na importação"
- **THEN** o documento MUST listar as defesas em `importJSON`
  (`treeviewer.js`, função `sanitizeNode`): uso de
  `Object.create(null)` transitório, validação de `iconName`
  contra `ICON_REGISTRY`, defaults explícitos para `expanded` e
  `minimized`, truncamento de `name` (512), `notes` (4000) e
  `id` (64), recálculo de `_idCounter`, e alerta em caso de
  payload inválido.
