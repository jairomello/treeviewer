/* ══════════════════════════════════════════════════════════════════
   TreeViewer — JavaScript puro (sem dependências externas)
   ══════════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────────
   ICON REGISTRY  (~200 ícones Lucide inline como SVG strings)
   keywords PT/EN para busca
   ─────────────────────────────────────────────────────────────────*/
const ICON_REGISTRY = [
  // ── Arquivos e pastas ──
  { name:'FolderOpen',     kw:['pasta','folder','diretório','directory','aberta','open'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/></svg>' },
  { name:'Folder',         kw:['pasta','folder','diretório','directory'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>' },
  { name:'File',           kw:['arquivo','file','documento'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><polyline points="14 2 14 8 20 8"/></svg>' },
  { name:'FileText',       kw:['arquivo','file','texto','text','documento','document'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>' },
  { name:'FileCode',       kw:['arquivo','file','código','code','programação'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><polyline points="14 2 14 8 20 8"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg>' },
  { name:'Archive',        kw:['arquivo','archive','compacto','zip','guardar'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>' },

  // ── Ideias e brainstorm ──
  { name:'Lightbulb',      kw:['ideia','idea','luz','sugestão','inspiração','criativo'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>' },
  { name:'Brain',          kw:['cérebro','brain','mente','mind','inteligência','pensar'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>' },
  { name:'Sparkles',       kw:['brilho','sparkles','magia','criativo','creative','destaque'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>' },
  { name:'Zap',            kw:['raio','zap','lightning','rápido','fast','energia'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>' },
  { name:'Rocket',         kw:['foguete','rocket','lançar','launch','startup','crescimento'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>' },
  { name:'Flame',          kw:['fogo','flame','fire','trending','popular','destaque'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>' },

  // ── Metas e planejamento ──
  { name:'Target',         kw:['meta','objetivo','target','goal','alvo','foco'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>' },
  { name:'Flag',           kw:['bandeira','flag','marco','milestone','objetivo','goal'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>' },
  { name:'Map',            kw:['mapa','map','plano','plan','rota','route'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>' },
  { name:'Compass',        kw:['bússola','compass','direção','direction'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>' },
  { name:'ClipboardList',  kw:['lista','list','clipboard','tarefas','tasks','checklist'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><line x1="12" x2="16" y1="11" y2="11"/><line x1="12" x2="16" y1="16" y2="16"/><line x1="8" x2="8.01" y1="11" y2="11"/><line x1="8" x2="8.01" y1="16" y2="16"/></svg>' },
  { name:'CheckCircle',    kw:['check','aprovado','done','concluído','completed','ok'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>' },
  { name:'Circle',         kw:['círculo','circle','item','ponto'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>' },
  { name:'Dot',            kw:['ponto','dot','item','folha','leaf','pequeno'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12.1" cy="12.1" r="1"/></svg>' },

  // ── Tecnologia ──
  { name:'Code',           kw:['código','code','programação','programming','dev'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>' },
  { name:'Terminal',       kw:['terminal','console','cmd','shell'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>' },
  { name:'Database',       kw:['banco de dados','database','db','dados','data','storage'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>' },
  { name:'Server',         kw:['servidor','server','backend','infra','host'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>' },
  { name:'Globe',          kw:['globo','globe','web','internet','site','mundo'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>' },
  { name:'Cloud',          kw:['nuvem','cloud','armazenamento','storage','aws'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>' },
  { name:'Smartphone',     kw:['smartphone','celular','mobile','phone','app'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>' },
  { name:'Laptop',         kw:['laptop','notebook','computador','computer'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>' },
  { name:'Package',        kw:['pacote','package','módulo','module','componente','component'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>' },
  { name:'GitBranch',      kw:['git','branch','ramificação','versão','version','código'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>' },
  { name:'Bug',            kw:['bug','erro','error','falha','problema','issue'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 21c0-2.1 1.7-3.9 4-4"/><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/><path d="M22 13h-4"/><path d="M17 17c2.3.1 4 1.9 4 4"/></svg>' },
  { name:'Settings',       kw:['configuração','settings','config','ajuste','preferências'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>' },
  { name:'Lock',           kw:['cadeado','lock','segurança','security','privado'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>' },
  { name:'Key',            kw:['chave','key','senha','password','acesso','access'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>' },
  { name:'Shield',         kw:['escudo','shield','segurança','security','proteção'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>' },

  // ── Pessoas ──
  { name:'User',           kw:['usuário','user','pessoa','person','conta','account'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' },
  { name:'Users',          kw:['usuários','users','pessoas','people','time','team','grupo'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { name:'Crown',          kw:['coroa','crown','admin','líder','leader','rei'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>' },
  { name:'Award',          kw:['prêmio','award','conquista','achievement','troféu'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>' },
  { name:'Handshake',      kw:['aperto de mão','handshake','parceria','acordo','deal'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>' },

  // ── Comunicação ──
  { name:'MessageSquare',  kw:['mensagem','message','chat','conversa','comment'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
  { name:'Mail',           kw:['email','mail','mensagem','message','carta'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>' },
  { name:'Bell',           kw:['notificação','notification','alerta','alert','sino'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>' },
  { name:'Share2',         kw:['compartilhar','share','rede social','social','enviar'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>' },
  { name:'Phone',          kw:['telefone','phone','ligar','call','contato'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' },

  // ── Negócios ──
  { name:'Building2',      kw:['prédio','building','empresa','company','escritório','office'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>' },
  { name:'Briefcase',      kw:['pasta','briefcase','trabalho','work','negócio','business'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>' },
  { name:'DollarSign',     kw:['dólar','dollar','dinheiro','money','preço','custo'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  { name:'TrendingUp',     kw:['crescimento','growth','tendência','trend','aumento'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>' },
  { name:'BarChart2',      kw:['gráfico','chart','barras','bar','análise','analytics'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>' },
  { name:'PieChart',       kw:['gráfico','chart','pizza','pie','proporção','percent'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>' },
  { name:'ShoppingCart',   kw:['carrinho','cart','compra','shopping','e-commerce'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>' },
  { name:'Tag',            kw:['tag','etiqueta','label','categoria','category'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>' },

  // ── Design ──
  { name:'Palette',        kw:['paleta','palette','cores','colors','design','arte'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>' },
  { name:'Pencil',         kw:['lápis','pencil','escrever','write','editar','edit'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>' },
  { name:'Image',          kw:['imagem','image','foto','photo','figura','picture'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>' },
  { name:'Layers',         kw:['camadas','layers','design','stack'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>' },

  // ── Ações ──
  { name:'Plus',           kw:['mais','plus','adicionar','add','novo','new','criar'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>' },
  { name:'Trash2',         kw:['lixo','trash','deletar','delete','remover','remove'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>' },
  { name:'Search',         kw:['busca','search','pesquisa','find','lupa','procurar'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' },
  { name:'Download',       kw:['baixar','download','salvar','save','exportar'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>' },
  { name:'Upload',         kw:['enviar','upload','importar','import','subir'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>' },
  { name:'Copy',           kw:['copiar','copy','duplicar','duplicate','clonar'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>' },
  { name:'RefreshCw',      kw:['atualizar','refresh','reload','sincronizar','sync'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>' },
  { name:'ZoomIn',         kw:['zoom','ampliar','increase','maior','big'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>' },

  // ── Estrutura e hierarquia ──
  { name:'Network',        kw:['rede','network','árvore','tree','hierarquia','hierarchy'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-4h14v4"/><path d="M12 12V8"/></svg>' },
  { name:'Workflow',       kw:['workflow','fluxo','processo','process','pipeline'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>' },
  { name:'Blocks',         kw:['blocos','blocks','estrutura','structure','construção'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="14.5" y="1.5" rx="1"/><path d="M3 7.1v4.8C3 13 4 14 5.1 14H10"/><path d="M7 3H5.1C4 3 3 4 3 5.1"/><path d="M14.5 16.5H10a1 1 0 0 0-1 1V21"/><rect width="7" height="7" x="1.5" y="14.5" rx="1"/></svg>' },
  { name:'Sitemap',        kw:['sitemap','mapa','hierarquia','hierarchy','estrutura','organograma'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h2a2 2 0 0 0 2-2V3"/><path d="M21 7h-2a2 2 0 0 1-2-2V3"/><path d="M3 17h2a2 2 0 0 1 2 2v2"/><path d="M21 17h-2a2 2 0 0 0-2 2v2"/><path d="M12 3v2"/><path d="M12 19v2"/><path d="M5 12H3"/><path d="M21 12h-2"/><path d="M12 12h.01"/></svg>' },

  // ── Natureza ──
  { name:'Star',           kw:['estrela','star','favorito','favorite','importante','destaque'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { name:'Heart',          kw:['coração','heart','amor','love','favorito','curtir'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>' },
  { name:'Sun',            kw:['sol','sun','dia','day','claro','light','brilhante'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>' },
  { name:'Moon',           kw:['lua','moon','noite','night','escuro','dark'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>' },
  { name:'Leaf',           kw:['folha','leaf','natureza','nature','verde','eco'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>' },
  { name:'Sprout',         kw:['broto','sprout','crescimento','growth','novo','inicio'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>' },

  // ── Tempo e data ──
  { name:'Clock',          kw:['relógio','clock','tempo','time','hora'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
  { name:'Calendar',       kw:['calendário','calendar','data','date','agendamento'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>' },
  { name:'Timer',          kw:['timer','cronômetro','tempo','time','contagem'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>' },

  // ── Alertas ──
  { name:'AlertCircle',    kw:['alerta','alert','atenção','warning','erro','error'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>' },
  { name:'AlertTriangle',  kw:['alerta','alert','aviso','warning','cuidado','danger'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>' },
  { name:'Info',           kw:['informação','info','ajuda','help','detalhe'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' },
  { name:'HelpCircle',     kw:['ajuda','help','dúvida','question','suporte'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>' },

  // ── Localização ──
  { name:'Home',           kw:['casa','home','início','start','principal','main'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { name:'MapPin',         kw:['pin','local','location','ponto','mapa','map'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' },

  // ── Educação ──
  { name:'BookOpen',       kw:['livro','book','leitura','reading','conhecimento','knowledge'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>' },
  { name:'GraduationCap',  kw:['formatura','graduation','educação','education','aprendizado'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>' },
  { name:'Microscope',     kw:['microscópio','microscope','ciência','science','pesquisa','research'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/></svg>' },

  // ── Miscelânea ──
  { name:'Box',            kw:['caixa','box','container','embalagem','módulo','item'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>' },
  { name:'Puzzle',         kw:['puzzle','quebra-cabeça','peça','part','integração'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-3.408 0l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02z"/></svg>' },
  { name:'Bookmark',       kw:['marcador','bookmark','favorito','favorite','salvar'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>' },
  { name:'StickyNote',     kw:['nota','sticky note','lembrete','reminder','post-it'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"/><path d="M15 3v4a2 2 0 0 0 2 2h4"/></svg>' },
  { name:'Eye',            kw:['olho','eye','ver','view','visível','visible'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>' },
  { name:'Gauge',          kw:['gauge','medidor','performance','velocidade','speed'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>' },
  { name:'Fingerprint',    kw:['biometria','fingerprint','identidade','identity','segurança'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/></svg>' },
  { name:'Infinity',       kw:['infinito','infinity','loop','eterno','ciclo','cycle'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/></svg>' },
  { name:'Link',           kw:['link','url','conexão','connection','referência'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>' },
  { name:'Power',          kw:['poder','power','ligar','desligar','on','off','energia'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/></svg>' },
  { name:'ThumbsUp',       kw:['like','curtir','aprovação','approval','positivo'],
    svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/></svg>' },
];

/* ── Ícone padrão por profundidade ────────────────────────────── */
function defaultIconName(depth) {
  const map = ['FolderOpen','Folder','FileText','File','Dot'];
  return map[Math.min(depth, map.length - 1)];
}

/* ── SVG de um ícone pelo nome ────────────────────────────────── */
function iconSvg(name, size = 16) {
  const entry = ICON_REGISTRY.find(e => e.name === name);
  if (!entry) return iconSvg('File', size);
  // Adiciona width/height ao SVG
  return entry.svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
}

/* ── Busca de ícones ──────────────────────────────────────────── */
function searchIcons(query) {
  const q = query.toLowerCase().trim();
  if (!q) return ICON_REGISTRY;
  return ICON_REGISTRY.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.kw.some(k => k.toLowerCase().includes(q))
  );
}

/* ═══════════════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════════════ */
let state = {
  roots: [],          // Array de TreeNode
  selectedId: null,
  editingId: null,
  editingPrevName: null,
  zoom: 1.0,
  theme: 'dark',
};

let _idCounter = 0;
function newId() { return 'n' + (++_idCounter) + '_' + Math.random().toString(36).slice(2,7); }

function createNode(name, depth) {
  return { id: newId(), name, iconName: defaultIconName(depth), notes: '', children: [], expanded: true };
}

/* ── Helpers de árvore ──────────────────────────────────────── */
function findNode(nodes, id) {
  for (const n of nodes) {
    if (n.id === id) return n;
    const f = findNode(n.children, id);
    if (f) return f;
  }
  return null;
}

function findParentList(roots, id) {
  // Retorna o array que contém o nó com esse id
  function search(list) {
    for (const n of list) {
      if (n.id === id) return list;
      const f = search(n.children);
      if (f) return f;
    }
    return null;
  }
  return search(roots);
}

function findParentNode(roots, id) {
  function search(list, parent) {
    for (const n of list) {
      if (n.id === id) return parent;
      const f = search(n.children, n);
      if (f !== undefined) return f;
    }
    return undefined;
  }
  return search(roots, null);
}

function getDepth(roots, id, d = 0) {
  for (const n of roots) {
    if (n.id === id) return d;
    const f = getDepth(n.children, id, d + 1);
    if (f >= 0) return f;
  }
  return -1;
}

function flattenVisible(nodes) {
  const result = [];
  for (const n of nodes) {
    result.push(n.id);
    if (n.expanded && n.children.length > 0) {
      result.push(...flattenVisible(n.children));
    }
  }
  return result;
}

function countAll(nodes) {
  let c = 0;
  for (const n of nodes) { c += 1 + countAll(n.children); }
  return c;
}

/* ═══════════════════════════════════════════════════════════════
   PERSISTÊNCIA — localStorage
   ═══════════════════════════════════════════════════════════════ */
const STORAGE_KEY = 'treeviewer_v1';

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      roots: state.roots,
      zoom: state.zoom,
      theme: state.theme,
    }));
  } catch(e) { /* quota exceeded — ignora */ }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.roots)  state.roots  = saved.roots;
    if (saved.zoom)   state.zoom   = saved.zoom;
    if (saved.theme)  state.theme  = saved.theme;
    // Recalcula _idCounter para evitar colisões
    function maxId(nodes) {
      let m = 0;
      for (const n of nodes) {
        const num = parseInt(n.id.split('_')[0].slice(1));
        if (!isNaN(num) && num > m) m = num;
        m = Math.max(m, maxId(n.children));
      }
      return m;
    }
    _idCounter = maxId(state.roots);
  } catch(e) { /* JSON inválido — ignora */ }
}

/* ═══════════════════════════════════════════════════════════════
   PROJETO — Exportar / Importar JSON / Novo Projeto
   ═══════════════════════════════════════════════════════════════ */

/* ── Modal de confirmação reutilizável ──────────────────────── */
function showConfirm(title, message, onOk) {
  const overlay = document.getElementById('confirm-overlay');
  document.getElementById('confirm-title').textContent   = title;
  document.getElementById('confirm-message').textContent = message;
  overlay.style.display = 'flex';

  // Remove listeners anteriores clonando os botões
  const okBtn  = document.getElementById('btn-confirm-ok');
  const cancel = document.getElementById('btn-confirm-cancel');
  const close  = document.getElementById('btn-close-confirm');

  const newOk     = okBtn.cloneNode(true);
  const newCancel = cancel.cloneNode(true);
  const newClose  = close.cloneNode(true);
  okBtn.replaceWith(newOk);
  cancel.replaceWith(newCancel);
  close.replaceWith(newClose);

  function dismiss() { overlay.style.display = 'none'; }

  newOk.addEventListener('click',     () => { dismiss(); onOk(); });
  newCancel.addEventListener('click', dismiss);
  newClose.addEventListener('click',  dismiss);
  overlay.addEventListener('click', e => { if (e.target === overlay) dismiss(); }, { once: true });
}

/* ── Modal de prompt (pede nome do arquivo) ─────────────────── */
function showPrompt(title, label, defaultValue, onOk) {
  const overlay = document.getElementById('prompt-overlay');
  document.getElementById('prompt-title').textContent = title;
  document.getElementById('prompt-label').textContent = label;
  const input = document.getElementById('prompt-input');
  input.value = defaultValue;
  overlay.style.display = 'flex';
  setTimeout(() => { input.focus(); input.select(); }, 50);

  const okBtn  = document.getElementById('btn-prompt-ok');
  const cancel = document.getElementById('btn-prompt-cancel');
  const close  = document.getElementById('btn-close-prompt');

  const newOk     = okBtn.cloneNode(true);
  const newCancel = cancel.cloneNode(true);
  const newClose  = close.cloneNode(true);
  okBtn.replaceWith(newOk);
  cancel.replaceWith(newCancel);
  close.replaceWith(newClose);

  function dismiss() { overlay.style.display = 'none'; }

  function confirm() {
    const val = document.getElementById('prompt-input').value.trim();
    if (!val) return;
    dismiss();
    onOk(val);
  }

  newOk.addEventListener('click', confirm);
  newCancel.addEventListener('click', dismiss);
  newClose.addEventListener('click',  dismiss);
  overlay.addEventListener('click', e => { if (e.target === overlay) dismiss(); }, { once: true });

  // Enter confirma, Escape cancela
  function keyHandler(e) {
    if (e.key === 'Enter')  { e.preventDefault(); confirm(); document.removeEventListener('keydown', keyHandler); }
    if (e.key === 'Escape') { e.preventDefault(); dismiss(); document.removeEventListener('keydown', keyHandler); }
  }
  document.addEventListener('keydown', keyHandler);
}

/* ── Exportar como JSON ─────────────────────────────────────── */
function exportJSON() {
  if (state.roots.length === 0) return;

  const today = new Date();
  const datePrefix = today.getFullYear()
    + '-' + String(today.getMonth() + 1).padStart(2, '0')
    + '-' + String(today.getDate()).padStart(2, '0');
  const baseName = state.roots[0].name.replace(/[^a-zA-Z0-9À-ÿ _-]/g, '').trim() || 'treeviewer';
  const suggestedName = datePrefix + '-' + baseName;

  showPrompt(
    'Salvar projeto como JSON',
    'Nome do arquivo (sem extensão)',
    suggestedName,
    (filename) => {
      const payload = { roots: state.roots };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = filename.endsWith('.json') ? filename : filename + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  );
}

/* ── Importar de JSON ──────────────────────────────────────── */
function importJSON() {
  const fileInput = document.getElementById('file-input-json');

  function openFilePicker() {
    fileInput.value = '';
    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          // JSON.parse com reviver nulo (comportamento padrão) — seguro para
          // prototype pollution porque o resultado é um plain Object.
          // Mesmo assim fazemos uma sanitização explícita dos nós para garantir
          // que apenas as propriedades esperadas entrem no state.
          const parsed = JSON.parse(ev.target.result);
          if (!parsed || typeof parsed !== 'object' ||
              !Array.isArray(parsed.roots)) {
            alert('Arquivo inválido: não contém uma lista de árvores.');
            return;
          }

          // Sanitiza recursivamente cada nó — copia apenas as propriedades
          // conhecidas, evitando prototype pollution e campos estranhos.
          function sanitizeNode(raw, depth) {
            if (!raw || typeof raw !== 'object') return null;
            const validIcons = new Set(ICON_REGISTRY.map(e => e.name));
            const node = Object.create(null);
            node.id       = typeof raw.id === 'string' ? raw.id.slice(0, 64) : newId();
            node.name     = typeof raw.name === 'string' ? raw.name.slice(0, 512) : 'Nó';
            node.iconName = validIcons.has(raw.iconName) ? raw.iconName : defaultIconName(depth);
            node.expanded  = raw.expanded !== false;   // default true
            node.minimized = raw.minimized === true;    // default false
            node.notes    = typeof raw.notes === 'string' ? raw.notes.slice(0, 4000) : '';
            node.children = Array.isArray(raw.children)
              ? raw.children.map(c => sanitizeNode(c, depth + 1)).filter(Boolean)
              : [];
            // Reconverte para plain Object (não Object.create(null)) para
            // compatibilidade com JSON.stringify e o restante do código.
            return {
              id: node.id, name: node.name, iconName: node.iconName,
              expanded: node.expanded, minimized: node.minimized,
              notes: node.notes, children: node.children,
            };
          }

          const sanitizedRoots = parsed.roots
            .map(r => sanitizeNode(r, 0))
            .filter(Boolean);

          if (sanitizedRoots.length === 0) {
            alert('Arquivo inválido: nenhuma árvore encontrada.');
            return;
          }

          state.roots           = sanitizedRoots;
          state.selectedId      = null;
          state.editingId       = null;
          state.editingPrevName = null;

          // Recalcula _idCounter para evitar colisões com IDs importados
          function maxId(nodes) {
            let m = 0;
            for (const n of nodes) {
              const num = parseInt(n.id.split('_')[0].slice(1));
              if (!isNaN(num) && num > m) m = num;
              m = Math.max(m, maxId(n.children));
            }
            return m;
          }
          _idCounter = maxId(state.roots);
          render();
        } catch (err) {
          alert('Erro ao ler o arquivo JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  }

  if (state.roots.length > 0) {
    showConfirm(
      'Abrir projeto JSON',
      'O projeto atual será substituído. Deseja continuar?',
      openFilePicker
    );
  } else {
    openFilePicker();
  }
}

/* ── Novo projeto ───────────────────────────────────────────── */
function newProject() {
  if (state.roots.length === 0) return; // já está vazio

  showConfirm(
    'Novo projeto',
    'O projeto atual será apagado. Deseja continuar?',
    () => {
      state.roots           = [];
      state.selectedId      = null;
      state.editingId       = null;
      state.editingPrevName = null;
      _idCounter            = 0;
      render();
    }
  );
}

/* ═══════════════════════════════════════════════════════════════
   DOM HELPERS
   ═══════════════════════════════════════════════════════════════ */

function el(id) { return document.getElementById(id); }

/* Cria elemento <li class="tv-node"> para um TreeNode */
function buildNodeEl(node, depth) {
  const tpl = el('tpl-node');
  const li = tpl.content.cloneNode(true).querySelector('li');

  li.dataset.id = node.id;

  const levelDiv = li.querySelector('.tv-level');
  const expanderBtn = li.querySelector('.tv-expander');
  const iconBtn = li.querySelector('.tv-node-icon');
  const nameSpan = li.querySelector('.tv-node-name');
  const indentOutBtn = li.querySelector('.tv-action-indent-out');
  const indentInBtn  = li.querySelector('.tv-action-indent-in');
  const upBtn        = li.querySelector('.tv-action-up');
  const downBtn      = li.querySelector('.tv-action-down');
  const notesBtn = li.querySelector('.tv-action-notes');
  const addBtn  = li.querySelector('.tv-action-add');
  const delBtn  = li.querySelector('.tv-action-del');
  const childrenUl = li.querySelector('.tv-children');

  // Ícone
  iconBtn.innerHTML = iconSvg(node.iconName, 15);

  // Badge de anotações (atualiza estado visual do botão)
  if (node.notes && node.notes.trim()) {
    notesBtn.classList.add('tv-action-notes--has-notes');
    notesBtn.title = 'Anotações (com conteúdo)';
  }

  // Nome
  nameSpan.textContent = node.name;

  // Estado expandido/colapsado
  updateExpanderState(li, node);

  // Sem filhos inicialmente — filhos são adicionados recursivamente
  node.children.forEach(child => {
    childrenUl.appendChild(buildNodeEl(child, depth + 1));
  });

  // ── Eventos ──
  // Selecionar ao clicar na linha
  levelDiv.addEventListener('click', e => {
    if (e.target.closest('.tv-expander') ||
        e.target.closest('.tv-node-icon') ||
        e.target.closest('.tv-node-actions')) return;
    selectNode(node.id);
  });

  // Duplo clique no nome → editar
  nameSpan.addEventListener('dblclick', e => {
    e.stopPropagation();
    startEditing(node.id);
  });

  // Expander
  expanderBtn.addEventListener('click', e => {
    e.stopPropagation();
    toggleExpand(node.id);
  });

  // Ícone → picker
  iconBtn.addEventListener('click', e => {
    e.stopPropagation();
    selectNode(node.id);
    openIconPicker(node.id, iconBtn);
  });

  // Botão de anotações
  notesBtn.addEventListener('click', e => {
    e.stopPropagation();
    selectNode(node.id);
    openNotesModal(node.id);
  });

  // Botão [+]
  addBtn.addEventListener('click', e => {
    e.stopPropagation();
    addChild(node.id);
  });

  // Botão [del]
  delBtn.addEventListener('click', e => {
    e.stopPropagation();
    removeNode(node.id);
  });

  // Botões ← → (indentação)
  indentOutBtn.addEventListener('click', e => {
    e.stopPropagation();
    indentOut(node.id);
  });
  indentInBtn.addEventListener('click', e => {
    e.stopPropagation();
    indentIn(node.id);
  });

  // Botões ↑ ↓
  upBtn.addEventListener('click', e => {
    e.stopPropagation();
    moveNode(node.id, -1);
  });
  downBtn.addEventListener('click', e => {
    e.stopPropagation();
    moveNode(node.id, +1);
  });

  // ── Drag and drop ──────────────────────────────────────────
  li.addEventListener('dragstart', e => {
    // Só inicia drag pelo handle (ou pelo li diretamente)
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', node.id);
    // Pequeno delay para o ghost aparecer antes de adicionar a classe
    requestAnimationFrame(() => li.classList.add('tv-node--dragging'));
  });

  li.addEventListener('dragend', () => {
    li.classList.remove('tv-node--dragging');
    document.querySelectorAll('.tv-drop-indicator').forEach(el => el.remove());
    document.querySelectorAll('.tv-node--drag-over').forEach(el => el.classList.remove('tv-node--drag-over'));
  });

  li.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    const dragId = e.dataTransfer.getData('text/plain') ||
                   document.querySelector('.tv-node--dragging')?.dataset.id;
    if (!dragId || dragId === node.id) return;

    // Determina se drop é acima ou abaixo da metade do nó
    const rect = li.getBoundingClientRect();
    const half = rect.top + rect.height / 2;
    const pos  = e.clientY < half ? 'before' : 'after';

    // Atualiza indicador visual
    document.querySelectorAll('.tv-drop-indicator').forEach(el => el.remove());
    const indicator = document.createElement('div');
    indicator.className = 'tv-drop-indicator';
    if (pos === 'before') {
      li.parentNode.insertBefore(indicator, li);
    } else {
      li.parentNode.insertBefore(indicator, li.nextSibling);
    }
    li.dataset.dropPos = pos;
  });

  li.addEventListener('dragleave', e => {
    // Só remove se saiu para fora do li (não para um filho)
    if (!li.contains(e.relatedTarget)) {
      delete li.dataset.dropPos;
    }
  });

  li.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();

    const dragId = e.dataTransfer.getData('text/plain');
    const dropPos = li.dataset.dropPos || 'after';
    delete li.dataset.dropPos;

    document.querySelectorAll('.tv-drop-indicator').forEach(el => el.remove());

    if (!dragId || dragId === node.id) return;

    // Verifica se o nó arrastado não é ancestral do alvo (evita loops)
    function isAncestor(possibleAncestorId, targetId) {
      const n = findNode(state.roots, possibleAncestorId);
      if (!n) return false;
      function search(children) {
        for (const c of children) {
          if (c.id === targetId) return true;
          if (search(c.children)) return true;
        }
        return false;
      }
      return search(n.children);
    }
    if (isAncestor(dragId, node.id)) return;

    // Remove o nó arrastado de onde está
    const srcList = findParentList(state.roots, dragId);
    if (!srcList) return;
    const srcIdx = srcList.findIndex(n => n.id === dragId);
    if (srcIdx < 0) return;
    const [draggedNode] = srcList.splice(srcIdx, 1);

    // Insere no destino
    const dstList = findParentList(state.roots, node.id);
    if (!dstList) { srcList.splice(srcIdx, 0, draggedNode); return; } // rollback
    const dstIdx = dstList.findIndex(n => n.id === node.id);
    const insertAt = dropPos === 'before' ? dstIdx : dstIdx + 1;
    dstList.splice(insertAt, 0, draggedNode);

    state.selectedId = dragId;
    render();
    requestAnimationFrame(() => {
      selectNode(dragId);
      scrollToSelected();
    });
  });

  return li;
}

function updateExpanderState(li, node) {
  if (node.children.length === 0) {
    li.classList.add('no-children');
    li.classList.remove('expanded', 'collapsed');
  } else {
    li.classList.remove('no-children');
    if (node.expanded) {
      li.classList.add('expanded');
      li.classList.remove('collapsed');
    } else {
      li.classList.add('collapsed');
      li.classList.remove('expanded');
    }
  }
}

/* Reconstrói o DOM inteiro do canvas a partir do state */
function render() {
  const canvas = el('canvas');
  const emptyState = el('empty-state');
  const statusbar = el('statusbar');

  // Limpa cards antigos
  canvas.querySelectorAll('.tv-card').forEach(c => c.remove());

  if (state.roots.length === 0) {
    emptyState.classList.add('visible');
    statusbar.style.display = 'none';
  } else {
    emptyState.classList.remove('visible');
    statusbar.style.display = '';

    state.roots.forEach(root => {
      const cardTpl = el('tpl-card');
      const card = cardTpl.content.cloneNode(true).querySelector('.tv-card');
      card.dataset.rootId = root.id;

      // Preenche o título no header
      const titleSpan = card.querySelector('.tv-card__title');
      if (titleSpan) titleSpan.textContent = root.name;

      // Botão copiar ASCII — vai dentro do .tv-card__body
      const copyBtn = document.createElement('button');
      copyBtn.className = 'tv-copy-btn';
      copyBtn.title = 'Copiar como texto (ASCII art)';
      copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
      </svg> Copiar`;
      copyBtn.addEventListener('click', e => {
        e.stopPropagation();
        copyCardAsAscii(root.id, copyBtn);
      });
      const cardBody = card.querySelector('.tv-card__body');
      cardBody.appendChild(copyBtn);

      const rootList = card.querySelector('.tv-root-list');
      rootList.appendChild(buildNodeEl(root, 0));

      // Aplica estado minimizado
      if (root.minimized) card.classList.add('tv-card--minimized');

      // Botão minimizar / maximizar
      const minimizeBtn = card.querySelector('.tv-card__minimize-btn');
      if (minimizeBtn) {
        minimizeBtn.addEventListener('click', e => {
          e.stopPropagation();
          root.minimized = !root.minimized;
          card.classList.toggle('tv-card--minimized', root.minimized);
          saveState();
        });
      }

      canvas.appendChild(card);
      attachCardDrag(card, root.id);
    });
  }

  // Atualiza zoom (reutiliza setZoom para consistência, mas setZoom ainda não existe aqui)
  if (state.zoom !== 1) {
    canvas.style.transform = `scale(${state.zoom})`;
    canvas.style.width  = `${(1 / state.zoom) * 100}%`;
    canvas.style.height = `${(1 / state.zoom) * 100}%`;
  } else {
    canvas.style.transform = '';
    canvas.style.width  = '';
    canvas.style.height = '';
  }

  // Atualiza tema
  document.documentElement.setAttribute('data-theme', state.theme);

  // Atualiza status
  el('status-trees').textContent = `${state.roots.length} ${state.roots.length === 1 ? 'árvore' : 'árvores'}`;
  const total = countAll(state.roots);
  el('status-nodes').textContent = `${total} ${total === 1 ? 'nó' : 'nós'}`;

  // Atualiza zoom label
  el('btn-zoom-reset').textContent = Math.round(state.zoom * 100) + '%';
  el('btn-zoom-out').disabled = state.zoom <= 0.5;
  el('btn-zoom-in').disabled  = state.zoom >= 2.0;

  // Re-aplica seleção visual
  if (state.selectedId) {
    const selEl = document.querySelector(`.tv-node[data-id="${state.selectedId}"] > .tv-level`);
    if (selEl) selEl.classList.add('selected');
  }

  // Re-aplica foco no card da raiz selecionada
  state.roots.forEach(root => {
    const card = document.querySelector(`.tv-card[data-root-id="${root.id}"]`);
    if (!card) return;
    const hasSelected = card.querySelector('.tv-level.selected');
    card.classList.toggle('focused', !!hasSelected);
  });

  saveState();
}

/* Re-renderiza apenas o nó alterado (para evitar flicker em edições) */
function rerenderNode(nodeId) {
  const node = findNode(state.roots, nodeId);
  if (!node) return render();

  const li = document.querySelector(`.tv-node[data-id="${nodeId}"]`);
  if (!li) return render();

  const depth = getDepth(state.roots, nodeId);
  const newLi = buildNodeEl(node, depth);

  // Substitui o li existente
  li.replaceWith(newLi);

  // Re-aplica seleção
  if (state.selectedId === nodeId) {
    const selEl = newLi.querySelector('.tv-level');
    if (selEl) selEl.classList.add('selected');
  }

  saveState();
}

/* ═══════════════════════════════════════════════════════════════
   AÇÕES DA ÁRVORE
   ═══════════════════════════════════════════════════════════════ */

function addRoot() {
  const node = createNode('Nova Árvore', 0);
  state.roots.push(node);
  state.selectedId = node.id;
  render();
  startEditing(node.id);
}

function addChild(parentId) {
  const parent = findNode(state.roots, parentId);
  if (!parent) return;
  const depth = getDepth(state.roots, parentId);
  const child = createNode('Novo nó', depth + 1);
  parent.children.push(child);
  parent.expanded = true;
  state.selectedId = child.id;
  render();
  startEditing(child.id);
}

function removeNode(id) {
  const node = findNode(state.roots, id);
  if (!node) return;

  if (node.children.length > 0) {
    if (!confirm(`Remover "${node.name}" e todos os seus filhos?`)) return;
  }

  // Remove do array correto
  const list = findParentList(state.roots, id);
  if (!list) return;
  const idx = list.findIndex(n => n.id === id);
  if (idx >= 0) list.splice(idx, 1);

  // Seleciona próximo nó disponível
  const flat = flattenVisible(state.roots);
  state.selectedId = flat.length > 0 ? flat[Math.max(0, flat.length - 1)] : null;
  state.editingId = null;

  render();
}

function toggleExpand(id) {
  const node = findNode(state.roots, id);
  if (!node || node.children.length === 0) return;
  node.expanded = !node.expanded;
  rerenderNode(id);
}

/* ── Mover nó para cima/baixo entre irmãos ──────────────────── */
function moveNode(id, direction) {
  const list = findParentList(state.roots, id);
  if (!list) return;
  const idx = list.findIndex(n => n.id === id);
  if (idx < 0) return;

  const targetIdx = idx + direction; // -1 = cima, +1 = baixo
  if (targetIdx < 0 || targetIdx >= list.length) return;

  // Troca de posição
  [list[idx], list[targetIdx]] = [list[targetIdx], list[idx]];

  render();
  // Mantém seleção e scroll no nó movido
  state.selectedId = id;
  requestAnimationFrame(() => {
    selectNode(id);
    scrollToSelected();
  });
}

function selectNode(id) {
  if (state.editingId && state.editingId !== id) {
    commitEditing();
  }
  state.selectedId = id;

  // Remove 'selected' de tudo
  document.querySelectorAll('.tv-level.selected').forEach(el => el.classList.remove('selected'));

  // Adiciona no nó correto
  const levelEl = document.querySelector(`.tv-node[data-id="${id}"] > .tv-level`);
  if (levelEl) levelEl.classList.add('selected');

  // Atualiza foco no card
  document.querySelectorAll('.tv-card').forEach(card => {
    const hasSelected = card.querySelector('.tv-level.selected');
    card.classList.toggle('focused', !!hasSelected);
  });
}

/* ── Edição inline ──────────────────────────────────────────── */
function startEditing(id) {
  if (state.editingId) commitEditing();

  const node = findNode(state.roots, id);
  if (!node) return;

  state.editingId = id;
  state.editingPrevName = node.name;
  state.selectedId = id;

  const li = document.querySelector(`.tv-node[data-id="${id}"]`);
  if (!li) return;

  const nameSpan = li.querySelector('.tv-node-name');
  if (!nameSpan) return;

  // Cria input inline
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'tv-node-name-input';
  input.value = node.name;

  nameSpan.replaceWith(input);
  input.focus();
  input.select();

  input.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'Enter')  { e.preventDefault(); commitEditing(); }
    if (e.key === 'Escape') { e.preventDefault(); cancelEditing(); }
  });

  input.addEventListener('blur', () => {
    // Pequeno delay para não conflitar com cliques em outros nós
    setTimeout(() => { if (state.editingId === id) commitEditing(); }, 100);
  });

  // Seleciona o nó visualmente
  const levelEl = li.querySelector('.tv-level');
  if (levelEl) levelEl.classList.add('selected');
}

function commitEditing() {
  if (!state.editingId) return;
  const id = state.editingId;
  const input = document.querySelector(`.tv-node[data-id="${id}"] .tv-node-name-input`);
  const name = input ? (input.value.trim() || state.editingPrevName) : state.editingPrevName;

  const node = findNode(state.roots, id);
  if (node) node.name = name;

  state.editingId = null;
  state.editingPrevName = null;
  rerenderNode(id);

  // Se o nó renomeado for uma raiz, atualiza o título no header do card
  if (node && state.roots.includes(node)) {
    const titleSpan = document.querySelector(`.tv-card[data-root-id="${id}"] .tv-card__title`);
    if (titleSpan) titleSpan.textContent = node.name;
  }

  // Reaplica seleção
  selectNode(id);
}

function cancelEditing() {
  if (!state.editingId) return;
  const id = state.editingId;
  const node = findNode(state.roots, id);
  if (node && state.editingPrevName !== null) node.name = state.editingPrevName;

  state.editingId = null;
  state.editingPrevName = null;
  rerenderNode(id);
  selectNode(id);
}

/* ── Indentação: promover (←) e rebaixar (→) ────────────────── */

// ← : o nó deixa de ser filho do pai e passa a ser irmão dele,
//     inserido logo abaixo do pai na lista do avô.
function indentOut(id) {
  // Precisa ter pai E avô (não pode ser raiz nem filho de raiz sem avô)
  const parentNode = findParentNode(state.roots, id);
  if (!parentNode) return; // já é raiz — não tem para onde promover

  const grandList = findParentList(state.roots, parentNode.id);
  if (!grandList) return;

  // Remove o nó da lista de filhos do pai
  const srcList = parentNode.children;
  const srcIdx  = srcList.findIndex(n => n.id === id);
  if (srcIdx < 0) return;
  const [node] = srcList.splice(srcIdx, 1);

  // Insere no avô logo após o pai
  const parentIdx = grandList.findIndex(n => n.id === parentNode.id);
  grandList.splice(parentIdx + 1, 0, node);

  state.selectedId = id;
  render();
  requestAnimationFrame(() => { selectNode(id); scrollToSelected(); });
}

// → : o nó passa a ser filho do irmão imediatamente acima dele.
//     Se não houver irmão acima, não faz nada.
function indentIn(id) {
  const siblingList = findParentList(state.roots, id);
  if (!siblingList) return;

  const idx = siblingList.findIndex(n => n.id === id);
  if (idx <= 0) return; // não há irmão acima

  const newParent = siblingList[idx - 1]; // irmão imediatamente acima

  // Remove da lista atual
  const [node] = siblingList.splice(idx, 1);

  // Adiciona como último filho do irmão acima e expande
  newParent.children.push(node);
  newParent.expanded = true;

  state.selectedId = id;
  render();
  requestAnimationFrame(() => { selectNode(id); scrollToSelected(); });
}

/* ── ASCII Art da árvore ────────────────────────────────────── */
function treeToAscii(node) {
  const lines = [];

  function walk(n, prefix, isLast) {
    const connector = isLast ? '└── ' : '├── ';
    lines.push(prefix + connector + n.name);
    const childPrefix = prefix + (isLast ? '    ' : '│   ');
    n.children.forEach((child, idx) => {
      walk(child, childPrefix, idx === n.children.length - 1);
    });
  }

  lines.push(node.name);
  node.children.forEach((child, idx) => {
    walk(child, '', idx === node.children.length - 1);
  });

  return lines.join('\n');
}

function copyCardAsAscii(rootId, btnEl) {
  const node = findNode(state.roots, rootId);
  if (!node) return;

  const text = treeToAscii(node);

  navigator.clipboard.writeText(text).then(() => {
    // Feedback visual: troca ícone por "✓ Copiado" por 1.5s
    const original = btnEl.innerHTML;
    btnEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg> Copiado`;
    btnEl.classList.add('tv-copy-btn--ok');
    setTimeout(() => {
      btnEl.innerHTML = original;
      btnEl.classList.remove('tv-copy-btn--ok');
    }, 1500);
  }).catch(() => {
    // Fallback para navegadores sem clipboard API (ex: file://)
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);

    const original = btnEl.innerHTML;
    btnEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6 9 17l-5-5"/>
    </svg> Copiado`;
    btnEl.classList.add('tv-copy-btn--ok');
    setTimeout(() => {
      btnEl.innerHTML = original;
      btnEl.classList.remove('tv-copy-btn--ok');
    }, 1500);
  });
}

/* ── Drag & Drop entre cards (reordenar árvores raiz) ────────── */

// ID do prefixo usado nos dados de transfer para distinguir do drag de nós
const CARD_DRAG_PREFIX = 'card:';

// Flag global: indica se um drag de card está em andamento
let _cardDragActive = false;

function attachCardDrag(card, rootId) {
  const handle = card.querySelector('.tv-card__drag-handle');
  if (!handle) return;

  // Só inicia o drag se o mousedown foi no handle
  let dragStartedFromHandle = false;

  handle.addEventListener('mousedown', () => { dragStartedFromHandle = true; });
  document.addEventListener('mouseup', () => { dragStartedFromHandle = false; }, { capture: true });

  card.setAttribute('draggable', 'true');

  card.addEventListener('dragstart', e => {
    if (!dragStartedFromHandle) {
      e.preventDefault();
      return;
    }
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', CARD_DRAG_PREFIX + rootId);
    _cardDragActive = true;
    requestAnimationFrame(() => card.classList.add('tv-card--dragging'));
  });

  card.addEventListener('dragend', () => {
    dragStartedFromHandle = false;
    _cardDragActive = false;
    card.classList.remove('tv-card--dragging');
    _removeCardDropIndicators();
  });

  card.addEventListener('dragover', e => {
    // Só reage a drags de card — ignora drags de nós internos
    if (!_cardDragActive) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';

    // Determina se inserir antes ou depois do card alvo
    const rect = card.getBoundingClientRect();
    const half = rect.left + rect.width / 2;
    const pos  = e.clientX < half ? 'before' : 'after';

    _removeCardDropIndicators();
    const indicator = document.createElement('div');
    indicator.className = 'tv-card-drop-indicator';
    indicator.dataset.dropPos = pos;

    const canvas = el('canvas');
    if (pos === 'before') {
      canvas.insertBefore(indicator, card);
    } else {
      canvas.insertBefore(indicator, card.nextSibling);
    }
    card.dataset.cardDropPos = pos;
  });

  card.addEventListener('dragleave', e => {
    if (!card.contains(e.relatedTarget)) {
      delete card.dataset.cardDropPos;
    }
  });

  card.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();

    const raw = e.dataTransfer.getData('text/plain');
    if (!raw.startsWith(CARD_DRAG_PREFIX)) return; // é drag de nó interno — ignora

    const dragRootId = raw.slice(CARD_DRAG_PREFIX.length);
    const dropPos    = card.dataset.cardDropPos || 'after';
    delete card.dataset.cardDropPos;
    _removeCardDropIndicators();

    if (dragRootId === rootId) return; // solto em si mesmo

    const srcIdx = state.roots.findIndex(r => r.id === dragRootId);
    const dstIdx = state.roots.findIndex(r => r.id === rootId);
    if (srcIdx < 0 || dstIdx < 0) return;

    // Remove da posição original
    const [draggedRoot] = state.roots.splice(srcIdx, 1);

    // Recalcula dstIdx após remoção
    const newDstIdx = state.roots.findIndex(r => r.id === rootId);
    const insertAt  = dropPos === 'before' ? newDstIdx : newDstIdx + 1;
    state.roots.splice(insertAt, 0, draggedRoot);

    render();
  });
}

function _removeCardDropIndicators() {
  document.querySelectorAll('.tv-card-drop-indicator').forEach(el => el.remove());
}

/* ── Zoom ───────────────────────────────────────────────────── */
function setZoom(z) {
  state.zoom = Math.round(Math.min(2.0, Math.max(0.5, z)) * 10) / 10;
  const canvas = el('canvas');
  if (state.zoom === 1) {
    canvas.style.transform = '';
    canvas.style.width = '';
    canvas.style.height = '';
  } else {
    canvas.style.transform = `scale(${state.zoom})`;
    // Compensa o encolhimento para o scroll continuar funcionando
    canvas.style.width  = `${(1 / state.zoom) * 100}%`;
    canvas.style.height = `${(1 / state.zoom) * 100}%`;
  }
  el('btn-zoom-reset').textContent = Math.round(state.zoom * 100) + '%';
  el('btn-zoom-out').disabled = state.zoom <= 0.5;
  el('btn-zoom-in').disabled  = state.zoom >= 2.0;
  saveState();
}

/* ── Navegação por teclado ──────────────────────────────────── */
function selectPrev() {
  const flat = flattenVisible(state.roots);
  if (!flat.length) return;
  if (!state.selectedId) { selectNode(flat[0]); return; }
  const idx = flat.indexOf(state.selectedId);
  if (idx > 0) selectNode(flat[idx - 1]);
  scrollToSelected();
}

function selectNext() {
  const flat = flattenVisible(state.roots);
  if (!flat.length) return;
  if (!state.selectedId) { selectNode(flat[0]); return; }
  const idx = flat.indexOf(state.selectedId);
  if (idx < flat.length - 1) selectNode(flat[idx + 1]);
  scrollToSelected();
}

function scrollToSelected() {
  if (!state.selectedId) return;
  const el = document.querySelector(`.tv-node[data-id="${state.selectedId}"] > .tv-level`);
  if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function selectParent() {
  if (!state.selectedId) return;
  const parent = findParentNode(state.roots, state.selectedId);
  if (parent) selectNode(parent.id);
}

function selectFirstChild() {
  if (!state.selectedId) return;
  const node = findNode(state.roots, state.selectedId);
  if (node && node.expanded && node.children.length > 0) {
    selectNode(node.children[0].id);
  }
}

/* ═══════════════════════════════════════════════════════════════
   ICON PICKER
   ═══════════════════════════════════════════════════════════════ */
let _pickerTargetId = null;

function openIconPicker(nodeId, anchorEl) {
  _pickerTargetId = nodeId;
  const picker = el('icon-picker');
  const searchInput = el('icon-search');

  // Limpa busca
  searchInput.value = '';
  el('icon-search-clear').style.display = 'none';
  renderIconGrid('');

  // Posiciona o picker
  picker.style.display = 'block';
  const rect = anchorEl.getBoundingClientRect();
  const pickerH = 310;
  const top = (rect.bottom + pickerH > window.innerHeight)
    ? rect.top - pickerH - 4
    : rect.bottom + 4;
  picker.style.top  = top + window.scrollY + 'px';
  picker.style.left = rect.left + window.scrollX + 'px';

  searchInput.focus();
}

function closeIconPicker() {
  el('icon-picker').style.display = 'none';
  _pickerTargetId = null;
}

function renderIconGrid(query) {
  const results = searchIcons(query);
  const grid = el('icon-grid');
  grid.innerHTML = '';

  results.forEach(entry => {
    const btn = document.createElement('button');
    btn.innerHTML = entry.svg.replace('<svg ', `<svg width="18" height="18" `);
    btn.title = entry.name;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (_pickerTargetId) {
        const node = findNode(state.roots, _pickerTargetId);
        if (node) {
          node.iconName = entry.name;
          rerenderNode(_pickerTargetId);
          selectNode(_pickerTargetId);
        }
      }
      closeIconPicker();
    });
    grid.appendChild(btn);
  });

  el('icon-footer').textContent = `${results.length} ícones${query ? ` para "${query}"` : ''}`;
}

/* ═══════════════════════════════════════════════════════════════
   MODAL DE ANOTAÇÕES — MARKDOWN EDITOR
   ═══════════════════════════════════════════════════════════════ */

const NOTES_MAX = 4000;

/* ── Conversor Markdown → HTML (sem dependências externas) ────── */
function markdownToHtml(md) {
  if (!md) return '';

  // Escapa HTML para segurança (evita XSS ao renderizar)
  function escHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  const lines = md.split('\n');
  const out = [];
  let inUl = false;
  let inOl = false;

  function closeList() {
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
  }

  function inlineFormat(s) {
    // Bold + italic: ***text*** ou ___text___
    s = s.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
    // Bold: **text** ou __text__
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__(.+?)__/g, '<strong>$1</strong>');
    // Italic: *text* ou _text_
    s = s.replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
    s = s.replace(/_([^_\n]+?)_/g, '<em>$1</em>');
    return s;
  }

  for (const raw of lines) {
    const line = raw;

    // Headings
    if (/^### (.+)/.test(line)) {
      closeList();
      out.push('<h3>' + inlineFormat(escHtml(line.slice(4))) + '</h3>');
      continue;
    }
    if (/^## (.+)/.test(line)) {
      closeList();
      out.push('<h2>' + inlineFormat(escHtml(line.slice(3))) + '</h2>');
      continue;
    }
    if (/^# (.+)/.test(line)) {
      closeList();
      out.push('<h1>' + inlineFormat(escHtml(line.slice(2))) + '</h1>');
      continue;
    }

    // Lista não-ordenada: "- " ou "* "
    const ulMatch = line.match(/^[-*] (.+)/);
    if (ulMatch) {
      if (inOl) { out.push('</ol>'); inOl = false; olCounter = 0; }
      if (!inUl) { out.push('<ul>'); inUl = true; }
      out.push('<li>' + inlineFormat(escHtml(ulMatch[1])) + '</li>');
      continue;
    }

    // Lista ordenada: "1. " "2. " etc.
    const olMatch = line.match(/^(\d+)\. (.+)/);
    if (olMatch) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (!inOl) { out.push('<ol>'); inOl = true; }
      out.push('<li>' + inlineFormat(escHtml(olMatch[2])) + '</li>');
      continue;
    }

    // Linha vazia
    if (line.trim() === '') {
      closeList();
      out.push('<br>');
      continue;
    }

    // Parágrafo comum
    closeList();
    out.push('<p>' + inlineFormat(escHtml(line)) + '</p>');
  }

  closeList();
  return out.join('');
}

/* ── Conversor HTML → Markdown (DOM-based) ────────────────────── */
function htmlToMarkdown(html) {
  if (!html) return '';

  // Cria um container temporário fora do DOM
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  function nodeToMd(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const tag = node.tagName.toLowerCase();
    const inner = Array.from(node.childNodes).map(nodeToMd).join('');

    switch (tag) {
      case 'h1': return '# ' + inner + '\n';
      case 'h2': return '## ' + inner + '\n';
      case 'h3': return '### ' + inner + '\n';
      case 'strong': case 'b': return '**' + inner + '**';
      case 'em': case 'i': return '*' + inner + '*';
      case 'ul': return inner;
      case 'ol': return inner;
      case 'li': {
        // Detecta se o pai é ol
        const parentTag = node.parentElement ? node.parentElement.tagName.toLowerCase() : '';
        if (parentTag === 'ol') {
          // Conta posição para número
          const siblings = Array.from(node.parentElement.children);
          const idx = siblings.indexOf(node) + 1;
          return idx + '. ' + inner + '\n';
        }
        return '- ' + inner + '\n';
      }
      case 'br': return '\n';
      case 'p': return inner + '\n';
      case 'div': return inner + '\n';
      default: return inner;
    }
  }

  const md = Array.from(tmp.childNodes).map(nodeToMd).join('');
  // Remove quebras de linha triplas ou mais
  return md.replace(/\n{3,}/g, '\n\n').trimEnd();
}

/* ── Estado da modal ──────────────────────────────────────────── */
let _notesNodeId    = null;   // ID do nó sendo editado
let _notesMode      = 'visual'; // 'visual' | 'raw'
let _notesDraft     = '';     // rascunho atual em markdown

/* ── Atualiza o badge (indicador de nota) no botão do nó ─────── */
function updateNotesBadge(nodeId) {
  const node = findNode(state.roots, nodeId);
  const btn = document.querySelector(`.tv-node[data-id="${nodeId}"] .tv-action-notes`);
  if (!btn) return;
  if (node && node.notes && node.notes.trim()) {
    btn.classList.add('tv-action-notes--has-notes');
    btn.title = 'Anotações (com conteúdo)';
  } else {
    btn.classList.remove('tv-action-notes--has-notes');
    btn.title = 'Anotações do nó';
  }
}

/* ── Sincroniza contador de caracteres ───────────────────────── */
function _updateNotesCounter(len) {
  const counter = el('notes-counter');
  if (!counter) return;
  counter.textContent = len + ' / ' + NOTES_MAX;
  counter.classList.toggle('tv-notes-counter--warn', len >= NOTES_MAX * 0.9);
  counter.classList.toggle('tv-notes-counter--over', len >= NOTES_MAX);
}

/* ── Lê o markdown atual (de qualquer modo ativo) ─────────────── */
function _getCurrentMarkdown() {
  if (_notesMode === 'raw') {
    return el('notes-raw').value;
  }
  // Modo visual: converte HTML do contenteditable para markdown
  return htmlToMarkdown(el('notes-preview').innerHTML);
}

/* ── Abre a modal de anotações ───────────────────────────────── */
function openNotesModal(nodeId) {
  const node = findNode(state.roots, nodeId);
  if (!node) return;

  _notesNodeId = nodeId;
  _notesDraft  = node.notes || '';

  // Título: nome do nó (truncado)
  const title = el('notes-title');
  const maxLen = 40;
  title.textContent = 'Anotações: ' + (node.name.length > maxLen
    ? node.name.slice(0, maxLen) + '…'
    : node.name);

  // Reseta para modo visual
  _notesMode = 'visual';
  _applyModeToUI();

  // Popula o conteúdo
  el('notes-preview').innerHTML = markdownToHtml(_notesDraft);
  el('notes-raw').value = _notesDraft;
  _updateNotesCounter(_notesDraft.length);

  // Mostra overlay
  el('notes-overlay').style.display = 'flex';

  // Foca no editor
  setTimeout(() => el('notes-preview').focus(), 50);
}

/* ── Fecha a modal ────────────────────────────────────────────── */
function closeNotesModal(save) {
  if (save && _notesNodeId) {
    const md = _getCurrentMarkdown().slice(0, NOTES_MAX);
    const node = findNode(state.roots, _notesNodeId);
    if (node) {
      node.notes = md;
      saveState();
      updateNotesBadge(_notesNodeId);
    }
  }

  el('notes-overlay').style.display = 'none';
  _notesNodeId = null;
  _notesDraft  = '';
}

/* ── Aplica UI do modo atual (visual / raw) ──────────────────── */
function _applyModeToUI() {
  const preview = el('notes-preview');
  const raw     = el('notes-raw');
  const modeBtn = el('btn-notes-mode');
  const label   = modeBtn.querySelector('.tv-notes-mode-label');

  if (_notesMode === 'visual') {
    preview.style.display = '';
    raw.style.display     = 'none';
    label.textContent     = 'Visual';
    modeBtn.classList.remove('tv-notes-mode-toggle--active');
  } else {
    preview.style.display = 'none';
    raw.style.display     = '';
    label.textContent     = 'Markdown';
    modeBtn.classList.add('tv-notes-mode-toggle--active');
    raw.focus();
  }
}

/* ── Alterna entre modo visual e raw ─────────────────────────── */
function toggleNotesMode() {
  if (_notesMode === 'visual') {
    // Visual → Raw: converte HTML atual para markdown
    const md = htmlToMarkdown(el('notes-preview').innerHTML);
    _notesMode = 'raw';
    _applyModeToUI();
    el('notes-raw').value = md;
    _updateNotesCounter(md.length);
  } else {
    // Raw → Visual: converte markdown para HTML
    const md = el('notes-raw').value;
    _notesMode = 'visual';
    _applyModeToUI();
    el('notes-preview').innerHTML = markdownToHtml(md);
    _updateNotesCounter(md.length);
  }
}

/* ── Aplica formatação markdown na textarea (modo raw) ──────── */
function _applyFormatRaw(action) {
  const ta = el('notes-raw');
  const start = ta.selectionStart;
  const end   = ta.selectionEnd;
  const sel   = ta.value.slice(start, end);
  const before = ta.value.slice(0, start);
  const after  = ta.value.slice(end);

  let insert = '';
  let cursorOffset = 0;

  switch (action) {
    case 'bold': {
      if (sel) {
        insert = '**' + sel + '**';
        cursorOffset = insert.length;
      } else {
        insert = '****';
        cursorOffset = 2;
      }
      break;
    }
    case 'italic': {
      if (sel) {
        insert = '*' + sel + '*';
        cursorOffset = insert.length;
      } else {
        insert = '**';
        cursorOffset = 1;
      }
      break;
    }
    case 'normal': {
      // Remove prefixo de heading, marcador de lista e negrito/itálico de cada linha selecionada
      const lineStart = before.lastIndexOf('\n') + 1;
      const selLines  = ta.value.slice(lineStart, end || lineStart + 1).split('\n');
      const cleaned   = selLines.map(l =>
        l
          .replace(/^#{1,6} /, '')          // remove headings
          .replace(/^[-*] /, '')             // remove lista não-ordenada
          .replace(/^\d+\. /, '')            // remove lista ordenada
          .replace(/^\*\*(.+)\*\*$/, '$1')  // remove bold linha inteira
          .replace(/^\*(.+)\*$/, '$1')      // remove italic linha inteira
      ).join('\n');
      const newValue  = ta.value.slice(0, lineStart) + cleaned + ta.value.slice(end || lineStart + selLines.join('\n').length);
      ta.value = newValue.slice(0, NOTES_MAX);
      _updateNotesCounter(ta.value.length);
      ta.focus();
      return;
    }
    case 'h1': case 'h2': case 'h3': {
      const prefix = { h1: '# ', h2: '## ', h3: '### ' }[action];
      // Pega a linha atual
      const lineStart = before.lastIndexOf('\n') + 1;
      const lineText  = ta.value.slice(lineStart, end < lineStart ? lineStart : end);
      // Remove prefix existente de heading se já tiver
      const cleanLine = lineText.replace(/^#{1,3} /, '');
      const newValue  = ta.value.slice(0, lineStart) + prefix + cleanLine + ta.value.slice(lineStart + lineText.length);
      ta.value = newValue.slice(0, NOTES_MAX);
      _updateNotesCounter(ta.value.length);
      ta.focus();
      ta.setSelectionRange(lineStart + prefix.length + cleanLine.length, lineStart + prefix.length + cleanLine.length);
      return;
    }
    case 'ul': {
      // Adiciona "- " no início da linha atual ou em cada linha selecionada
      const lineStart = before.lastIndexOf('\n') + 1;
      const selLines  = ta.value.slice(lineStart, end).split('\n');
      const prefixed  = selLines.map(l => l.startsWith('- ') ? l : '- ' + l).join('\n');
      const newValue  = ta.value.slice(0, lineStart) + prefixed + ta.value.slice(end);
      ta.value = newValue.slice(0, NOTES_MAX);
      _updateNotesCounter(ta.value.length);
      ta.focus();
      return;
    }
    case 'ol': {
      const lineStart = before.lastIndexOf('\n') + 1;
      const selLines  = ta.value.slice(lineStart, end).split('\n');
      const prefixed  = selLines.map((l, i) => {
        const clean = l.replace(/^\d+\. /, '');
        return (i + 1) + '. ' + clean;
      }).join('\n');
      const newValue  = ta.value.slice(0, lineStart) + prefixed + ta.value.slice(end);
      ta.value = newValue.slice(0, NOTES_MAX);
      _updateNotesCounter(ta.value.length);
      ta.focus();
      return;
    }
    default: return;
  }

  const newValue = (before + insert + after).slice(0, NOTES_MAX);
  ta.value = newValue;
  _updateNotesCounter(ta.value.length);
  ta.focus();
  ta.setSelectionRange(start + cursorOffset, start + cursorOffset);
}

/* ── Aplica formatação no modo visual (contenteditable) ─────── */
function _applyFormatVisual(action) {
  const preview = el('notes-preview');
  preview.focus();

  switch (action) {
    case 'normal': {
      // Remove formatação de bloco (volta para parágrafo) e limpa inline
      document.execCommand('formatBlock', false, 'p');
      document.execCommand('removeFormat', false, null);
      // Se havia lista, tenta sair dela também
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        const node = sel.getRangeAt(0).commonAncestorContainer;
        const li = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        if (li && li.closest && (li.closest('ul') || li.closest('ol'))) {
          document.execCommand('insertUnorderedList', false, null);
        }
      }
      break;
    }
    case 'bold':   document.execCommand('bold',   false, null); break;
    case 'italic': document.execCommand('italic', false, null); break;
    case 'h1': case 'h2': case 'h3': {
      // formatBlock insere o elemento de heading no contenteditable
      document.execCommand('formatBlock', false, action);
      break;
    }
    case 'ul': document.execCommand('insertUnorderedList', false, null); break;
    case 'ol': document.execCommand('insertOrderedList',   false, null); break;
  }
  // Atualiza contador com o markdown gerado
  const md = htmlToMarkdown(preview.innerHTML);
  _updateNotesCounter(md.length);
}

/* ── Dispatch de formatação (decide modo) ────────────────────── */
function applyFormat(action) {
  if (_notesMode === 'raw') {
    _applyFormatRaw(action);
  } else {
    _applyFormatVisual(action);
  }
}

/* ═══════════════════════════════════════════════════════════════
   INICIALIZAÇÃO E EVENT LISTENERS
   ═══════════════════════════════════════════════════════════════ */

window.TreeViewer = { addRoot, exportJSON, importJSON, newProject };

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  render();

  /* ── Botões do header ── */
  el('btn-new-root').addEventListener('click',    addRoot);
  el('btn-save-json').addEventListener('click',   exportJSON);
  el('btn-open-json').addEventListener('click',   importJSON);
  el('btn-new-project').addEventListener('click', newProject);

  el('btn-zoom-in').addEventListener('click',    () => setZoom(state.zoom + 0.1));
  el('btn-zoom-out').addEventListener('click',   () => setZoom(state.zoom - 0.1));
  el('btn-zoom-reset').addEventListener('click', () => setZoom(1.0));

  el('btn-theme').addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    saveState();
  });

  /* ── Modal de anotações ── */
  el('btn-notes-ok').addEventListener('click',     () => closeNotesModal(true));
  el('btn-notes-cancel').addEventListener('click', () => closeNotesModal(false));
  el('btn-close-notes').addEventListener('click',  () => closeNotesModal(false));

  // Fechar ao clicar no overlay (fora da modal)
  el('notes-overlay').addEventListener('click', e => {
    if (e.target === el('notes-overlay')) closeNotesModal(false);
  });

  // Escape fecha a modal sem salvar
  // (tratado no listener global de teclado abaixo)

  // Botão de alternância de modo (Visual ↔ Markdown)
  el('btn-notes-mode').addEventListener('click', toggleNotesMode);

  // Botões de formatação da toolbar
  el('notes-overlay').querySelectorAll('.tv-notes-toolbar-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => applyFormat(btn.dataset.action));
  });

  // Contador ao digitar no modo visual
  el('notes-preview').addEventListener('input', () => {
    const md = htmlToMarkdown(el('notes-preview').innerHTML);
    const len = md.length;
    _updateNotesCounter(len);
    // Impede ultrapassar o limite: trunca se necessário
    if (len > NOTES_MAX) {
      // Remove o último caractere de forma não-destrutiva
      const truncated = md.slice(0, NOTES_MAX);
      el('notes-preview').innerHTML = markdownToHtml(truncated);
      // Move cursor para o final
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(el('notes-preview'));
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      _updateNotesCounter(NOTES_MAX);
    }
  });

  // Contador ao digitar no modo raw
  el('notes-raw').addEventListener('input', () => {
    const len = el('notes-raw').value.length;
    _updateNotesCounter(len);
  });

  // Atalhos de teclado dentro da modal
  el('notes-overlay').addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeNotesModal(false);
      return;
    }
    // Ctrl+B / Ctrl+I para formatação rápida
    if (e.ctrlKey && e.key === 'b') { e.preventDefault(); applyFormat('bold');   return; }
    if (e.ctrlKey && e.key === 'i') { e.preventDefault(); applyFormat('italic'); return; }
  });

  el('btn-shortcuts').addEventListener('click', () => {
    el('shortcuts-overlay').style.display = 'flex';
  });
  el('btn-close-shortcuts').addEventListener('click', () => {
    el('shortcuts-overlay').style.display = 'none';
  });
  el('shortcuts-overlay').addEventListener('click', e => {
    if (e.target === el('shortcuts-overlay')) el('shortcuts-overlay').style.display = 'none';
  });

  /* ── Icon Picker ── */
  el('icon-search').addEventListener('input', e => {
    const q = e.target.value;
    el('icon-search-clear').style.display = q ? 'flex' : 'none';
    renderIconGrid(q);
  });
  el('icon-search-clear').addEventListener('click', () => {
    el('icon-search').value = '';
    el('icon-search-clear').style.display = 'none';
    renderIconGrid('');
  });

  // Fechar picker ao clicar fora
  document.addEventListener('mousedown', e => {
    const picker = el('icon-picker');
    if (picker.style.display !== 'none' && !picker.contains(e.target)) {
      closeIconPicker();
    }
  });

  /* ── Teclado global ── */
  document.addEventListener('keydown', e => {
    // Ignora se a modal de anotações estiver aberta (ela tem seu próprio handler)
    if (el('notes-overlay').style.display !== 'none') return;

    // Ignora se o foco é num input/textarea que não é o nosso editor inline
    const active = document.activeElement;
    const isExternalInput =
      active &&
      (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') &&
      !active.classList.contains('tv-node-name-input') &&
      active.id !== 'icon-search';

    if (isExternalInput) return;

    // Fecha picker com Escape
    if (el('icon-picker').style.display !== 'none') {
      if (e.key === 'Escape') { e.preventDefault(); closeIconPicker(); }
      return;
    }

    switch (e.key) {
      case 'F2':
        e.preventDefault();
        if (state.selectedId && !state.editingId) startEditing(state.selectedId);
        break;

      case 'Insert':
        e.preventDefault();
        if (state.editingId) break;
        if (state.selectedId) addChild(state.selectedId);
        else addRoot();
        break;

      case 'Delete':
        if (state.editingId) break;
        e.preventDefault();
        if (state.selectedId) removeNode(state.selectedId);
        break;

      case 'ArrowUp':
        if (state.editingId) break;
        e.preventDefault();
        if (e.altKey) moveNode(state.selectedId, -1);
        else selectPrev();
        break;

      case 'ArrowDown':
        if (state.editingId) break;
        e.preventDefault();
        if (e.altKey) moveNode(state.selectedId, +1);
        else selectNext();
        break;

      case 'ArrowLeft':
        if (state.editingId) break;
        e.preventDefault();
        if (e.altKey) indentOut(state.selectedId);
        else if (state.selectedId) {
          const node = findNode(state.roots, state.selectedId);
          if (node && node.expanded && node.children.length > 0) toggleExpand(state.selectedId);
          else selectParent();
        }
        break;

      case 'ArrowRight':
        if (state.editingId) break;
        e.preventDefault();
        if (e.altKey) indentIn(state.selectedId);
        else if (state.selectedId) {
          const node = findNode(state.roots, state.selectedId);
          if (node && !node.expanded && node.children.length > 0) toggleExpand(state.selectedId);
          else selectFirstChild();
        }
        break;

      case 'Escape':
        if (state.editingId) { e.preventDefault(); cancelEditing(); }
        break;

      // Enter é tratado pelo listener do input inline
    }
  });

  /* ── Clique no canvas fora de nós → deseleciona ── */
  el('canvas').addEventListener('click', e => {
    if (e.target === el('canvas') || e.target.closest('.tv-card__tree') === null) {
      if (!e.target.closest('.tv-level')) {
        state.selectedId = null;
        document.querySelectorAll('.tv-level.selected').forEach(el => el.classList.remove('selected'));
        document.querySelectorAll('.tv-card.focused').forEach(el => el.classList.remove('focused'));
      }
    }
  });
});
