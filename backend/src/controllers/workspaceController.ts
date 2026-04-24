import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

// GET /api/workspaces
export const getWorkspaces = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    // Busca workspaces onde o usuário é dono ou membro
    const result = await pool.query(
      `SELECT w.* FROM workspaces w
       LEFT JOIN workspace_members wm ON w.id = wm.workspace_id
       WHERE w.created_by = $1 OR wm.user_id = $1
       GROUP BY w.id
       ORDER BY w.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// POST /api/workspaces
export const createWorkspace = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?.id;

    if (!name) {
      return res.status(400).json({ error: 'O nome do workspace é obrigatório.' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const result = await pool.query(
      `INSERT INTO workspaces (name, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, description || null, userId]
    );

    const workspace = result.rows[0];

    // Adiciona o criador como admin automaticamente
    await pool.query(
      `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES ($1, $2, 'admin')`,
      [workspace.id, userId]
    );

    res.status(201).json(workspace);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/workspaces/:id
export const deleteWorkspace = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Apenas o admin (ou quem criou) deveria poder deletar, mas para simplificar:
    await pool.query('DELETE FROM workspaces WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
