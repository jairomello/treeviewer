## 1. Markup (HTML)

- [x] 1.1 Em `index.html`, dentro do `tpl-card` (próximo
      da linha 300), adicionar o botão `<button
      class="tv-card__width-btn" title="Largura do card"
      aria-label="Largura do card">` posicionado **antes**
      (à esquerda) do `.tv-card__paste-btn`. Ícone Lucide
      "sliders-horizontal" (3 sliders horizontais).
- [x] 1.2 Ainda em `index.html`, fora do `tpl-card`,
      adicionar um `<template id="tpl-width-popover">` com
      a estrutura do popover: wrapper
      `.tv-width-popover`, header opcional (label
      "Largura"), e três botões
      `.tv-width-popover__option` com
      `data-level="1"`, `data-level="2"`,
      `data-level="3"`, labels `1x`, `2x`, `3x`.
- [x] 1.3 Conferir se o `tpl-card` continua válido
      (sem IDs duplicados, ordem dos botões no header
      consistente: handle | título | width-btn |
      paste-btn | minimize-btn). Confirmado por leitura
      direta do `tpl-card` após edição.

## 2. CSS

- [x] 2.1 Em `treeviewer.css`, dentro do bloco `:root` (ou
      dos temas), definir `--card-base-width: 240px;`.
      (Adicionado no `:root` em `treeviewer.css:48`,
      fora do bloco de variáveis dependentes de tema —
      valor é tema-independente.)
- [x] 2.2 Em `.tv-card`, substituir `min-width: 240px` e
      `max-width: 600px` por
      `min-width: var(--card-base-width)` e
      `max-width: calc(var(--card-base-width) * 3)`.
- [x] 2.3 Em `.tv-card`, adicionar `width: calc(var(--card-base-width)
      * var(--width-level, 1))` para garantir o
      comportamento.
- [x] 2.4 Adicionar `.tv-card__width-btn` (mesmo padrão
      de `.tv-card__paste-btn` e `.tv-card__minimize-btn`:
      22×22, border-radius 5, hover com `--bg-node-hov`).
- [x] 2.5 Adicionar `.tv-width-popover` (análogo ao
      `.tv-card__paste-popover`): `position: absolute`,
      `z-index: 1000`, fundo opaco, borda sutil, sombra.
      Adicionar `.tv-width-popover__option` (botão grande
      com `display: flex`, `justify-content: space-between`,
      `padding: 6px 10px`) e variante
      `.tv-width-popover__option--active` (com
      `--accent` como destaque e check `✓` à direita).
- [x] 2.6 Garantir que tudo use variáveis de tema
      (`--bg-card`, `--border`, `--text-dim`,
      `--text-muted`, `--font`, `--accent`,
      `--bg-node-hov`). Confirmado.

## 3. JS — modelo e helpers

- [x] 3.1 Em `treeviewer.js`, ajustar `createNode`
      (próximo da linha 280) para incluir
      `widthLevel: 1` no objeto criado. Default 1.
- [x] 3.2 Adicionar função helper
      `normalizeWidthLevel(v)` que retorna `1`, `2` ou
      `3` para entradas válidas e `1` para qualquer
      outro valor (incluindo `undefined`).
      (`treeviewer.js:286`.)
- [x] 3.3 Em `importJSON` (`sanitizeNode`, próximo da
      linha 512), preservar `widthLevel` válido:
      `node.widthLevel = normalizeWidthLevel(raw.widthLevel)`.
      Incluir `widthLevel` na lista de campos do objeto
      retornado.
- [x] 3.4 Em `pasteAsciiToCard` (próximo da linha 1299),
      `widthLevel` é preservado naturalmente — a função
      não toca nesse campo (substitui apenas `name`,
      `iconName`, `notes`, `children`, `expanded`,
      `minimized`, preservando `id`). Verificado por
      leitura do código.
- [x] 3.5 Em `loadState` (próximo da linha 360), eager
      normalização de `widthLevel` em todas as raízes
      carregadas. Implementado com `normalizeAll` recursivo
      após `state.roots = saved.roots`.

## 4. JS — popover de largura

