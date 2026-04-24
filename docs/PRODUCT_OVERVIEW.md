# 📋 ProductFlow — Visão Geral do Produto (v2)

> **Documento de referência para IAs e desenvolvedores.**
> Este arquivo descreve o produto final planejado, suas funcionalidades, stack técnica atualizada, arquitetura e diretrizes de implementação.

---

## 🎯 O que é o ProductFlow?

**ProductFlow** é uma plataforma web de produtividade colaborativa voltada para **times pequenos de desenvolvimento** e **equipes multidisciplinares**. Seu objetivo é organizar projetos complexos com múltiplas etapas de forma visual e intuitiva, centralizar comunicação e documentação, tudo com uma stack enxuta e deploy simples.

O produto é pensado para times de 2 a 20 pessoas que precisam de uma ferramenta leve, sem overhead de configuração, que funcione como um híbrido entre **Notion + Trello + Miro**, mas com foco em fluxos de trabalho estruturados e colaboração em tempo real.

---

## 👥 Público-alvo

- Times pequenos de desenvolvimento de software
- Equipes de produto e design
- Agências e freelancers organizando projetos com clientes
- Qualquer equipe que precise coordenar projetos com múltiplos passos e colaboradores
- **Escala inicial:** até 20 pessoas testando o produto

---

## 🏗️ Funcionalidades Principais

### 1. Workspaces Compartilhados

Cada workspace é um ambiente isolado que representa um time ou projeto. Funciona de forma similar ao compartilhamento de documentos no Google Docs.

**Como funciona:**
- O criador do workspace gera um **link de convite** único com token seguro
- O link tem configurações de **role**: `admin`, `member` ou `viewer`
- O link pode ter **data de expiração** configurável
- Qualquer pessoa com o link pode entrar fazendo login com Google OAuth
- O acesso é controlado no **backend**, garantindo isolamento total entre workspaces

**Estrutura do workspace:**
- Nome, descrição e avatar/ícone customizável
- Lista de membros com seus respectivos papéis
- Histórico de atividades do workspace
- Configurações de notificação por membro

---

### 2. Projetos e Steps (Etapas)

Dentro de cada workspace existem **projetos**. Cada projeto é composto por uma série de **steps** (etapas), que são a unidade básica de trabalho.

**Um step contém:**
- Título e descrição detalhada
- Status: `pendente`, `em andamento`, `bloqueado`, `concluído`
- Responsável(is) atribuídos
- Prazo (deadline)
- Prioridade: `baixa`, `média`, `alta`, `crítica`
- Tags customizáveis
- Comentários e discussões internas
- Arquivos e anexos
- Sub-steps (checklist de tarefas menores)
- **Histórico de alterações** — quem mudou o quê e quando (via triggers SQL)

**Visualizações disponíveis para os steps:**
- **Kanban** — colunas por status, drag-and-drop
- **Lista** — visão compacta e filtrável
- **Linha do tempo (Gantt)** — visualização de prazos e dependências
- **Calendário** — steps organizados por deadline

---

### 3. Workflows Visuais (Flow Builder)

O Flow Builder permite criar **diagramas de fluxo interativos** que representam o processo de um projeto ou de uma área do negócio.

**Recursos do Flow Builder:**
- Canvas infinito com zoom e pan
- **Nós (nodes)** de diferentes tipos:
  - `Start` / `End` — início e fim do fluxo
  - `Step` — etapa de trabalho, linkável a um step real do projeto
  - `Decision` — nó de decisão com múltiplas saídas (sim/não, opções)
  - `Note` — anotação flutuante no canvas
  - `Group` — agrupa nós relacionados visualmente
- **Conectores** com setas e labels customizáveis
- Cores e ícones configuráveis por nó
- Exportação como imagem (PNG/SVG) ou PDF
- Histórico de versões do fluxo (últimas 30 versões)
- Colaboração em tempo real no canvas (cursores visíveis dos outros membros via WebSocket)

---

### 4. Notas e Orientações (Knowledge Base)

Área de documentação interna do workspace. Funciona como um wiki leve integrado ao projeto.

