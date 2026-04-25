import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

export const getWorkspaceMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = req.params;

    // Métricas de tarefas
    const taskMetricsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE s.status = 'done') as done_tasks,
        COUNT(*) FILTER (WHERE s.status = 'in_progress') as in_progress_tasks,
        COUNT(*) FILTER (WHERE s.status = 'blocked') as blocked_tasks,
        COUNT(*) FILTER (WHERE s.deadline IS NOT NULL AND s.deadline > NOW() AND s.deadline <= NOW() + INTERVAL '7 days') as upcoming_deadlines
      FROM steps s
      JOIN projects p ON s.project_id = p.id
      WHERE p.workspace_id = $1
    `, [workspaceId]);

    // Métricas de projetos e notas
    const projectCountResult = await pool.query('SELECT COUNT(*) as total_projects FROM projects WHERE workspace_id = $1', [workspaceId]);
    const noteCountResult = await pool.query('SELECT COUNT(*) as total_notes FROM notes WHERE workspace_id = $1', [workspaceId]);

    const metrics = {
      ...taskMetricsResult.rows[0],
      total_projects: projectCountResult.rows[0].total_projects,
      total_notes: noteCountResult.rows[0].total_notes
    };

    res.json(metrics);
  } catch (err) {
    next(err);
  }
};
