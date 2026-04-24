import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

// GET /api/projects/:workspaceId
export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Não autorizado.' });
    }

    // Verificar se o usuário tem acesso a este workspace
    const memberCheck = await pool.query(
      `SELECT 1 FROM workspaces WHERE id = $1 AND created_by = $2
       UNION
       SELECT 1 FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
      [workspaceId, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Você não tem acesso a este workspace.' });
    }

    const result = await pool.query(
      `SELECT * FROM projects WHERE workspace_id = $1 ORDER BY created_at DESC`,
      [workspaceId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// POST /api/projects
export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { workspaceId, name, description } = req.body;
    const userId = req.user?.id;

    if (!workspaceId || !name) {
      return res.status(400).json({ error: 'Workspace e Nome são obrigatórios.' });
    }

    const result = await pool.query(
      `INSERT INTO projects (workspace_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [workspaceId, name, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