**Recursos:**
- Editor de texto rico (**TipTap**) com suporte a:
  - Markdown nativo
  - Títulos, listas, tabelas, blocos de código
  - Imagens e embeds
  - Menção de membros com `@nome`
  - Referência a steps com `#step-id`
  - Checklists interativos
  - Callouts (avisos, dicas, alertas)
- **Organização hierárquica**: pastas e subpastas de notas
- **Templates de nota** pré-definidos:
  - Plano de projeto
  - Ata de reunião
  - Documentação técnica
  - Onboarding de novo membro
  - Post-mortem
- **Busca full-text** em todas as notas do workspace
- Histórico de edições com diff visual
- Permissões por nota (pública no workspace, restrita a admins, etc.)
- Exportação para Markdown ou PDF

---

### 5. Notificações e Integrações

**Notificações internas:**
- Sino de notificações na interface
- Notificações por e-mail configuráveis por evento:
  - Atribuição de step
  - Comentário em step que você participa
  - Deadline se aproximando (24h antes)
  - Novo membro no workspace
  - Step concluído por outro membro

**Integrações via MCP:**
- **Gmail MCP** → envio de convites de workspace e notificações de deadline
- **Google Calendar MCP** → sincronização de deadlines de steps com o calendário do usuário; ao marcar um deadline em um step, um evento é criado automaticamente no Calendar

---

### 6. Dashboard e Analytics

Painel de visão geral do workspace com métricas em tempo real.

**Métricas disponíveis:**
- Progresso geral do projeto (% de steps concluídos)
- Velocidade do time (steps concluídos por semana)
- Steps por status (gráfico de pizza)
- Distribuição de carga por membro (quantos steps cada um tem)
- Steps atrasados (vencidos sem conclusão)
- Linha do tempo de atividade (heatmap de contribuições)
- Relatório exportável em PDF

---

## 🔐 Sistema de Permissões

| Role | Criar projetos | Editar steps | Convidar membros | Configurar workspace | Ver analytics |
|------|:--------------:|:------------:|:----------------:|:--------------------:|:-------------:|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Member** | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Viewer** | ❌ | ❌ | ❌ | ❌ | ✅ |

As permissões são enforçadas no **backend Node.js**, garantindo segurança em todas as rotas.

---

## 🛠️ Stack Técnica (Atualizada)

### Linguagens
- **TypeScript** — frontend React e backend Node.js
- **SQL** — banco de dados PostgreSQL e triggers para auditoria
- **HTML/CSS** — via Tailwind no React

### Frontend
| Biblioteca | Uso |
|---|---|
| **React + Vite** | Framework principal da interface |
| **React Flow** | Canvas de workflows visuais |
| **TipTap** | Editor de notas rico |
| **TailwindCSS** | Estilização |
| **Zustand** | Gerenciamento de estado global |
| **React Query** (ou **SWR**) | Cache e sincronização de dados com o backend |
| **Recharts** | Gráficos do dashboard |
| **date-fns** | Manipulação de datas |
| **Socket.io-client** | WebSocket para colaboração em tempo real |

### Backend
| Tecnologia | Uso |
|---|---|
| **Node.js** | Runtime |
| **Express.js** | Framework HTTP |
| **TypeScript** | Tipagem estrita |
| **Passport.js / bcrypt** | Autenticação (E-mail/Senha) |
| **Socket.io** | WebSocket para realtime |
| **node-postgres** (pg) | Cliente PostgreSQL |
| **jsonwebtoken** | Tokens JWT para autenticação |
| **dotenv** | Variáveis de ambiente |
| **cors** | CORS para comunicação frontend-backend |
| **helmet** | Segurança de headers HTTP |

### Banco de Dados & Infraestrutura
| Serviço | Uso |
|---|---|
| **PostgreSQL** (no Railway) | Banco de dados relacional |
| **Railway** | Hosting do backend Node + banco PostgreSQL |
| **Vercel** | Hosting e deploy automático do frontend React |

### Integrações (MCP)
| MCP | Funcionalidade |
|---|---|
| **Gmail MCP** | Envio de convites e notificações por e-mail |
| **Google Calendar MCP** | Sincronização de deadlines com o calendário do usuário |

---

## 🗄️ Modelo de Dados (PostgreSQL)

