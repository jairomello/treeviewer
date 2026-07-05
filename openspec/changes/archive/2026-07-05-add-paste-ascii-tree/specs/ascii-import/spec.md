## ADDED Requirements

### Requirement: Parser ASCII → TreeNode
O sistema MUST expor uma função `asciiToTree(text)` que recebe
o output textual de `treeToAscii` e devolve um `TreeNode`
equivalente ao original (mesma estrutura, mesmos `name`).

#### Scenario: Parser reconstrói uma árvore simples
- **WHEN** o caller passa o output de `treeToAscii({ name:
  'A', children: [{ name: 'B', children: [] }] })`
- **THEN** `asciiToTree` MUST retornar um nó com `name: 'A'`
  e `children: [{ name: 'B', children: [] }]`.

#### Scenario: Parser reconstrói profundidade arbitrária
- **WHEN** o caller passa um texto com 4+ níveis de
  profundidade (conectores `├── ` / `└── ` aninhados e prefixos
  `│   ` / `    ` por nível)
- **THEN** `asciiToTree` MUST reconstruir a hierarquia com a
  mesma profundidade.

#### Scenario: Parser é guiado por pilha de pais
- **WHEN** o parser percorre as linhas
- **THEN** o algoritmo MUST manter uma pilha
  `parents[depth] = nodeRef` e MUST anexar cada novo nó a
  `parents[depth - 1]`.

### Requirement: Detecção de profundidade por prefixo
O parser MUST calcular a profundidade de uma linha como
`posicao_do_conector / 4`, onde o conector é a primeira
ocorrência de `├── ` ou `└── ` na linha.

#### Scenario: Profundidade 0 (raiz)
- **WHEN** a linha não tem prefixo (conector na posição 0,
  ex.: `CONTAS`)
- **THEN** a profundidade MUST ser `0`.

#### Scenario: Profundidade 1
- **WHEN** a linha começa com `├── ` ou `└── ` na posição 0
  (4 chars antes do nome)
- **THEN** a profundidade MUST ser `1`.

#### Scenario: Profundidade 2+
- **WHEN** a linha tem prefixo `│   ├── ` (8 chars antes do
  nome)
- **THEN** a profundidade MUST ser `2`.

### Requirement: Validação de formato
O parser MUST abortar com erro explícito (mensagem em pt-BR)
se o input for inválido.

#### Scenario: Texto vazio ou só whitespace
- **WHEN** o caller passa string vazia ou só espaços/quebras
- **THEN** `asciiToTree` MUST lançar/retornar erro com
  mensagem contendo a palavra "vazio".

#### Scenario: Texto sem conectores
- **WHEN** o caller passa texto que não contém `├── ` nem
  `└── ` em nenhuma linha
- **THEN** `asciiToTree` MUST abortar com mensagem
  indicando que o formato não é reconhecido.

#### Scenario: Profundidade malformada
- **WHEN** a profundidade observada em uma linha não é igual à
  profundidade da linha anterior nem igual a essa + 1
- **THEN** `asciiToTree` MUST abortar com mensagem
  indicando linha e profundidade inválida.

#### Scenario: Conectores unicode alternativos
- **WHEN** o texto usa `+--`, `\--` ou outros conectores
  (sem ser `├── ` / `└── `)
- **THEN** `asciiToTree` MUST abortar com mensagem
  indicando que apenas o formato produzido pelo próprio app
  é suportado.

### Requirement: Substituição do nó raiz
O sistema MUST expor `pasteAsciiToCard(rootId, text)` que
substitui a raiz correspondente em `state.roots` pela árvore
parseada.

#### Scenario: Substituição com sucesso
- **WHEN** o caller passa `rootId` válido e texto ASCII
  válido
- **THEN** `state.roots[i]` (onde `roots[i].id === rootId`)
  MUST ter `name`, `children`, `expanded`, `minimized`,
  `notes`, `iconName` substituídos pelo nó parseado (o
  `id` original da raiz é preservado para não invalidar
  referências externas como o card de drag).

#### Scenario: Substituição recalcula _idCounter
- **WHEN** a substituição ocorre
- **THEN** `_idCounter` MUST ser recalculado via `maxId`
  recursivo sobre a nova árvore, análogo a
  `importJSON` (`treeviewer.js:549`).

#### Scenario: Substituição limpa seleção e edição
- **WHEN** a substituição ocorre
- **THEN** `state.selectedId`, `state.editingId` e
  `state.editingPrevName` MUST ser resetados para
  `null`/`null`/`null`.

#### Scenario: Substituição dispara render
- **WHEN** a substituição ocorre
- **THEN** `render()` MUST ser chamado e o canvas MUST
  refletir a nova árvore.

#### Scenario: Erro de parsing não altera estado
- **WHEN** o parser aborta
- **THEN** `state.roots` MUST permanecer inalterado, nenhum
  `render()` MUST ser chamado, e o caller MUST receber o
  erro para exibir `alert` em pt-BR.

### Requirement: Sanitização dos nomes importados
Os `name` parseados MUST ser truncados em 512 caracteres
antes de virarem `TreeNode.name`, análogo a `importJSON`
(`treeviewer.js:517`).

#### Scenario: Nome longo é truncado
- **WHEN** uma linha do ASCII tem mais de 512 caracteres no
  `name`
- **THEN** o `name` resultante MUST ter no máximo 512
  caracteres.
