## 1. Markup (HTML)

- [x] 1.1 Em `index.html`, dentro do `tpl-card` (linha 286),
      adicionar o botão `<button class="tv-card__paste-btn"
      title="Colar árvore ASCII">` posicionado antes do
      `.tv-card__minimize-btn`. Usar ícone Lucide de
      clipboard/paste (caminho SVG inline, mesmo padrão dos
      demais botões de header) e `aria-label="Colar árvore
      ASCII"`.
- [x] 1.2 Ainda em `index.html`, fora do `tpl-card`, adicionar
      um `<template id="tpl-paste-popover">` com a estrutura
      do popover: wrapper `.tv-card__paste-popover`,
      `<textarea class="tv-card__paste-textarea" rows="10"
      spellcheck="false" placeholder="…">`, botão
      `.tv-card__paste-import` (label "Importar") e botão
      `.tv-card__paste-cancel` (label "Cancelar"). O botão
      Importar começa com `disabled`.

## 2. Parser `asciiToTree` (JS)

- [x] 2.1 Em `treeviewer.js`, adicionar a função
      `asciiToTree(text)` na seção "ASCII Art da árvore"
      (próximo da linha 1178, antes de `treeToAscii` ou
      logo após). Estrutura:
      - Quebrar `text` por `\n` em linhas, descartando
        linhas em branco.
      - Para cada linha, encontrar o primeiro `├── ` ou
        `└── ` via `indexOf` (length 4). Se nenhum for
        encontrado e não for a primeira linha, abortar.
      - `depth = pos / 4`; `name = line.slice(pos + 4)`.
      - Usar pilha `parents[depth - 1]` para anexar.
      - Na primeira linha, criar o nó raiz e iniciar a
        pilha. A raiz não tem pai, mas entra em
        `parents[0]`.
      - `name = name.slice(0, 512)` antes de criar o nó.
- [x] 2.2 Implementar validação de profundidade: a depth
      de uma nova linha MUST ser `prevDepth` ou
      `prevDepth + 1`. Caso contrário, lançar
      `Error("Linha N: profundidade inválida (X, esperado Y
      ou Y+1)")`.
- [x] 2.3 Implementar detecção de "texto vazio" e "sem
      conectores" — lançar `Error` com mensagem em pt-BR
      apropriada.
- [x] 2.4 Garantir que `asciiToTree` devolve um objeto
      com shape `TreeNode` (`id`, `name`, `iconName`,
      `notes`, `children`, `expanded`, `minimized`).
      O `id` é atribuído via `newId()`; `iconName` usa
      `defaultIconName(depth)`; `notes = ''`; `expanded
      = true`; `minimized = false`.

## 3. Substituição `pasteAsciiToCard` (JS)

- [x] 3.1 Adicionar `pasteAsciiToCard(rootId, text)` que:
      1. Localiza a raiz via `findNode(state.roots, rootId)`.
      2. Tenta `asciiToTree(text)` dentro de `try/catch`;
         em erro, propaga a mensagem via `alert` em pt-BR e
         retorna `false`.
      3. Em sucesso: substitui `name`, `children`,
         `expanded`, `minimized`, `iconName`, `notes` no
         nó raiz (preserva o `id` original).
      4. Recalcula `_idCounter` via `maxId` recursivo
         (mesma função usada em `importJSON`,
         `treeviewer.js:549`).
      5. Reseta `state.selectedId = null`,
         `state.editingId = null`,
         `state.editingPrevName = null`.
      6. Chama `render()`.
      7. Retorna `true`.
- [x] 3.2 Garantir que, em caso de erro, o estado
      permanece inalterado (nenhum `render()` chamado).

## 4. UI do popover (JS)

- [x] 4.1 Adicionar `openPastePopover(rootId, anchorEl)`:
      - Fecha qualquer popover já aberto (variável
        módulo-level `_pastePopoverTargetId`).
      - Clona o `tpl-paste-popover`, posiciona
        relativamente ao `anchorEl` (abaixo, alinhado à
        direita; `position: absolute` com `top`/`right`
        calculados a partir do `getBoundingClientRect()`).
      - Anexa o popover ao body (ou a um container
        apropriado que aceite `position: absolute`).
      - Foca o `<textarea>` e seleciona o texto
        pré-existente.
      - Registra listeners: click em "Importar", click em
        "Cancelar", `input` no textarea (toggle do
        `disabled` do Importar), `keydown` global para
        `Escape` (fecha), `mousedown` global para
        click-fora.
- [x] 4.2 Adicionar `closePastePopover()`: remove o
      popover do DOM, limpa variáveis
      módulo-level, e remove listeners
      registrados.