```sql
-- Usuários (gerenciado pela autenticação)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspaces
CREATE TABLE workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membros do Workspace
CREATE TABLE workspace_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  role TEXT DEFAULT 'member', -- 'admin' | 'member' | 'viewer'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Links de Convite
CREATE TABLE workspace_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  role TEXT DEFAULT 'member',
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id)
);

-- Projetos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Steps (Etapas)
CREATE TABLE steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'in_progress' | 'blocked' | 'done'
  priority TEXT DEFAULT 'medium', -- 'low' | 'medium' | 'high' | 'critical'
  assignee_id UUID REFERENCES users(id),
  deadline TIMESTAMPTZ,
  position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Histórico de Alterações em Steps (Auditoria)
CREATE TABLE step_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id UUID REFERENCES steps(id) ON DELETE CASCADE,
  changed_by UUID REFERENCES users(id),
  field_name TEXT, -- 'status', 'priority', 'assignee_id', etc
  old_value TEXT,
  new_value TEXT,
  changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers para popular step_audit_log automaticamente
CREATE OR REPLACE FUNCTION log_step_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO step_audit_log (step_id, changed_by, field_name, old_value, new_value)
    VALUES (NEW.id, NEW.updated_by, 'status', OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER step_audit_trigger
AFTER UPDATE ON steps
FOR EACH ROW
EXECUTE FUNCTION log_step_changes();

-- Workflows (Flow Builder)
CREATE TABLE workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  flow_json JSONB NOT NULL, -- JSON do React Flow (nodes + edges)
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notas (Knowledge Base)
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES notes(id), -- hierarquia de pastas
  title TEXT NOT NULL,
  content JSONB, -- JSON do TipTap
  created_by UUID REFERENCES users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Histórico de Edições de Notas
CREATE TABLE note_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  content JSONB,
  edited_by UUID REFERENCES users(id),
  edited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comentários em Steps
CREATE TABLE step_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id UUID REFERENCES steps(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Atividades do Workspace (para histórico)
CREATE TABLE workspace_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT, -- 'created_step', 'updated_step', 'completed_step', etc
  entity_type TEXT, -- 'step', 'project', 'note'
  entity_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔗 Arquitetura do Backend (Express)

### Estrutura de Pastas

```
backend/
├── src/
│   ├── server.ts              # Arquivo principal, setup Express + Socket.io
│   ├── config/
│   │   ├── database.ts        # Pool de conexão PostgreSQL
│   │   ├── passport.ts        # Configuração Google OAuth
│   │   └── socket.ts          # Setup Socket.io
│   ├── routes/
│   │   ├── auth.ts            # Login, logout, callback Google
│   │   ├── workspaces.ts      # CRUD workspaces + convites
│   │   ├── projects.ts        # CRUD projetos
│   │   ├── steps.ts           # CRUD steps
│   │   ├── workflows.ts       # CRUD workflows
│   │   ├── notes.ts           # CRUD notas
│   │   └── analytics.ts       # Métricas do workspace
│   ├── middleware/
│   │   ├── auth.ts            # Verificar JWT
│   │   ├── workspace.ts       # Verificar acesso ao workspace
│   │   └── errorHandler.ts    # Tratamento de erros
│   ├── controllers/           # Lógica de negócio de cada rota
│   ├── services/              # Funções reutilizáveis (BD, email, etc)
│   └── types/                 # Tipos TypeScript globais
├── migrations/                # Arquivos SQL para versionamento
├── .env.example
├── package.json
└── tsconfig.json
```

### Rotas Principais (Express)

```
POST   /auth/login             → Login com e-mail e senha
POST   /auth/register          → Registro de novo usuário
POST   /auth/logout            → Logout

GET    /workspaces             → Listar workspaces do usuário
POST   /workspaces             → Criar workspace
GET    /workspaces/:id         → Detalhes do workspace
PUT    /workspaces/:id         → Editar workspace
DELETE /workspaces/:id         → Deletar workspace

POST   /workspaces/:id/invites → Gerar link de convite
POST   /workspaces/join/:token → Aceitar convite e entrar

GET    /projects/:id           → Listar projetos do workspace
POST   /projects               → Criar projeto
PUT    /projects/:id           → Editar projeto

