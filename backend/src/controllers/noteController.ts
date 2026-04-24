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
    const { workspace_id, title, content, parent_id } = req.body;
    const userId = (req as any).user?.id;

    const result = await pool.query(
      `INSERT INTO notes (workspace_id, title, content, parent_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [workspace_id, title || 'Sem título', content || {}, parent_id || null]
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
    
    const result = await pool.query(
      `UPDATE notes SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [title, content, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Nota não encontrada.' });
    res.json(result.rows[0]);
  } catch (err) {
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
