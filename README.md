# 🚀 ProductFlow

ProductFlow é uma plataforma web de produtividade colaborativa voltada para times pequenos de desenvolvimento e equipes multidisciplinares. Funciona como um hub central combinando organização de tarefas, workflows visuais e base de conhecimento.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React, Vite, TypeScript, TailwindCSS (v4), Zustand, Axios.
- **Backend:** Node.js, Express (v5), TypeScript, PostgreSQL, JWT, Bcrypt.
- **Banco de Dados:** PostgreSQL.

---

## 💻 Configuração do Ambiente de Desenvolvimento

Siga os passos abaixo para rodar o projeto localmente em uma nova máquina.

### 1. Pré-requisitos

Certifique-se de ter os seguintes itens instalados na sua máquina:
- [Node.js](https://nodejs.org/) (versão 20+ recomendada)
- [PostgreSQL](https://www.postgresql.org/) (instalado localmente ou um banco de dados em nuvem, como o [Railway](https://railway.app/))
- Git

### 2. Clonando o Repositório

No seu terminal, clone o repositório e entre na pasta:

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd ProductFlow
```

### 3. Configurando o Banco de Dados (PostgreSQL)

1. Crie um banco de dados no PostgreSQL chamado `productflow` (ou o nome de sua preferência).
2. Execute o script SQL localizado em `backend/migrations/001_initial_schema.sql` para criar todas as tabelas e triggers necessários:
   
   ```bash
   # Exemplo via CLI (ajuste as credenciais conforme necessário)
   psql -U seu_usuario -d nome_do_banco < backend/migrations/001_initial_schema.sql
   ```

### 4. Configurando o Backend

1. Entre na pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Crie o arquivo de variáveis de ambiente:
   - Duplique o arquivo `.env.example` e renomeie a cópia para `.env` (ou apenas crie um arquivo `.env`).
   - Edite o arquivo `.env` com as suas configurações locais:

   ```env
   PORT=3000
   DATABASE_URL=postgresql://seu_usuario:sua_senha@localhost:5432/nome_do_banco
   JWT_SECRET=coloque_uma_senha_forte_aqui
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O backend estará rodando em `http://localhost:3000`.*

### 5. Configurando o Frontend

1. Abra um **novo terminal** na raiz do projeto e entre na pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O frontend estará rodando em `http://localhost:5173`.*

---

## 📁 Estrutura de Pastas

```text
ProductFlow/
├── backend/                  # API em Node.js/Express
│   ├── migrations/           # Scripts SQL do banco de dados
│   ├── src/
│   │   ├── config/           # Configuração de Banco, etc.
│   │   ├── controllers/      # Lógica das rotas (ex: authController)
│   │   ├── routes/           # Definição dos endpoints
│   │   └── server.ts         # Ponto de entrada do backend
│   └── package.json
├── docs/                     # Documentação de referência do projeto
│   └── PRODUCT_OVERVIEW.md   # Visão Geral e Arquitetura do sistema
└── frontend/                 # Aplicação React
    ├── src/
    │   ├── pages/            # Telas (Landing, Login, Register, etc.)
    │   ├── stores/           # Gerenciamento de estado (Zustand)
    │   ├── App.tsx           # Roteamento
    │   └── index.css         # Importações do Tailwind
    ├── tailwind.config.ts    # Tema e customizações visuais
    ├── vite.config.ts        # Configurações do empacotador
    └── package.json
```

---

## 📝 Documentação de Referência

Para entender a visão arquitetural, requisitos de produto e detalhes do banco de dados, consulte sempre o documento **[Visão Geral do Produto (docs/PRODUCT_OVERVIEW.md)](./docs/PRODUCT_OVERVIEW.md)** localizado neste repositório.
