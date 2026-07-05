## Why

Os cards de árvore hoje têm largura fixa (`min-width: 240px;
max-width: 600px`, `treeviewer.css:311-312`), o que em telas largas
deixa muito espaço horizontal ocioso e obriga o usuário a rolar
verticalmente. Adicionar **3 níveis discretos de largura por
card** (1x, 2x, 3x da largura base) — escolhidos via popover no
header — dá ao usuário controle fino sem inflar a UI com drag
handles e sem mexer no domínio (que continua sendo discreto, não
contínuo). Como o canvas já é `flex-wrap` (`treeviewer.css:250`),
cards maiores simplesmente empurram vizinhos para a próxima linha
quando não cabem.

## What Changes

- Adicionar campo `widthLevel` (`1 | 2 | 3`, default `1`) ao
  `TreeNode` raiz. Persistido automaticamente em `localStorage`
  via `saveState`/`loadState` (sem bump de `STORAGE_KEY`).
- Adicionar botão `tv-card__width-btn` no `tpl-card` (no
  `.tv-card__header`, **à esquerda** de `tv-card__paste-btn`),
  com ícone de sliders/resize.
- Adicionar template `#tpl-width-popover` (análogo ao
  `#tpl-paste-popover`) com 3 botões grandes: `1x`, `2x`,
  `3x`. O nível atual fica marcado.
- Adicionar `openWidthPopover(rootId, anchorEl)` /
  `closeWidthPopover()` (espelhando os helpers do paste,
  reutilizando o mesmo padrão de click-fora e `Escape`).
- Calcular a largura do card como
  `calc(var(--card-base-width) * var(--width-level, 1))` e
  definir `--card-base-width` no `:root` do CSS com o valor
  atual (240px). `--width-level` é setado inline no
  `.tv-card` durante `render()`.
- Sem mudanças em `treeToAscii` / `copyCardAsAscii` /
  `pasteAsciiToCard` / drag-and-drop / DnD de cards /
  import-export JSON. Cards arrastáveis mantêm a largura
  (a propriedade é do card, não da posição no array).
- Sem novas dependências, sem build, mantém invariante
  `textContent` (nenhum dado novo do usuário chega via
  `innerHTML`).

## Capabilities

### New Capabilities

- `card-width-levels`: modelo (`widthLevel` na raiz,
  default 1, valores 1/2/3), UI (botão no header +
  popover com 3 opções), e o efeito visual (largura
  base × nível aplicado via CSS).

### Modified Capabilities

- `rendering-system`: o spec de rendering-system passa a
  cobrir a nova classe `tv-card--width-1/2/3` (ou o uso
  da variável `--width-level`), o `tv-card__width-btn`,
  o `#tpl-width-popover` e seus elementos internos.
- `feature-modules`: a documentação de feature-modules
  passa a descrever o novo botão e o popover de largura
  no header do card.

## Impact

- **Arquivos modificados:**
  - `index.html` — botão no `tpl-card` + template
    `#tpl-width-popover`.
  - `treeviewer.css` — define `--card-base-width` e
    usa `calc(... * var(--width-level, 1))` em
    `.tv-card`. Estilos para `tv-card__width-btn` e
    `.tv-width-popover-*` (análogo ao paste).
  - `treeviewer.js` — `openWidthPopover` /
    `closeWidthPopover`, listener do botão em
    `render()`, aplica `--width-level` no
    `card.style.setProperty`. Reaproveita os mesmos
    padrões do paste popover (variáveis
    módulo-level, click-fora, Escape, fechamento ao
    escolher opção).
  - `docs/ARCHITECTURE.md` — §3.1 (templates),
    §3.3 (classes), §4.10 (futura renumeração) com
    o novo módulo.
- **Modelo de dados:** novo campo opcional
  `widthLevel`. Raízes antigas sem o campo
  (carregadas de `localStorage` antes desta change)
  tratam como `1` (fallback no parser e no
  `render()`).
- **Sem mudanças em:** esquema `STORAGE_KEY`
  (`treeviewer_v1`), DnD, edição inline, modal de
  notas, icon picker, zoom, persistência além de
  carregar o campo novo automaticamente.
- **Compatibilidade:** projetos salvos antes desta
  change continuam abrindo normalmente (default
  `1`). Projetos salvos depois abrem normalmente em
  browsers mais antigos que ignorem o campo
  desconhecido (caem no default via fallback).
