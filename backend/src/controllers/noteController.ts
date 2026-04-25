import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

// GET /api/notes/:workspaceId
export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = req.params;
    const result = await pool.query(
      'SELECT id, title, parent_id, created_at, updated_at FROM notes WHERE workspace_id = $1 ORDER BY updated_at DESC',
      [workspaceId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/notes/categories/:workspaceId
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(['default', 'projetos', 'pessoal']);
  } catch (err) {
    next(err);
  }
};

// GET /api/notes/detail/:id
export const getNoteDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM notes WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Nota não encontrada.' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /api/notes
export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspace_id, title } = req.body;

    const result = await pool.query(
      `INSERT INTO notes (workspace_id, title) VALUES ($1, $2) RETURNING *`,
      [workspace_id, title || 'Sem título']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notes/:id
export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;
    
    if (title) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    
    if (content) {
      updates.push(`content = $${paramCount++}`);
      values.push(content);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nada para atualizar.' });
    }
    
    updates.push('updated_at = NOW()');
    values.push(id);
    
    const query = `UPDATE notes SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Nota não encontrada.' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update note error:', err);
    next(err);
  }
};

// DELETE /api/notes/:id
export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM notes WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
