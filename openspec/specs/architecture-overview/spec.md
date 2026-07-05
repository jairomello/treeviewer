# architecture-overview Specification

## Purpose
TBD - created by archiving change add-initial-architecture-documentation. Update Purpose after archive.
## Requirements
### Requirement: Visão geral dos três arquivos
A documentação MUST descrever o papel de cada um dos três arquivos de
runtime (`index.html`, `treeviewer.css`, `treeviewer.js`), incluindo o
fato de que juntos formam o app inteiro, sem build, sem dependências
externas, e devem funcionar abertos via `file://`.

#### Scenario: Documento lista os três arquivos
- **WHEN** o leitor consulta a seção "Visão geral"
- **THEN** o documento MUST identificar `index.html`,
  `treeviewer.css` e `treeviewer.js` e indicar a função de cada um
  (markup/UI, estilos, lógica).

#### Scenario: Documento cita as referências canônicas
- **WHEN** o leitor procura a fonte do arquivo
- **THEN** o documento MUST referenciar `README.md`, `CONTRIBUTING.md`
  e `AGENTS.md` como documentos de orientação (uso, contribuição,
  agente) e indicar que `ARCHITECTURE.md` os complementa no eixo
  técnico.

### Requirement: Fluxo de bootstrap
A documentação MUST descrever a sequência de inicialização, do
`DOMContentLoaded` até a primeira pintura, com referências ao código
responsável por cada etapa.

#### Scenario: Documento explica a sequência de boot
- **WHEN** o leitor procura "como o app inicia"
- **THEN** o documento MUST listar, na ordem: registro do listener
  `DOMContentLoaded` (final de `treeviewer.js`), chamada a
  `loadState()`, chamada a `render()`, e registro dos listeners de
  UI e teclado.

#### Scenario: Documento aponta para o ponto exato
- **WHEN** o leitor verifica a inicialização
- **THEN** o documento MUST apontar para o listener
  `document.addEventListener('DOMContentLoaded', …)` em
  `treeviewer.js` (próximo da linha 1883).

### Requirement: Camadas lógicas
A documentação MUST descrever as camadas em que `treeviewer.js` está
organizado, com os respectivos banners de seção.

#### Scenario: Documento enumera as camadas
- **WHEN** o leitor consulta a estrutura do código
- **THEN** o documento MUST listar as camadas
  `ICON_REGISTRY`/busca de ícones, `STATE` (modelo em memória),
  helpers de árvore, persistência (localStorage), projeto
  (export/import/novo), DOM helpers, ações da árvore, icon picker,
  modal de anotações, inicialização.
- **AND** MUST indicar que a separação é por banners de comentário
  (`/* ═══ Section ═══ */`), não por módulos ES.

