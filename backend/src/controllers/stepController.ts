import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

// GET /api/steps/:projectId
export const getSteps = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const result = await pool.query(
      'SELECT * FROM steps WHERE project_id = $1 ORDER BY position ASC, created_at DESC',
      [projectId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// POST /api/steps
export const createStep = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { project_id, title, description, priority, assignee_id, deadline } = req.body;
    
    // Pegar a última posição para colocar o novo step no final
    const posResult = await pool.query(
      'SELECT COALESCE(MAX(position), 0) + 1 as next_pos FROM steps WHERE project_id = $1',
      [project_id]
    );
    const position = posResult.rows[0].next_pos;

    const result = await pool.query(
      `INSERT INTO steps (project_id, title, description, priority, assignee_id, deadline, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [project_id, title, description || null, priority || 'medium', assignee_id || null, deadline || null, position]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/steps/:id
export const updateStep = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const fields = req.body;
    
    // Construção dinâmica de query de update
    const keys = Object.keys(fields);
    if (keys.length === 0) return res.status(400).json({ error: 'Nenhum campo para atualizar.' });

    const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(fields);

    const result = await pool.query(
      `UPDATE steps SET ${setClause}, updated_at = NOW() WHERE id = $${keys.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Step não encontrado.' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/steps/:id
export const deleteStep = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM steps WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