GET    /steps/:projectId       → Listar steps do projeto
POST   /steps                  → Criar step
PUT    /steps/:id              → Editar step (status, assignee, etc)
DELETE /steps/:id              → Deletar step
GET    /steps/:id/audit        → Histórico de alterações do step

GET    /workflows/:projectId   → Listar workflows
POST   /workflows              → Criar workflow
PUT    /workflows/:id          → Atualizar flow JSON

GET    /notes/:workspaceId     → Listar notas
POST   /notes                  → Criar nota
PUT    /notes/:id              → Editar nota
GET    /notes/:id/versions     → Histórico de versões

GET    /analytics/:workspaceId → Métricas do workspace
```

### Socket.io Events (Tempo Real)

```javascript
// Colaboração em canvas (Flow Builder)
socket.on('flow:node-moved', (data) => { /* broadcast */ })
socket.on('flow:updated', (data) => { /* broadcast */ })

// Edição colaborativa de notas
socket.on('note:typing', (data) => { /* broadcast */ })
socket.on('note:updated', (data) => { /* broadcast */ })

// Updates em tempo real de steps
socket.on('step:status-changed', (data) => { /* broadcast */ })
socket.on('step:assigned', (data) => { /* broadcast */ })

// Presença online
socket.on('user:online', (data) => { /* broadcast */ })
socket.on('user:offline', (data) => { /* broadcast */ })
```

---

## 🔗 Rotas da Aplicação (Frontend)

```
/                          → Landing page / login
/dashboard                 → Lista de workspaces do usuário
/workspace/:id             → Dashboard do workspace
/workspace/:id/projects    → Lista de projetos
/workspace/:id/project/:pid → Detalhes do projeto (kanban, lista, timeline)
/workspace/:id/flow/:fid   → Flow Builder (editor de workflow)
/workspace/:id/notes       → Knowledge Base
/workspace/:id/notes/:nid  → Nota específica
/workspace/:id/analytics   → Dashboard de métricas
/workspace/:id/settings    → Configurações do workspace
/join/:token               → Página de aceite de convite
```

---

## 🚀 Ordem de Implementação

1. **Setup base** — Node + Express + PostgreSQL no Railway, React + Vite, Vercel
2. **Autenticação** — Google OAuth via Passport, JWT tokens, sessions
3. **Workspaces** — CRUD de workspaces, listagem no dashboard
4. **Sistema de convites** — Geração de token, página `/join/:token`, aceitação
5. **Projetos e Steps** — CRUD completo, visualização Kanban
6. **Notas** — Editor TipTap, hierarquia de pastas, busca
7. **Flow Builder** — Canvas React Flow, salvar/carregar JSON no banco
8. **Realtime** — Socket.io para colaboração em canvas e notas
9. **Auditoria** — Triggers SQL para histórico de alterações de steps
10. **Notificações** — Sistema interno + e-mail via Gmail MCP
11. **Google Calendar** — Sincronização de deadlines via Google Calendar MCP
12. **Analytics** — Dashboard com métricas e gráficos (Recharts)
13. **Polish** — Responsividade mobile, temas claro/escuro, onboarding

---

## 📁 Estrutura de Pastas do Projeto

```
/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Componentes base (Button, Input, Modal...)
│   │   │   ├── workspace/        # Componentes de workspace e membros
│   │   │   ├── project/          # Kanban, lista, timeline
│   │   │   ├── flow/             # Flow Builder (React Flow)
│   │   │   ├── notes/            # Editor TipTap e knowledge base
│   │   │   └── dashboard/        # Analytics e métricas
│   │   ├── pages/                # Rotas da aplicação
│   │   ├── stores/               # Estado global (Zustand)
│   │   ├── hooks/                # Custom hooks (useWorkspace, useSteps...)
│   │   ├── lib/
│   │   │   ├── api.ts            # Cliente HTTP (axios/fetch) pro backend
│   │   │   └── socket.ts         # Socket.io client
│   │   └── types/                # Tipos TypeScript globais
│   ├── vite.config.ts
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── types/
│   ├── migrations/
│   ├── .env.example
│   └── package.json
└── docs/                     # Esta pasta de orientações para IAs
    └── PRODUCT_OVERVIEW.md