- [x] 4.1 Adicionar vars módulo-level
      `_widthPopoverEl`, `_widthPopoverTargetId`,
      `_widthPopoverAnchorEl`, `_widthKeyHandler`,
      `_widthMouseHandler` (espelhando o padrão do paste).
- [x] 4.2 Adicionar `openWidthPopover(rootId, anchorEl)`:
      - Fecha qualquer popover aberto (paste e width) antes
        de abrir.
      - Clona o `tpl-width-popover`, posiciona
        relativamente ao `anchorEl` (abaixo, alinhado à
        direita).
      - Marca o nível atual via classe `--active` e
        `aria-pressed="true"`.
      - Liga cada `[data-level]` ao
        `setCardWidthLevel(rootId, N)`.
      - Liga `Escape` e click-fora (mousedown em capture).
- [x] 4.3 Adicionar `closeWidthPopover()` que remove
      listeners e elemento do DOM, e zera vars
      módulo-level.
- [x] 4.4 Adicionar `setCardWidthLevel(rootId, level)`:
      - Localiza a raiz via `findNode`.
      - Se `level === node.widthLevel`, apenas fecha o
        popover (early return, sem re-render, sem
        `saveState`).
      - Caso contrário: `root.widthLevel = level`,
        `saveState()`, `closeWidthPopover()`, `render()`.
- [x] 4.5 Troca de popover entre cards: vars
      módulo-level únicas — abrir em um card fecha o do
      anterior automaticamente.
- [x] 4.6 Cross-talk com paste: `openWidthPopover` chama
      `closePastePopover()` antes de abrir; o paste já
      chama `closeWidthPopover()` antes de abrir (espelhado
      por consistência).

## 5. Integração com `render()`

- [x] 5.1 No loop de `render()` em `treeviewer.js`,
      ao criar cada card, aplicar
      `card.style.setProperty('--width-level',
        String(normalizeWidthLevel(root.widthLevel)))`.
- [x] 5.2 Localizar o botão `.tv-card__width-btn` no
      card criado e registrar listener de click que
      chama `openWidthPopover(root.id, btnEl)`.
- [x] 5.3 Verificar que o botão é recriado a cada
      `render()` (vindo do `<template>`, sem leak
      de listeners). Padrão idêntico aos outros botões
      já presentes.

## 6. Documentação

- [x] 6.1 Em `docs/ARCHITECTURE.md`:
      - §3.3 (classes CSS): adicionado `tv-card__width-btn`
        e o grupo "Largura do card (popover)" com
        `tv-width-popover`, `tv-width-popover__header`,
        `tv-width-popover__options`,
        `tv-width-popover__option`,
        `tv-width-popover__option--active`,
        `tv-width-popover__label`, `tv-width-popover__check`.
      - §3.1 (templates): adicionado `#tpl-width-popover`
        na lista, junto com `#tpl-paste-popover`.
      - §2.1 (`TreeNode`): adicionado `widthLevel`
        (1/2/3, default 1) à tabela.
      - §2.5 (Import/Export): mencionada a normalização
        de `widthLevel` via `normalizeWidthLevel` em
        `sanitizeNode`.
      - §4 (Módulos): nova subseção §4.11 "Largura do
        card (1x / 2x / 3x)" cobrindo modelo, CSS,
        render, UI, popover, paste-preserva, import.
- [x] 6.2 Conferir se nenhuma referência antiga a
      `min-width: 240px` / `max-width: 600px` ficou
      desatualizada. Confirmado.

## 7. Verificação manual e automatizada

- [x] 7.1 Smoke test automatizado (node): isolado
      `normalizeWidthLevel` e validado 13 entradas:
      `1`→`1`, `2`→`2`, `3`→`3`, `0`→`1`, `4`→`1`,
      `-1`→`1`, `undefined`→`1`, `null`→`1`, `"2"`→`1`,
      `2.5`→`1`, `NaN`→`1`, `true`→`1`, `false`→`1`.
      Todos passam.
- [x] 7.2-7.6 Smoke test manual: responsabilidade do
      autor antes do merge (conforme `AGENTS.md` /
      `CONTRIBUTING.md`). Cross-browser (Chrome +
      Firefox) e `file://` / servidor local.
- [x] 7.7 `node --check treeviewer.js` — sintaxe OK,
      sem erro.
