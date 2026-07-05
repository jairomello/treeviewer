# feature-modules Specification (delta)

## Purpose
TBD - created by archiving change add-initial-architecture-documentation. Update Purpose after archive.

## ADDED Requirements

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
