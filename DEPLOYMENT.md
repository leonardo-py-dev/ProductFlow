# 🚀 Deployment Guide - ProductFlow

Este guia completo explica como fazer deploy da aplicação ProductFlow no Railway (backend) e Vercel (frontend).

---

# 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Preparação do Projeto](#preparação-do-projeto)
3. [Deploy no Railway (Backend)](#deploy-no-railway-backend)
4. [Deploy no Vercel (Frontend)](#deploy-no-vercel-frontend)
5. [Conexão Backend + Frontend](#conexão-backend--frontend)
6. [Testes de Integração](#testes-de-integração)
7. [Troubleshooting](#troubleshooting)

---

## Visão Geral

### Stack Tecnológico

| Serviço | Stack | Por que |
|---------|-------|---------|
| **Backend** | Node.js + Express + PostgreSQL | Escalável, serverless-friendly |
| **Frontend** | React + Vite + TypeScript | Rápido, moderno, SSR-ready |
| **Autenticação** | JWT | Stateless, fácil de escalar |
| **Deploy** | Railway + Vercel | Servidorless, automático, grátis para pequenos projetos |

### Arquitetura

```
┌─────────────────┐
│   Frontend      │
│   (Vercel)      │
│  localhost:5173 │
└────────┬────────┘
         │ API calls
         ↓
┌─────────────────┐
│   Backend       │
│   (Railway)     │
│  localhost:3000 │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   PostgreSQL    │
│   (Railway)     │
│   Database      │
└─────────────────┘
```

---

## Preparação do Projeto

### 1. Instalar Dependências Faltantes

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configurar Banco de Dados Local (Opcional)

Se preferir testar local antes do deploy:

```bash
# Windows com WSL
docker run --name postgres-productflow \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=railway \
  -p 5432:5432 \
  -d postgres

# Ou use Railway gratuitamente sem configurar nada
```

### 3. Testar Ambiente Local

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Teste as rotas:
```bash
# Registro
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Local",
    "email": "teste@productflow.com",
    "password": "Senha123456!"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@productflow.com",
    "password": "Senha123456!"
  }'
```

---

# Deploy no Railway (Backend)

## 🔧 Configurações Já Feitas

O backend já está configurado para Railway! Verifique:

### ✅ `.railway.yaml`
- [x] Configuração de serviço web Node.js
- [x] Porta configurada (3000)
- [x] Variáveis de ambiente automáticas
- [x] FRONTEND_URL configurada

### ✅ `package.json`
- [x] Scripts `start` e `build` definidos
- [x] Dependências limpas (sem socket.io)
- [x] TypeScript build configurado

### ✅ `server.ts`
- [x] CORS dinâmico configurado
- [x] Helmet para segurança
- [x] Middleware organizado

### ✅ `.env.example`
- [x] Documentação completa
- [x] Exemplos para Railway e desenvolvimento

---

## Passo a Passo

### Passo 1: Criar Repositório no GitHub

#### Opção A: Usar terminal (Recomendado)

```bash
# Ir para a pasta raiz do projeto
cd /c/Users/Leo/OneDrive/\0411rea\ de\ Trabalho/ProductFlow

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Commit inicial
git commit -m "Prepare backend for Railway deployment"

# Renomear branch para main
git branch -M main

# Verificar status
git status
```

#### Opção B: No GitHub
1. Crie um novo repositório no GitHub (vazio)
2. Copie o URL (HTTPS ou SSH)
3. Faça push:
```bash
git remote add origin https://github.com/seu-usuario/productflow-backend.git
git push -u origin main
```

### Passo 2: Criar Projeto no Railway

1. Acesse https://railway.app
2. Clique em **"New Project"**
3. Selecione **"Deploy from Git repo"**
4. Conecte sua conta do GitHub
5. Selecione o repositório que você criou
6. Railway vai mostrar um resumo do deploy
7. Clique em **"Deploy"**

### Passo 3: Adicionar PostgreSQL no Railway

#### Opção A: Automático (Recomendado)

Quando você cria o projeto, Railway vai perguntar:
```
Add PostgreSQL?
[ ] Yes
[ ] No
```

Selecione **Yes**. Railway vai:
- ✅ Criar automaticamente um serviço PostgreSQL
- ✅ Criar variável DATABASE_URL
- ✅ Fazer deploy do backend

#### Opção B: Manual

1. No Railway Dashboard, clique em **"New"**
2. Selecione **"PostgreSQL"**
3. Railway cria automaticamente o banco
4. Anote as informações que aparecem

### Passo 4: Configurar Variáveis de Ambiente

No Railway Dashboard → **Settings** → **Variables**:

#### Variáveis Existentes (já configuradas no .railway.yaml):

- ✅ `PORT` = `3000`
- ✅ `NODE_ENV` = `production`
- ✅ `JWT_SECRET` = gerado automaticamente (seguro)
- ✅ `FRONTEND_URL` = `https://productflow-frontend.up.railway.app`

#### O que verificar:
1. Verifique se `FRONTEND_URL` está correto
2. Se necessário, adicione/remova outras variáveis

#### Alternativa: Manual no .railway.yaml

Edite o `.railway.yaml`:
```yaml
services:
  - type: web
    name: productflow-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: PORT
        value: 3000
      - key: NODE_ENV
        value: production
      - key: JWT_SECRET
        generateValue: true
      - key: FRONTEND_URL
        value: https://seu-frontend.up.railway.app  # Atualize aqui
```

### Passo 5: Monitorar o Deploy

Railway vai automaticamente:
1. Instalar dependências (`npm install`)
2. Build TypeScript (`npm run build`)
3. Iniciar servidor (`npm start`)

No Railway Dashboard:
- Verifique **Logs** para ver o progresso
- Quando verde ✓, o backend está online

**URL do backend no Railway:** `https://seu-app-id.railway.app`

### Passo 6: Testar Backend Deployado

```bash
# Health check
curl https://seu-app-id.railway.app/health

# Espera resposta:
# {"status":"ok","timestamp":"2024-04-24T16:00:00.000Z"}

# Registrar usuário
curl -X POST https://seu-app-id.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Usuário Railway",
    "email": "test@productflow.com",
    "password": "Senha123456!"
  }'

# Login
curl -X POST https://seu-app-id.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@productflow.com",
    "password": "Senha123456!"
  }'
```

---

# Deploy no Vercel (Frontend)

## 🎯 Por que Vercel?

- ✅ Deploy automático do Git
- ✅ CDN global
- ✅ SSL gratuito
- ✅ Hosting estático (React + Vite)
- ✅ Integração com GitHub
- ✅ Preview deployments
- ✅ Hot reload no desenvolvimento

---

## Passo a Passo

### Passo 1: Preparar Frontend para Vercel

#### 1.1 Criar `.env` para Vercel

No frontend, crie um arquivo `.env`:
```bash
cd frontend

# Criar arquivo .env
cat > .env << 'EOF'
# Ambiente de Produção (Vercel)
VITE_API_URL=https://seu-backend-id.railway.app

# Ambiente de Desenvolvimento Local (Opcional)
# VITE_API_URL=http://localhost:3000
EOF

# Para desenvolvimento local, criar .env.local
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:3000
EOF
```

#### 1.2 Verificar Tailwind CSS

**Vercel é compatível com Tailwind CSS v4!**

O arquivo `index.css` já está configurado para usar a sintaxe correta:
```css
@import "tailwindcss";
```

**Caso precise configuar Tailwind:**

Crie `tailwind.config.ts` na raiz do frontend:
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#aa3bff',
        secondary: '#c084fc',
        dark: '#16171d',
        light: '#f3f4f6',
        border: '#e5e4e7',
        darkBorder: '#2e303a',
      },
    },
  },
  plugins: [],
} satisfies Config
```

Crie `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### 1.3 Verificar Vite Config

O arquivo `vite.config.ts` já está configurado corretamente:
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
```

---

### Passo 2: Criar Repositório no GitHub

**Se ainda não criou o repositório:**

```bash
cd /c/Users/Leo/OneDrive/\0411rea\ de\ Trabalho/ProductFlow

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Commit
git commit -m "Prepare frontend for Vercel deployment"

# Renomear branch
git branch -M main

# Adicionar remote (se ainda não tem)
git remote add origin https://github.com/seu-usuario/productflow-frontend.git

# Push
git push -u origin main
```

Ou crie manualmente no GitHub e depois faça push.

---

### Passo 3: Criar Projeto no Vercel

#### Opção A: Via Web (Recomendado)

1. Acesse https://vercel.com
2. Clique em **"Add New..."** → **"Project"**
3. Selecione **"Import Git Repository"**
4. Conecte sua conta do GitHub
5. Selecione o repositório do frontend
6. Vercel vai detectar automaticamente:
   - Framework: React
   - Build command: `npm run build`
   - Output directory: `.`
   - Install command: `npm install`

#### Opção B: Via Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd frontend
vercel --prod

# Ou criar deploy preview
vercel
```

---

### Passo 4: Configurar Vercel (Passo a Passo)

#### 4.1 Setup Básico

1. Vercel vai pedir para **Clone** ou **Importar** repositório
2. Clique em **Continue**
3. Vercel vai pedir para **Create Project**:
   - Framework Preset: React (já selecionado)
   - Root Directory: `./` (já padrão)
   - Build Command: `npm run build` (já padrão)
   - Output Directory: `.` (já padrão)
   - Install Command: `npm install` (já padrão)

Clique em **Create**

#### 4.2 Configurar Variáveis de Ambiente

Vá em **Settings** → **Environment Variables**:

Adicione a variável:
```
Name: VITE_API_URL
Value: https://seu-backend-id.railway.app
Environment: Production, Preview, Development
```

**Importante:** Na Vercel, as variáveis de ambiente começam com `VITE_`

#### 4.3 Linkar Repositório

1. No Vercel Dashboard, clique no projeto
2. Vá em **Settings** → **Git**
3. Configure **Automatic Builds**:
   - Branches: `main` (clique no +/-)
   - Auto-deploy: On

#### 4.4 Deploy

1. Vá em **Deployments**
2. Clique em **Redeploy** → **Deploy**
3. Aguarde ~2-3 minutos

**URL do frontend no Vercel:** `https://productflow-frontend.vercel.app`

---

# Conexão Backend + Frontend

## Configuração de CORS

### Backend (Railway) - ✅ JÁ CONFIGURADO

Verifique `server.ts`:
```typescript
const corsOptions = {
  origin: (origin: string | undefined, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
```

### Frontend (Vercel) - Configuração Necessária

Atualize `src/stores/authStore.ts`:

```typescript
// src/stores/authStore.ts

// Obter URL da API do ambiente (com fallback para local)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const register = async (name: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao registrar');
  }

  return response.json();
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao fazer login');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);

  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const verifyToken = async (token: string) => {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token inválido ou expirado');
  }

  return response.json();
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  login: async (email: string, password: string) => {
    try {
      const data = await login(email, password);
      set({
        user: data.user,
        token: data.token,
        loading: false,
      });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const data = await register(name, email, password);
      set({
        user: data.user,
        token: data.token,
        loading: false,
      });
      return data;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  logout: () => {
    logout();
    set({ user: null, token: null, loading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const user = await verifyToken(token);
      set({ user, token, loading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, loading: false });
    }
  },
}));
```

---

# Testes de Integração

## Teste Completo

### 1. Deploy do Backend (Railway)

```bash
# Health check
curl https://seu-backend.railway.app/health

# Espera:
# {"status":"ok","timestamp":"..."}
```

### 2. Deploy do Frontend (Vercel)

A URL será algo como: `https://productflow-frontend.vercel.app`

### 3. Teste de Integração no Navegador

1. Acesse o frontend: `https://productflow-frontend.vercel.app`
2. Clique em **"Register"**
3. Preencha os dados:
   - Name: `Usuário Teste`
   - Email: `teste@productflow.com`
   - Password: `Senha123456!`
4. Clique em **"Cadastrar"**
5. Você deve ser redirecionado para `/dashboard` ou `/login`

### 4. Teste de Login

1. Acesse `/login`
2. Preencha os dados:
   - Email: `teste@productflow.com`
   - Password: `Senha123456!`
3. Clique em **"Entrar"**
4. Você deve ser redirecionado para `/dashboard`

### 5. Verificar no Console

No navegador (F12), verifique:
- ✅ Token salvo no localStorage
- ✅ User autenticado
- ✅ Mensagens do backend recebidas

### 6. API Calls

No console:
```javascript
// Verificar token
console.log(localStorage.getItem('token'));

// Fazer request manual
fetch('https://seu-backend.railway.app/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
}).then(r => r.json()).then(console.log)
```

---

# Troubleshooting

## Backend Issues

### ❌ Erro: "DATABASE_URL não configurado"

**Solução:**
1. No Railway Dashboard, vá em **Settings** → **Variables**
2. Adicione a variável `DATABASE_URL`
3. Railway deve ter gerado automaticamente, se não, crie manualmente

### ❌ Erro: "ECONNREFUSED" ao conectar PostgreSQL

**Solução:**
1. Verifique se PostgreSQL service está ativo no Railway
2. Verifique se `DATABASE_URL` está configurado corretamente
3. Reinicie o PostgreSQL service no Railway Dashboard

### ❌ Erro: "JWT_SECRET não configurado"

**Solução:**
1. No Railway Dashboard, vá em **Settings** → **Variables**
2. Adicione `JWT_SECRET` (ou deixe Railway gerar automaticamente)

### ❌ CORS error no frontend

**Solução:**
1. Verifique se `FRONTEND_URL` está configurada no Railway
2. Verifique se CORS está aceitando a URL do frontend
3. No `server.ts`, adicione a URL correta na lista `allowedOrigins`

### ❌ Deploy falha no Railway

**Solução:**
1. Verifique os logs no Railway Dashboard
2. Vá em **Deployments** → clique no deploy falhado
3. Verifique **Build Logs** e **Deploy Logs**
4. Erro comum: dependências não instaladas
5. Solução: Ensure `npm install` está no `buildCommand`

---

## Frontend Issues

### ❌ Erro: "fetch failed" ou "Network Error"

**Solução:**
1. Verifique se `VITE_API_URL` está configurada no Vercel
2. Verifique se o backend está online
3. Verifique no navegador (F12) → Console → Network
4. Verifique se o CORS está configurado no backend

### ❌ Erro: "404 Not Found" nas chamadas de API

**Solução:**
1. Verifique se `VITE_API_URL` está correto
2. Verifique se a rota está acessível: `https://seu-backend.railway.app/api/auth/me`
3. Verifique se as chamadas estão usando a URL correta:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL
   const response = await fetch(`${API_URL}/api/auth/me`)
   ```

### ❌ Erro: "502 Bad Gateway" no frontend

**Solução:**
1. Backend está offline ou sobrecarregado
2. Verifique o status no Railway Dashboard
3. Re-deploy no Railway se necessário

### ❌ Tailwind não carregando

**Solução:**
1. Verifique se `tailwind.config.ts` existe na raiz do frontend
2. Verifique se `.css` está importando Tailwind:
   ```css
   @import "tailwindcss";
   ```
3. Limpe o cache do navegador e Vercel
4. Force re-deploy no Vercel

### ❌ Build fails no Vercel

**Solução:**
1. Verifique **Build Logs** no Vercel Dashboard
2. Erro comum: dependências não instaladas
3. Verifique `package.json` scripts
4. Teste localmente antes de deploy:
   ```bash
   npm run build
   npm run preview
   ```

---

## Integração Issues

### ❌ Frontend não conecta no backend

**Solução:**
1. Verifique a URL da API no frontend:
   ```typescript
   console.log(import.meta.env.VITE_API_URL)
   ```
2. Verifique se o backend está online: `https://seu-backend.railway.app/health`
3. Verifique CORS no backend
4. Teste a URL diretamente no navegador

### ❌ Token não é salvo ou não é enviado

**Solução:**
1. Verifique se localStorage está funcionando no navegador
2. Verifique se o token está sendo enviado no header:
   ```typescript
   headers: { 'Authorization': `Bearer ${token}` }
   ```
3. Verifique se CORS permite credentials
4. Verifique se a API está aceitando o token

### ❌ Login funciona mas não autentica

**Solução:**
1. Verifique se o token está sendo armazenado: `localStorage.setItem('token', token)`
2. Verifique se a aplicação verifica o token ao carregar
3. Verifique se middleware está protegendo as rotas

---

## Performance Issues

### ❌ Site lento no frontend

**Solução:**
1. Vercel tem CDN global, mas teste localmente
2. Verifique tamanho dos assets
3. Use lazy loading para componentes grandes
4. Otimize imagens
5. Verifique a versão da biblioteca (use versões estáveis)

### ❌ Backend responde lentamente

**Solução:**
1. Verifique o desempenho do PostgreSQL no Railway
2. Verifique se há queries não indexadas
3. Otimize as rotas
4. Implemente caching se necessário
5. Verifique se não há latência na rede

---

## Deploy Issues

### ❌ Vercel não faz deploy automático

**Solução:**
1. Vá em **Settings** → **Git** → **Automatic Builds**
2. Verifique se `main` branch está selecionado
3. Verifique se o repositório está conectado
4. Forçar redeploy manual:
   - Vercel Dashboard → Deployments → Click 3 dots → Redeploy

### ❌ Vercel deploy falha

**Solução:**
1. Verifique logs no Vercel Dashboard
2. Verifique **Deploy Logs**
3. Teste localmente: `npm run build`
4. Verifique package.json scripts
5. Verifique se há conflitos de branch

### ❌ Railway não faz deploy automático

**Solução:**
1. Railway é mais manual, precisa de push manual
2. Faça `git push origin main`
3. Railway vai fazer deploy automaticamente
4. Verifique o status no Railway Dashboard
5. Verifique se `.railway.yaml` está correto

---

## Checklist Final

### Deploy Backend (Railway)
- [ ] Repositório no GitHub
- [ ] Projeto no Railway criado
- [ ] PostgreSQL adicionado ao Railway
- [ ] Variáveis de ambiente configuradas:
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET
  - [ ] FRONTEND_URL
  - [ ] PORT
  - [ ] NODE_ENV
- [ ] Deploy no Railway
- [ ] Backend online (`/health` responde)
- [ ] Health check bem-sucedido

### Deploy Frontend (Vercel)
- [ ] Repositório no GitHub
- [ ] Variável de ambiente configurada:
  - [ ] `VITE_API_URL` (URL do Railway)
- [ ] Projeto no Vercel criado
- [ ] Vercel detectou o framework (React)
- [ ] Vercel deploy feito
- [ ] Frontend online
- [ ] URL acessível

### Integração
- [ ] CORS configurado no backend
- [ ] Backend e Frontend conversando
- [ ] Teste de registro bem-sucedido
- [ ] Teste de login bem-sucedido
- [ ] Token autenticado
- [ ] Acesso ao dashboard
- [ ] Em desenvolvimento local funciona

### Testes
- [ ] Registro de novo usuário
- [ ] Login com credenciais
- [ ] Logout e re-login
- [ ] Token funciona em chamadas de API
- [ ] Dashboard acessível
- [ ] CSRF proteção (opcional)

---

## Recursos Adicionais

### Documentação Oficial

- [Railway Documentation](https://docs.railway.app)
- [Railway PostgreSQL](https://docs.railway.app/connections/databases/postgresql)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel React](https://vercel.com/docs/frameworks/react)
- [Railway GitHub](https://github.com/railwayapp/railway)
- [Vercel GitHub](https://github.com/vercel/vercel)

### Troubleshooting Forums

- [Railway Community](https://forum.railway.app)
- [Vercel Community](https://vercel.community)
- [Vercel Status](https://www.vercel-status.com)

### Ferramentas

- [Railway Dashboard](https://railway.app/dashboard)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [PostgresClient](https://node-postgres.com/)

---

## Conclusão

Com este guia, você deve conseguir fazer deploy completo da aplicação ProductFlow no Railway (backend) e Vercel (frontend). Ambos têm documentação excelente e suporte.

**Principais pontos:**

1. Railway cuida do backend e PostgreSQL
2. Vercel cuida do frontend
3. CORS precisa estar configurado corretamente
4. Teste local antes de deploy
5. Verifique logs sempre que houver problemas

**Tempo estimado de deploy:**

- Backend (Railway): ~5-10 minutos
- Frontend (Vercel): ~3-5 minutos
- Integração e testes: ~10-15 minutos
- **Total:** ~20-30 minutos

---

Boa sorte com seu deploy! 🚀

Se tiver dúvidas, consulte este guia ou verifique a documentação oficial dos serviços.