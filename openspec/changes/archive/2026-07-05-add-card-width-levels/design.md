## Context

- O canvas usa `display: flex; flex-wrap: wrap; gap: 20px`
  (`treeviewer.css:248-252`). Cards maiores quebram linha
  automaticamente — não precisamos escrever lógica de grid.
- O card tem `min-width: 240px; max-width: 600px` e nenhum
  controle por árvore (`treeviewer.css:311-312`).
- O header tem hoje: handle de drag, título, botão paste
  (recém-adicionado), botão minimizar. Já é denso — o
  novo botão precisa ser pequeno e visualmente discreto.
- Já existe um popover no app (paste) com o mesmo padrão
  (clone de `<template>`, posicionado absolutamente, click-
  fora em capture, `Escape` para fechar). Reaproveitar a
  estratégia reduz código e mantém consistência.
- A persistência é automática: `saveState` serializa
  `state.roots` inteiro. Adicionar `widthLevel` no
  `TreeNode` não exige mudança em `saveState`/`loadState`.
- O user decidiu: popover, labels `1x`/`2x`/`3x`, base
  atual mantida.

## Goals / Non-Goals

**Goals:**

- Cada raiz pode ter `widthLevel ∈ {1, 2, 3}` (default 1).
- Largura renderizada =
  `calc(var(--card-base-width) * var(--width-level, 1))`.
- Botão no header abre popover com 3 opções grandes; opção
  atual fica marcada; click aplica e fecha.
- Persiste por projeto em `localStorage` no payload
  existente.
- Sem mudanças em DnD, paste, copy, edição, import/export,
  atalhos.

**Non-Goals:**

- Não oferecer drag handle de resize (descartado na
  discussão com o usuário).
- Não oferecer níveis intermediários (1.5x, etc.) — domínio
  é discreto por design.
- Não aplicar largura por subnó — só por raiz.
- Não alterar o `gap` ou outras regras do grid.
- Não resetar `widthLevel` ao mover o card de posição.

## Decisions

- **Campo `widthLevel` no `TreeNode`, default 1.**
  - **Por quê:** mantém a forma plana da raiz; serializa
    direto; é trivial no JSON import/export.
  - **Alternativa:** `state.cardWidths = Map<id, 1|2|3>`
    separada. Descartada — adiciona estrutura paralela e
    complica import/export.

- **CSS via custom property `--width-level`, setada inline
  em `render()`.**
  - **Por quê:** evita 3 classes (`tv-card--width-1/2/3`) e
    permite o cálculo `calc(... * var(--width-level, 1))`
    numa única regra.
  - **Alternativa:** 3 classes modificadoras. Descartada —
    mais código, mesmo resultado.

- **`--card-base-width: 240px` em `:root`, removendo
  `min-width` rígido e ajustando `max-width` para
  `calc(var(--card-base-width) * 3)` (ou 720px).**
  - **Por quê:** garante coerência: `max-width` em
    `treeviewer.css:312` precisa ser ≥ 3× base, ou um
    card 3x seria clipado.
  - **Alternativa:** manter `min-width` e `max-width` em
    px e calcular `width` em JS. Descartada — CSS-only é
    mais limpo.

- **Reaproveitar o padrão do paste popover**
  (`openWidthPopover`/`closeWidthPopover`, vars
  módulo-level, click-fora em `capture`, listener de
  `Escape`).
  - **Por quê:** consistência, menos código, validação
    empírica no paste.
  - **Alternativa:** criar uma abstração genérica de
    popover. Descartada — sobre-engenharia para 2
    consumidores; pode ser feito em change futuro se
    aparecer um 3º.

- **Botão no header com ícone Lucide "sliders-horizontal"
  (3 linhas de tamanhos diferentes).**
  - **Por quê:** comunica "ajuste de tamanho" sem texto.
    Consistente com paste (ícone de clipboard) e minimizar
    (ícone `−`/`+`).
  - **Alternativa:** texto "Largura". Descartada — header
    já está cheio; texto em botão pequeno é ruidoso.

- **Popover com 3 botões grandes em coluna, opção atual
  marcada com check (✓) e `aria-pressed="true"`.**
  - **Por quê:** o usuário pediu labels `1x`/`2x`/`3x` —
    texto é a forma mais clara. Botões em coluna vertical
    evitam ambiguidade horizontal em touch.
  - **Alternativa:** 3 botões em linha horizontal.
    Descartada — em touch fica apertado; em desktop o
    paste já estabeleceu "menu suspenso vertical".

- **Mínimo = base, máximo = 3× base.**
  Aplicado via CSS. Não há clamp no JS porque o domínio
  é fixo (1, 2, 3).

- **Fallback para `widthLevel` ausente/inválido:**
  tratar como `1` no `render()` e no popover (marcando
  `1x` como ativo).
  - **Por quê:** projetos salvos antes desta change não
    têm o campo; entrada manual em JSON inválido não
    pode quebrar a renderização.

## Risks / Trade-offs

- **Risco: 3x base = 720px pode estourar telas estreitas
  em monitor pequeno.** → Mitigação: o canvas já é
  `flex-wrap: wrap`; o card quebra linha sozinho. Em
  viewport muito estreita (mobile), o card simplesmente
  ocupa toda a largura. Aceito.

- **Risco: 3 cards 3x lado a lado em monitor widescreen
  ficam visualmente "pesados".** → Aceito — é escolha do
  usuário via popover. Estado persiste, fácil reverter.

- **Risco: popover interfere com click-fora do paste
  (cross-talk).** → Mitigação: o `closeWidthPopover` é
  acionado por `mousedown` em capture, idêntico ao
  paste; a flag módulo-level garante que apenas o
  popover atual está aberto de cada vez (mesma
  estratégia).

- **Risco: o novo campo no `TreeNode` pode "vazar" no
  JSON export/import e quebrar compatibilidade.** →
  Mitigação: `importJSON` (`treeviewer.js:512`) já
  sanitiza para os campos conhecidos via
  `sanitizeNode`. Vamos adicionar `widthLevel` à lista
  de campos preservados, com fallback para `1`.

- **Trade-off: ao contrário do `copyCardAsAscii`, este
  popover altera a estrutura do `state.roots` e
  `saveState` será chamado.** Comportamento desejado:
  escolha de largura é persistente. Sem confirmação
  (escolha explícita do usuário).

## Migration Plan

Não aplicável. Campo opcional com default — nenhum
dado existente precisa ser migrado.

## Open Questions

- _Ícone do botão: "sliders-horizontal" (3 sliders) ou
  "columns-2"/"columns-3" (colunas)?_ "sliders-horizontal"
  comunica melhor "ajuste". Decidir durante
  implementação.
- _Devemos também suportar `widthLevel` em níveis não-
  raiz (subnós)?_ Não na v1 — decisão explícita do
  usuário, e a feature de paste ASCII já cobre a v1
  do escopo de nível de raiz.
- _Devemos aplicar `--width-level` em `.tv-canvas` ou em
  `.tv-card`?_ Em `.tv-card` (cada card é independente).
  Confirmado.