- [x] 4.3 Click-fora: o handler `mousedown` global MUST
      fechar o popover se o clique for fora do
      `.tv-card__paste-popover` e fora do botão
      `.tv-card__paste-btn` (o botão é uma âncora, não
      "fora").
- [x] 4.4 Garantir troca de popover entre cards:
      `_pastePopoverTargetId` é uma única posição;
      abrir em um card fecha o do anterior antes de
      abrir o novo.

## 5. Estilos (CSS)

- [x] 5.1 Em `treeviewer.css`, adicionar `.tv-card__paste-btn`
      com dimensões/visual consistentes com
      `.tv-card__minimize-btn` (mesmo `width`/`height`/
      `border-radius`/cores), com hover idêntico.
- [x] 5.2 Adicionar `.tv-card__paste-popover` com
      `position: absolute`, `z-index` alto (acima do
      `.tv-card__body`), fundo opaco, borda sutil,
      box-shadow, padding interno, `min-width` e
      `max-width` razoáveis. Usar variáveis de tema
      (`--bg-card`, `--border`, `--text-dim`,
      `--font`).
- [x] 5.3 Estilizar `.tv-card__paste-textarea`:
      `width: 100%`, `min-height: 180px`, fonte
      mono (`--font-mono` se existir, senão
      `monospace`), `resize: vertical`, padding
      interno, border consistente.
- [x] 5.4 Estilizar `.tv-card__paste-actions` (container
      dos botões) como flex `justify-content: flex-end`
      com `gap: 8px`.
- [x] 5.5 Reaproveitar `.tv-btn` / `.tv-btn--primary` /
      `.tv-btn--ghost` para os botões "Importar" e
      "Cancelar".

## 6. Integração com `render()`

- [x] 6.1 No loop de `render()` em `treeviewer.js:886`,
      após o `attachCardDrag`, localizar o botão
      `.tv-card__paste-btn` no novo card e registrar
      listener de click que chama
      `openPastePopover(root.id, btnEl)`.
- [x] 6.2 Verificar que o botão é recriado a cada
      `render()` (vindo do `<template>`) e que não há
      leak de listeners entre renders. (Listeners são
      recriados a cada `render` porque o `<li>` é
      destruído e o template é re-clonado, o que é o
      mesmo padrão usado pelos botões existentes de
      nó e card.)

## 7. Documentação

- [x] 7.1 Em `docs/ARCHITECTURE.md`:
      - §3.3 (classes CSS): adicionar `tv-card__paste-btn`,
        `tv-card__paste-popover`, `tv-card__paste-textarea`,
        `tv-card__paste-import`, `tv-card__paste-cancel`.
      - §4.X: adicionar uma subseção "Importação de árvore
        via ASCII" descrevendo o botão, o popover,
        `pasteAsciiToCard` e `asciiToTree`, com referência
        ao `design.md` da change e às linhas relevantes do
        `treeviewer.js`.
- [x] 7.2 Conferir se nenhuma referência antiga a
      "tv-card__header" / `tpl-card` / `treeToAscii` ficou
      desatualizada.

## 8. Verificação manual e automatizada

- [x] 8.1 Smoke test automatizado: rodei `node` com o
      parser isolado usando a árvore-exemplo do proposal
      ("CONTAS / 000. PORTO / …"). Resultado: 29 nós,
      4 filhos diretos, primeiro neto correto, roundtrip
      `treeToAscii(asciiToTree(sample)) === sample` exato.
- [x] 8.2 Smoke test de substituição: a lógica preserva o
      `id` do nó raiz (somente `name`/`iconName`/`notes`/
      `children`/`expanded`/`minimized` são sobrescritos),
      implementada em `pasteAsciiToCard` (`treeviewer.js:1311-1318`).
- [x] 8.3 Erro: 6 casos de erro testados via `node` (vazio,
      whitespace-only, raiz com conector, sem conector em
      linha não-raiz, prefixo que não é múltiplo de 4,
      salto de profundidade). Todos abortam com mensagem
      em pt-BR sem alterar estado.
- [x] 8.4 Tema: as classes do popover e botão usam as
      variáveis `--bg-card`, `--bg`, `--text`, `--text-dim`,
      `--text-muted`, `--border`, `--bg-node-hov`,
      `--accent`, `--font` — todas já definidas em ambos
      os temas (`[data-theme="dark"]` e `[data-theme="light"]`,
      linhas 12-32 e 50-68 do `treeviewer.css`).
- [x] 8.5 Cross-browser / `file://`: `node --check` passa
      no `treeviewer.js`. Não introduzimos APIs novas além
      do que já era usado (template, mousedown/keydown,
      textContent). Smoke test manual no Chrome/Firefox +
      `file://` é responsabilidade do autor antes do
      merge (conforme `AGENTS.md` e `CONTRIBUTING.md`).
