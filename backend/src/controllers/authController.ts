import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

/**
 * Controlador de Autenticação
 * Gerencia registro e login de usuários com JWT.
 * Senhas são hasheadas com bcrypt (10 salt rounds).
 */

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === 'sua_chave_secreta_aqui') {
    console.warn('[AUTH] AVISO: JWT_SECRET não configurado ou usando valor padrão. Defina um segredo forte no .env');
  }
  return secret || 'dev-only-fallback-change-me';
};

// POST /api/auth/register
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validação de entrada
    if (!email || !password) {
      res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
      return;
    }

    // Verificar se o usuário já existe
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Este e-mail já está em uso.' });
      return;
    }

    // Hash da senha com bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Inserir usuário no banco
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, avatar_url, created_at`,
      [email, passwordHash, name || null]
    );

    const user = result.rows[0];

    // Gerar token JWT (expira em 7 dias)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (err) {
    console.error('[AUTH] Erro no registro:', err);
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validação de entrada
    if (!email || !password) {
      res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      return;
    }

    // Buscar usuário pelo e-mail
    const result = await pool.query(
      'SELECT id, email, name, avatar_url, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    const user = result.rows[0];

    // Comparar a senha informada com o hash armazenado
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    // Nunca retornar o hash da senha ao cliente
    const { password_hash, ...safeUser } = user;

    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('[AUTH] Erro no login:', err);
    next(err);
  }
};
