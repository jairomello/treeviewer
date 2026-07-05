## Context

- **Estado atual:** três arquivos de runtime (`index.html`,
  `treeviewer.css`, `treeviewer.js`) formam um app estático, sem
  build, sem dependências, que precisa rodar via `file://`. O
  repositório contém AGENTS.md (orientação para agentes),
  README/CONTRIBUTING/SECURITY (orientação ao usuário e ao
  contribuidor) e `THIRD_PARTY_NOTICES` (atribuições de ícones).
  **Não há** nenhum documento que descreva a arquitetura interna.
- **Stakeholders:** contribuidores humanos (onboarding, revisão de
  PR) e agentes OpenCode (precisam de referência para evitar
  inventar APIs que não existem ou quebrar invariantes como a
  regra `textContent` / `innerHTML`).
- **Restrições:** zero dependências; nenhum build step; nenhum
  runner de teste/lint/typecheck; toda a UI em pt-BR. Estas
  restrições estão consolidadas em `AGENTS.md` e em
  `CONTRIBUTING.md` e devem ser refletidas na doc.
- **Motivação:** o `treeviewer.js` tem 2088 linhas em um único
  módulo strict; sem um mapa de alto nível, novos colaboradores
  gastam tempo descobrindo onde cada feature vive.

## Goals / Non-Goals

**Goals:**

- Produzir `docs/ARCHITECTURE.md` como **única referência técnica
  inicial**, escrita a partir de leitura direta do código atual
  (não de intenção).
- Cobrir os 4 capabilities definidos no `proposal.md`
  (`architecture-overview`, `data-model`, `rendering-system`,
  `feature-modules`).
- Cada afirmação substantiva aponta para **uma âncora concreta**
  no código (`arquivo:linha`, identificador de função, classe
  CSS, ou ID do DOM) para permitir verificação rápida.
- Manter tom descritivo (e não prescritivo): o doc diz "como o
  sistema se comporta hoje", não "como deveria se comportar".

**Non-Goals:**

- Não introduzir mudanças em runtime, dependências, ou
  configuração de projeto.
- Não reescrever ou remover `README.md`, `CONTRIBUTING.md`,
  `SECURITY.md`, `THIRD_PARTY_NOTICES` ou `AGENTS.md`.
- Não propor refatorações. Onde o código tem decisões
  questionáveis (ex.: clone de botões a cada abertura de modal,
  `document.execCommand` no editor visual), o doc apenas
  registra o comportamento — não sugere trocar.
- Não cobrir internacionalização ou acessibilidade além do
  mínimo já presente (`aria-label` em botões de ícone, `kbd` em
  atalhos); isso pertence a outros docs se virar prioridade.
- Não incluir tutoriais de uso (papel do `README.md`).

## Decisions

- **Formato do documento: Markdown único em `docs/ARCHITECTURE.md`.**
  - **Por quê:** o projeto não usa geradores de doc (Docusaurus,
    MkDocs). Um `.md` renderizado no GitHub é suficiente e mantém
    zero-dep.
  - **Alternativa considerada:** dividir em vários arquivos
    (um por capability). Descartada — sobre-engenharia para um
    doc inicial; um arquivo único com `## Seções` claras é
    navegável e grep-friendly.
- **Granularidade: apontar para `arquivo:linha` em vez de colar
  trechos grandes.**
  - **Por quê:** o código é a verdade; trechos colados
    envelhecem rápido. Âncoras como `treeviewer.js:1205`
    permitem ao leitor pular direto ao código.
  - **Alternativa considerada:** copiar funções inteiras.
    Descartada — duplica fonte da verdade e ocupa espaço.
- **Capítulos alinhados com os 4 capabilities do `proposal.md`.**
  - **Por quê:** garante cobertura 1:1 entre o que o proposal
    promete e o que o doc entrega. Cada capítulo do doc cita
    explicitamente qual capability está cobrindo.
  - **Alternativa considerada:** topologia alternativa
    (e.g., separar "core" de "features"). Descartada — sobrepõe
    os capabilities e dificulta o tracking.
- **Manter terminologia em inglês para identificadores e pt-BR
  para prosa descritiva.** Consistente com `AGENTS.md`.
- **Listar IDs e classes em vez de descrevê-los prosaicamente.**
  Quando uma feature depende de um ID (`#icon-picker`,
  `#notes-overlay`), o doc diz "id=" e o nome. Isso vira um
  índice implícito.

## Risks / Trade-offs

- **Risco: o doc fica desatualizado quando o código evoluir.**
  → Mitigação: a doc é puramente descritiva e cada referência
  aponta para `arquivo:linha`. A próxima mudança que tocar o
  código tem incentivo a atualizar a âncora correspondente.
  Nenhuma doc está no CI (não há CI); a revisão é manual.
- **Risco: a doc inclui afirmações imprecisas por erro de
  leitura do código.** → Mitigação: cross-check manual de
  cada `arquivo:linha` citado; revisão do autor antes do
  merge; manter escopo ao que foi lido e nada mais.
- **Risco: o doc cresce sem governança e vira "outra fonte de
  verdade" divergente do código.** → Mitigação: deixar claro no
  próprio doc que ele é derivado (e não autoritativo) e que o
  código prevalece em caso de divergência.
- **Trade-off: nenhum teste para a doc.** Sem CI, sem linter de
  doc, sem link-check. Aceito — escopo do change é baixo e o
  custo de introduzir um link-checker não se justifica dado o
  "zero-dep" do projeto.
- **Trade-off: nenhum PR template atualizado para mencionar
  `docs/ARCHITECTURE.md`.** Aceito — fora do escopo deste
  change. Pode ser tema de change futuro.

## Migration Plan

Não aplicável: nenhuma migração de comportamento, dado, build ou
deploy. A doc é puramente aditiva.

## Open Questions

- _Devemos renomear o diretório `docs/` para algo mais explícito
  (e.g., `docs/architecture/`)?_ Decisão deferida — manter
  plano. Caso novos docs surjam, isso pode voltar à mesa.
- _A doc deve listar funções exportadas em
  `window.TreeViewer` (`addRoot`, `exportJSON`, `importJSON`,
  `newProject`)?_ Sim, como nota curta em "feature-modules" —
  é a única API pública exposta pelo app.
