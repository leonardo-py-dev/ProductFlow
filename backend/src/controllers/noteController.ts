import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

// GET /api/notes/:workspaceId
export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = req.params;
    const { category, search, is_template } = req.query;
    
    let query = 'SELECT id, title, parent_id, category, is_template, created_at, updated_at FROM notes WHERE workspace_id = $1';
    const params: any[] = [workspaceId];
    
    if (category && category !== 'all') {
      query += ` AND category = $${params.length + 1}`;
      params.push(category);
    }
    
    if (is_template === 'true') {
      query += ` AND is_template = true`;
    } else {
      query += ` AND (is_template = false OR is_template IS NULL)`;
    }
    
    if (search) {
      query += ` AND (title ILIKE $${params.length + 1} OR content::text ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY is_template ASC, updated_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/notes/categories/:workspaceId
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = req.params;
    const result = await pool.query(
      `SELECT DISTINCT category FROM notes 
       WHERE workspace_id = $1 AND category IS NOT NULL 
       ORDER BY category`,
      [workspaceId]
    );
    res.json(result.rows.map(r => r.category));
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

// GET /api/notes/versions/:noteId
export const getNoteVersions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { noteId } = req.params;
    const result = await pool.query(
      'SELECT id, edited_at FROM note_versions WHERE note_id = $1 ORDER BY edited_at DESC LIMIT 20',
      [noteId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/notes/version/:versionId
export const getVersionDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { versionId } = req.params;
    const result = await pool.query('SELECT * FROM note_versions WHERE id = $1', [versionId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Versão não encontrada.' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /api/notes
export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspace_id, title, content, parent_id, category, is_template } = req.body;
    const userId = (req as any).user?.id;

    const result = await pool.query(
      `INSERT INTO notes (workspace_id, title, content, parent_id, category, is_template)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [workspace_id, title || 'Sem título', content || {}, parent_id || null, category || 'default', is_template || false]
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
    const { title, content, category } = req.body;
    
    // Buscar conteúdo atual para salvar versão
    const current = await pool.query('SELECT content FROM notes WHERE id = $1', [id]);
    if (current.rows.length > 0 && content && content !== current.rows[0].content) {
      await pool.query(
        `INSERT INTO note_versions (note_id, content, edited_by) VALUES ($1, $2, $3)`,
        [id, current.rows[0].content, (req as any).user?.id]
      );
    }
    
    const result = await pool.query(
      `UPDATE notes SET title = COALESCE($1, title), content = COALESCE($2, content), category = COALESCE($3, category), updated_at = NOW() WHERE id = $4 RETURNING *`,
      [title, content, category, id]
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
