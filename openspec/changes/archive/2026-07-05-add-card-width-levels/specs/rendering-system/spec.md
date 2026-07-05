# rendering-system Specification (delta)

## Purpose
TBD - created by archiving change add-initial-architecture-documentation. Update Purpose after archive.

## ADDED Requirements

### Requirement: Variável CSS de largura por card
A documentação MUST descrever a nova variável CSS
`--width-level` aplicada inline em cada `.tv-card` e a
variável `--card-base-width` no `:root`.

#### Scenario: Documento explica o cálculo de largura
- **WHEN** o leitor consulta "como a largura do card é
  calculada"
- **THEN** o documento MUST descrever que a largura
  renderizada é
  `calc(var(--card-base-width) * var(--width-level, 1))`,
  MUST indicar o valor atual de `--card-base-width`
  (240px) e MUST explicar que `--width-level` é setado
  inline pelo `render()` a partir de
  `root.widthLevel` (default 1).

#### Scenario: Documento lista as classes do popover
- **WHEN** o leitor consulta "quais classes novas foram
  adicionadas"
- **THEN** o documento MUST listar `tv-card__width-btn`,
  `tv-width-popover`, `tv-width-popover__option` e
  `tv-width-popover__option--active`.

#### Scenario: Documento explica o max-width
- **WHEN** o leitor consulta "qual é o `max-width` do
  card"
- **THEN** o documento MUST indicar que `max-width` é
  ≥ `calc(var(--card-base-width) * 3)` (ex.: 720px),
  garantindo que um card 3x não seja clipado.

### Requirement: Reflow via flex-wrap
A documentação MUST confirmar que cards maiores
quebram linha automaticamente via `flex-wrap: wrap`
no `.tv-canvas` (`treeviewer.css:250`).

#### Scenario: Documento explica o reflow
- **WHEN** o leitor consulta "o que acontece quando
  cards maiores não cabem"
- **THEN** o documento MUST indicar que o canvas
  é `display: flex; flex-wrap: wrap; gap: 20px` e
  MUST explicar que a quebra é puramente CSS, sem
  código JS de grid.
