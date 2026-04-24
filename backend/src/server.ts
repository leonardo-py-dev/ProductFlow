import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import appRoutes from './routes/appRoutes';

// Carregar variáveis de ambiente antes de tudo
dotenv.config();

const app = express();

// Configuração dinâmica de CORS para ambientes de desenvolvimento e produção
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Em desenvolvimento, permitir qualquer origin
    // Em produção, apenas origin definido no FRONTEND_URL
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ];

    // Permitir requisições sem origin (como mobile apps, curl, etc)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Em desenvolvimento, permitir origin não configurado
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

// Segurança e parsing
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', appRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mensagem de boas-vindas na raiz
app.get('/', (_req, res) => {
  res.send('🚀 ProductFlow API is running! Your productivity starts here.');
});

// Error handler global (Express 5 passa erros async automaticamente)
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[SERVER] Erro não tratado:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[SERVER] Rodando na porta ${PORT}`);
  console.log(`[SERVER] CORS permitindo origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
