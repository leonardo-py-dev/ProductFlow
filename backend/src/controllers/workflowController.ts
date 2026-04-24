import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

// GET /api/workflows/:projectId
export const getWorkflow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectId } = req.params;
    const result = await pool.query(
      'SELECT * FROM workflows WHERE project_id = $1',
      [projectId]
    );
    
    if (result.rows.length === 0) {
      // Se não existir, retorna um estado inicial vazio
      return res.json({ nodes: [], edges: [] });
    }
    
    res.json(result.rows[0].flow_json);
  } catch (err) {
    next(err);
  }
};

// POST /api/workflows
export const saveWorkflow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { project_id, name, flow_json } = req.body;
    const userId = (req as any).user?.id;

    const result = await pool.query(
      `INSERT INTO workflows (project_id, name, flow_json)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE 
       SET flow_json = EXCLUDED.flow_json, updated_at = NOW()
       RETURNING *`,
      [project_id, name || 'Fluxo Principal', flow_json]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
