# 🚀 Backend ProductFlow

## 📋 Overview

Backend da aplicação ProductFlow construído com Node.js, Express, TypeScript, PostgreSQL e autenticação com JWT.

## 🛠️ Tecnologias

- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Linguagem
- **PostgreSQL** - Banco de dados
- **bcrypt** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT
- **helmet** - Segurança HTTP
- **cors** - CORS middleware

## 📁 Estrutura

```
backend/
├── .env                    # Variáveis de ambiente
├── .env.example            # Exemplo de variáveis
├── .railway.yaml           # Configuração Railway
├── package.json            # Dependências
├── tsconfig.json           # Configuração TypeScript
├── src/
│   ├── config/
│   │   └── database.ts     # Configuração PostgreSQL
│   ├── controllers/
│   │   └── authController.ts  # Lógica de autenticação
│   ├── middlewares/
│   │   └── authMiddleware.ts  # Middleware JWT
│   ├── models/
│   │   └── User.ts         # Modelo de usuário
│   ├── routes/
│   │   └── authRoutes.ts   # Rotas de autenticação
│   ├── server.ts           # Configuração Express
│   └── types/
│       └── index.ts        # Tipos TypeScript
└── migrations/
    └── 001_initial_schema.sql  # Schema do banco
```

## 🚦 Endpoints Disponíveis

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login com email/senha
- `POST /api/auth/logout` - Logout (limpa token)
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Ver informações do usuário (protegido)

### User
- `GET /api/user/:id` - Obter usuário por ID (protegido)
- `PATCH /api/user/:id` - Atualizar usuário (protegido)
- `DELETE /api/user/:id` - Deletar usuário (protegido)

## 🔐 Variáveis de Ambiente

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/railway

# JWT
JWT_SECRET=sua_chave_secreta_aqui_segura_123

# Frontend URL
FRONTEND_URL=https://productflow-frontend.up.railway.app
```

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Rodar migrations
psql $DATABASE_URL -f migrations/001_initial_schema.sql

# Iniciar servidor em desenvolvimento
npm run dev

# Iniciar servidor em produção
npm start
```

## 🧪 Testes de Integração

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "Senha123456!"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "Senha123456!"
  }'

# Obter usuário (token no header Authorization)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <SEU_TOKEN>"
```

## 🚀 Deploy no Railway

Veja [DEPLOYMENT.md](../DEPLOYMENT.md) para instruções detalhadas.

## 🛡️ Segurança

- ✅ Senhas hasheadas com bcrypt (10 salt rounds)
- ✅ JWT com expiração de 7 dias
- ✅ Helmet para headers de segurança
- ✅ CORS configurado
- ✅ Validação de entrada
- ✅ Banco de dados protegido com credentials

## 🐛 Troubleshooting

### Erro: "DATABASE_URL não configurado"
- Verifique arquivo `.env`
- Configure variável de ambiente corretamente

### Erro: "JWT_SECRET não configurado"
- Configure `JWT_SECRET` no `.env`
- Use: `openssl rand -base64 32` para gerar segredo

### Erro: "Porta já em uso"
- Altere `PORT` no `.env`
- Ou encerre outro processo na porta

## 📝 Licença

MIT

---

Desenvolvido com ❤️ para ProductFlow