```

---

## 🔌 Integrando PostgreSQL no Sistema

### 1. Criar o Banco no Railway

1. Acesse **railway.app** e logue com sua conta GitHub
2. Crie um novo projeto
3. Selecione **PostgreSQL** como serviço
4. Railway provisiona a instância automaticamente
5. Você recebe uma **connection string**:
   ```
   postgresql://user:password@host:5432/railway
   ```

### 2. Conectar Backend Node ao PostgreSQL

No seu projeto backend, instale a biblioteca **`pg`**:

```bash
npm install pg
```

Crie um arquivo de configuração `src/config/database.ts`:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Testar conexão
pool.on('error', (err) => {
  console.error('Erro no pool de conexão:', err);
});

export default pool;
```

No arquivo `.env` do backend:
```
DATABASE_URL=postgresql://user:password@host:5432/railway
NODE_ENV=development
PORT=3000
```

### 3. Criar Schema (Tabelas)

**Opção A: Via UI do Railway (rápido)**
1. No painel do Railway, acesse o PostgreSQL
2. Clique em **"Connect"**
3. Use um SQL client (DBeaver, pgAdmin, ou terminal)
4. Cole todo o SQL do schema descrito na seção "Modelo de Dados"

**Opção B: Via Migrations (recomendado)**

Crie uma pasta `backend/migrations/` e um arquivo `001_initial_schema.sql`:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ... (copie todas as outras tabelas do schema definido acima)
```

Execute via script npm ou CLI:
```bash
psql $DATABASE_URL < migrations/001_initial_schema.sql
```

### 4. Usar Dados nas Rotas Express

Exemplo de rota simples:

```typescript
// src/routes/users.ts
import express from 'express';
import pool from '../config/database';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Listar usuários de um workspace
router.get('/workspace/:workspaceId/users', authenticate, async (req, res) => {
  try {
    const { workspaceId } = req.params;
    
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, wm.role 
       FROM users u 
       JOIN workspace_members wm ON u.id = wm.user_id 
       WHERE wm.workspace_id = $1`,
      [workspaceId]
    );
    
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar novo usuário
router.post('/users', authenticate, async (req, res) => {
  try {
    const { email, name, avatar_url } = req.body;
    
    const result = await pool.query(
      `INSERT INTO users (id, email, name, avatar_url) 
       VALUES (gen_random_uuid(), $1, $2, $3) 
       RETURNING *`,
      [email, name, avatar_url]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
```

### 5. Chamar Dados do Frontend React

No frontend, nunca acesse o banco diretamente — sempre via backend:

```typescript
// src/hooks/useUsers.ts
import { useQuery } from 'react-query';
import axios from 'axios';

export const useUsers = (workspaceId: string) => {
  return useQuery(['users', workspaceId], async () => {
    const response = await axios.get(`/api/users/workspace/${workspaceId}`);
    return response.data;
  });
};
```

Uso no componente:

```typescript
// src/components/UserList.tsx
import { useUsers } from '../hooks/useUsers';

export default function UserList({ workspaceId }: Props) {
  const { data: users, isLoading } = useUsers(workspaceId);
  
  if (isLoading) return <div>Carregando...</div>;
  
  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name} ({user.email})</li>
      ))}
    </ul>
  );
}
```

### 6. Fluxo Completo de Dados

```
React Frontend (React Query)
  ↓ axios.get('/api/users/workspace/:id')
Express Backend (src/routes/users.ts)
  ↓ pool.query('SELECT ...')
PostgreSQL (Railway)
  ↓ retorna dados
Backend → responde JSON
  ↓
React Frontend recebe e renderiza
```

### 7. Verificar Conexão

**Via Terminal PostgreSQL:**
```bash
psql postgresql://user:password@host:5432/railway
SELECT * FROM users;
```

**Via Logging no Backend:**
```typescript
const result = await pool.query('SELECT COUNTSHIFT FROM users');
console.log('Total de usuários:', result.rows[0].count);
```

**Via Request HTTP:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/users/workspace/:id
```

### 8. Deploy no Railway

1. **Backend**: Push seu código no GitHub
2. Railway detecta automaticamente `package.json`
3. Instala dependências, executa `npm start`
4. Backend conecta ao PostgreSQL (mesma instância Railway)
5. Variáveis de ambiente (`DATABASE_URL`) já estão configuradas no Railway

**Nenhum setup manual** — tudo automático após conectar GitHub.

### 9. Boas Práticas

- ✅ **Sempre validar inputs** antes de inserir no banco
- ✅ **Usar prepared statements** (`$1`, `$2`) para evitar SQL injection
- ✅ **Erro handling** em todas as queries
- ✅ **Índices** em colunas consultadas frequentemente
- ✅ **Connection pooling** (já vem com `pg`)
- ✅ **Migrations versionadas** — nunca modifique schema direto em produção

---

## 🤖 Instruções para IAs que trabalharem neste projeto

### Tecnologia & Código

- **Sempre use TypeScript** com tipagem estrita em frontend e backend, evite `any`
- **Backend é Node.js + Express** — não use Supabase, não crie serverless functions em outro lugar
- **PostgreSQL** é o único banco de dados — não tente adicionar outros (Redis, MongoDB, etc)
- **Autenticação via Passport.js** — usando estratégia local (e-mail/senha) e bcrypt para hashing de senhas.
- **Socket.io** para toda comunicação realtime — nunca polling com setInterval
- **React Query** para todo fetch de dados no frontend — não use `useEffect` + fetch manual
- **Tailwind** para todo o CSS — não crie arquivos `.css` customizados salvo casos excepcionais

### Segurança & Dados

- **Validar permissões no backend** em toda rota — nunca confiar apenas no frontend
- **Isolamento por workspace** é crítico — uma query sempre deve filtrar por `workspace_id`
- **Tokens JWT** devem ser validados em cada request autenticado
- **Datas e deadlines** devem sempre ser armazenadas em UTC no banco e convertidas para timezone do usuário no frontend
- **Senhas devem ser armazenadas com hash** (bcrypt) — nunca em texto puro.

### Banco de Dados

- **Triggers SQL** devem ser usados para auditoria automática (histórico de alterações)
- **Índices** em colunas frequentemente consultadas (`workspace_id`, `user_id`, `project_id`, `step_id`)
- **Migrations** sempre versionadas em arquivos SQL separados, nunca modificar schema direto
- **Foreign keys** com `ON DELETE CASCADE` quando apropriado

### Frontend

- **Estado global** (Zustand) apenas para dados transversais (usuário logado, workspace atual)
- **State local** em componentes para UI (formulários, menus, modais)
- **React Flow** — respeitar o formato `{ nodes: Node[], edges: Edge[] }` conforme tipagem oficial
- **TipTap** — serializar/desserializar conteúdo sempre como JSON, não markdown bruto

### Backend

- **Express middlewares** para autenticação, validação CORS, tratamento de erros
- **Separação de responsabilidades**: routes → controllers → services
- **Validar inputs** com bibliotecas como `joi` ou `zod`
- **Documentar rotas** com comentários JSDoc para facilitar manutenção

### Deploy

- **Variáveis de ambiente** via `.env` — nunca hardcode secrets
- **Railway detecta automaticamente** — basta ter `package.json` na raiz do projeto
- **Vercel** também detecta automaticamente — basta ter `vite.config.ts` e `package.json` corretos
- **Migrations** podem ser rodadas manualmente via CLI ou via script no CI/CD

---

## 🎯 MVP (Minimum Viable Product)

Para lançar pra 20 pessoas testando, priorize:

1. ✅ Workspaces + convites
2. ✅ Projetos + Steps (Kanban básico)
3. ✅ Notas simples
4. ✅ Autenticação Google
5. ⏳ Flow Builder (pode vir depois)
6. ⏳ Analytics (pode vir depois)
7. ⏳ Notificações por e-mail (pode vir depois)

O essencial é: **gerenciar steps, documentar em notas, compartilhar o workspace**. O resto é valor agregado.

---

*Última atualização: Março 2026*
*Stack: Node.js + Express (Railway) | React + Vite (Vercel) | PostgreSQL (Railway)*
