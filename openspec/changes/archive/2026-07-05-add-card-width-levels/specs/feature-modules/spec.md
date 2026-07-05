# feature-modules Specification (delta)

## Purpose
TBD - created by archiving change add-initial-architecture-documentation. Update Purpose after archive.

## ADDED Requirements

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
