## Context

- O app já exporta árvores no formato `tree(1)` ASCII via
  `treeToAscii` (`treeviewer.js:1179`) + `copyCardAsAscii`
  (`treeviewer.js:1199`). O output usa conectores `├── ` /
  `└── ` e prefixo `│   ` / `    ` por nível.
- Não há parser inverso. Quem recebe o texto precisa reconstruir
  manualmente.
- O header de cada card (`tpl-card`, `index.html:286`) tem
  handle de drag, título e botão minimizar. O botão "Copiar"
  atual fica **dentro** do `.tv-card__body` (injetado em
  `treeviewer.js:854`).
- O app é zero-dep, pt-BR, sem build, sem testes. Tudo tem que
  funcionar via `file://` (ver `AGENTS.md`).
- Estilos existentes relevantes: `.tv-card__header` (flex,
  `min-height: 28px`, gap 6px), `.tv-card__title` (`flex: 1`,
  ellipsis), `.tv-card__minimize-btn` (botão do recolher).

## Goals / Non-Goals

**Goals:**

- Implementar o caminho inverso de `treeToAscii`:
  ASCII → `TreeNode`.
- UI: botão "Colar ASCII" no header do card, à esquerda do
  botão minimizar; popover com `<textarea>` + "Importar" +
  "Cancelar".
- Substituir a raiz correspondente em `state.roots` (a raiz do
  card clicado), recalcular `_idCounter`, limpar
  seleção/edição, renderizar.
- Tratar erros de parsing com `alert` em pt-BR.
- Cobrir o formato exato produzido por `treeToAscii`. ASCII
  produzido por outras ferramentas (e.g. `tree(1)` com `--charset unicode`)
  pode não ser suportado — fora de escopo.

**Non-Goals:**

- Não modificar `treeToAscii` nem o formato ASCII existente.
- Não adicionar suporte a múltiplas raízes por paste (uma raiz
  por paste, na raiz do card clicado).
- Não implementar undo/redo do paste.
- Não criar modal fullscreen — popover local é suficiente.
- Não cobrir internacionalização da mensagem de erro além de
  pt-BR.
- Não tentar normalizar conectores unicode diferentes
  (`+--`/`\`--`); se não bate com `├──`/`└──`, falha com erro.

## Decisions

- **Parser em uma única passada, orientado a pilha de pais.**
  - **Por quê:** o output de `treeToAscii` é estritamente
    árvore: nunca pula profundidade, sempre cresce em 1 ou
    recua. Uma pilha `parents[depth] = nodeRef` permite
    anexar cada novo nó ao pai correto em O(1) por linha.
  - **Alternativa considerada:** recursão com regex linha a
    linha descartada — descartada por adicionar parsing
    redundante.

- **Detecção de profundidade = `prefix.length / 4`.**
  - **Por quê:** `treeToAscii` usa sempre blocos de 4 chars
    (`│   `, `    `, `    │   `, etc.). A posição do conector
    `├── ` ou `└── ` na linha, dividida por 4, dá a depth.
  - **Alternativa considerada:** contar `│` e espaços
    separadamente — descartada, mais frágil.

- **Substituição por raiz: limpar `state.roots` no índice e
  reinserir o nó parseado, mantendo o `id` original do card
  quando possível.**
  - **Por quê:** o botão "Copiar" do próprio card já opera
    sobre a raiz. Paste deve atingir **aquela** raiz, não
    outra. Manter o `id` minimiza churn (DnD, foco,
    minimizar).
  - **Alternativa considerada:** criar uma nova raiz e
    removê-la se a anterior existir — descartada, perderia
    o id e referências.

- **Popover ancorado, não modal fullscreen.**
  - **Por quê:** UX — paste é uma operação local ao card, não
    precisa bloquear o resto. Click-fora fecha, consistente
    com o icon picker (`treeviewer.js:1987`).
  - **Alternativa considerada:** modal genérico (como o de
    notas). Descartada — peso excessivo para um `<textarea>`.

- **`<textarea>` em vez de `contenteditable`.**
  - **Por quê:** entrada é texto cru, sem formatação. O
    `<textarea>` tem `value` confiável, sem HTML interpolado,
    e respeita o invariante `textContent` (não precisa
    `innerHTML`).
  - **Alternativa considerada:** `contenteditable` — descartada
    para manter consistência com o input da modal de notas em
    modo raw (`#notes-raw`).

- **Posicionamento: `position: absolute` ancorado no botão,
  canto inferior direito alinhado ao botão.**
  - **Por quê:** segue o padrão de "search field expansível"
    que o usuário mencionou; mantém contexto visual (o usuário
    sabe a qual card pertence).
  - **Sem lógica de inversão vertical** na v1: se faltar
    viewport abaixo, scroll da página resolve. Pode virar
    enhancement.

- **Sanitização dos `name` parseados.**
  - **Por quê:** o `name` pode ter `<script>` colado
    propositalmente. Garantir `textContent` ao renderizar é
    papel do pipeline existente; ainda assim, o parser **não
    deve** limitar tamanho do nome durante paste (a fonte
    pode ter nomes grandes e arbitrários). O limite
    `node.name.slice(0, 512)` aplicado em `importJSON`
    (`treeviewer.js:517`) **é replicado** no paste por
    consistência.

## Risks / Trade-offs

- **Risco: ASCII com tabs em vez de espaços** (vindo de outra
  ferramenta) → parser falha. → Mitigação: mensagem de erro
  clara em pt-BR indicando o problema; usuário pode
  converter manualmente. Documentar o formato esperado
  implicitamente no placeholder do `<textarea>`.

- **Risco: usuário cola um texto que parece árvore mas tem
  profundidade malformada** (pula de depth 0 para 2). → O
  parser detecta e aborta com `alert`.

- **Risco: regressão no botão "Copiar"** (que também usa
  header/body) se a estrutura for mexida. → Mudança isolada:
  novo botão entra no `tpl-card` **antes** do
  `.tv-card__minimize-btn`; copy-btn continua no body.

- **Risco: click-fora do popover dispara durante drag de
  card.** → O listener usa `mousedown` (consistente com o
  icon picker) e o card já tem listeners próprios de drag;
  testaremos e, se necessário, adicionamos guarda de
  `e.target.closest('.tv-card__drag-handle')`.

- **Trade-off: popover sem trap de foco.** Usuário pode
  perder foco sem fechar explicitamente. Aceito — UX de
  paste, não de criação de conteúdo; click-fora cobre o
  caso comum.

- **Trade-off: paste não pede confirmação antes de
  substituir.** O texto é uma intenção explícita. Aceito
  pelo mesmo motivo de `treeToAscii`/`copyCardAsAscii` não
  pedir confirmação antes de sobrescrever o clipboard.

## Migration Plan

Não aplicável. Sem migração de schema, dado, build ou
deploy. Feature puramente aditiva.

## Open Questions

- _Devemos tentar auto-detectar conectores unicode
  alternativos (`+--`, `\`--`)?_ Não na v1. Adiar até
  aparecer demanda.
- _O popover deve ser fechável com `Escape`?_ Sim — cobrir
  com listener `keydown` (consistente com o icon picker em
  `treeviewer.js:2011`). Vai como requirement explícito.
- _O botão "Importar" deve ser desabilitado enquanto o
  textarea está vazio?_ Sim — feedback visual, evita clicks
  em estado inválido.
