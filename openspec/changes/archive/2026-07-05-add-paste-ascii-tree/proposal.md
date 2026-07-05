## Why

O TreeViewer já consegue **exportar** uma árvore como ASCII art
(`treeToAscii` + `copyCardAsAscii`, `treeviewer.js:1179` /
`treeviewer.js:1199`), mas não consegue **importar** uma árvore
descrita no mesmo formato. Quem recebe o ASCII por chat, e-mail ou
arquivo precisa reconstruí-la manualmente nó a nó. Adicionar o
caminho inverso (colar ASCII → substituir árvore do card) fecha o
loop e aproveita o formato que o próprio app já produz.

## What Changes

- Adicionar um botão "Colar ASCII" (`tv-card__paste-btn`) no
  `tpl-card` (`index.html:286`), posicionado no
  `.tv-card__header` **à esquerda** do `.tv-card__minimize-btn`
  (lado direito, junto do recolher).
- Adicionar um popover suspenso (`.tv-card__paste-popover`)
  ancorado no botão, contendo um `<textarea>` de altura fixa
  (estilo "campo de busca expansível") e dois botões: "Importar"
  e "Cancelar".
- Implementar o parser reverso `asciiToTree(text)` em
  `treeviewer.js`, capaz de reconstruir uma árvore no formato
  produzido por `treeToAscii` (conectores `├── ` / `└── `,
  prefixo `│   ` / `    ` por nível).
- Implementar `pasteAsciiToCard(rootId, text)` que substitui a
  raiz correspondente em `state.roots` pelos nós parseados,
  recalcula `_idCounter`, limpa seleção/edição e chama `render()`.
- Tratar erros de parsing (texto vazio, sem conectores,
  profundidade inválida) com `alert` em pt-BR — consistente com
  `importJSON` (`treeviewer.js:560`).
- Estilizar o botão e o popover em `treeviewer.css`, com prefixo
  `tv-` (consistente com o resto do app).
- Sem mudança em `treeToAscii`/`copyCardAsAscii` — eles
  continuam produzindo exatamente o formato que o parser
  consome.

## Capabilities

### New Capabilities

- `ascii-import`: capacidade de colar texto ASCII (formato
  `tree(1)`-compatível produzido por `treeToAscii`) e
  reconstruir uma árvore a partir dele, incluindo o algoritmo
  de parsing, validação, edge cases (texto vazio, profundidade
  inválida, prefixo malformado) e a API de substituição do nó
  raiz.
- `paste-popover-ui`: popover suspenso com `<textarea>` e
  botões "Importar"/"Cancelar", ancorado em um novo botão no
  header do card. Cobre a abertura, fechamento por click-fora,
  fechamento por Cancelar/Enter, e os estados visuais
  (aberto, com texto, durante submit).

### Modified Capabilities

- `feature-modules`: o spec de feature-modules passa a listar
  o novo botão "Colar ASCII" no `.tv-card__header` e descreve
  `pasteAsciiToCard` como operação reversa de
  `copyCardAsAscii`.

## Impact

- **Arquivos modificados:**
  - `index.html` — adiciona o botão no `tpl-card` e, se
    necessário, um template para o popover.
  - `treeviewer.css` — adiciona estilos para
    `.tv-card__paste-btn`, `.tv-card__paste-popover` e
    variantes (hover, ativo, posicionamento).
  - `treeviewer.js` — adiciona `asciiToTree`,
    `pasteAsciiToCard`, `openPastePopover`/`closePastePopover`,
    e o listener de click-fora. Liga o botão em
    `treeviewer.js:886` (loop de `render`).
  - `docs/ARCHITECTURE.md` — atualiza §3.3 (classes CSS),
    §4.10 (fluxos funcionais) com o novo módulo.
- **Código:** mantém o invariante `textContent` para nomes
  importados (o `name` chega do textarea via `value`, vai para
  `textContent` ao renderizar). Sem novas dependências.
- **Sem mudanças em:** `treeToAscii`, `copyCardAsAscii`,
  `ICON_REGISTRY`, persistência (`localStorage`), API
  `window.TreeViewer`, esquema de storage (`treeviewer_v1`).
- **Compatibilidade:** árvores existentes (já em
  `localStorage`) continuam funcionando — a feature de paste é
  opt-in (botão explícito).
