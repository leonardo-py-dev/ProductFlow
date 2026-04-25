import { Router } from 'express';
import { getWorkspaces, createWorkspace, deleteWorkspace } from '../controllers/workspaceController';
import { getProjects, createProject, deleteProject } from '../controllers/projectController';
import { getSteps, createStep, updateStep, deleteStep } from '../controllers/stepController';
import { getWorkflow, saveWorkflow } from '../controllers/workflowController';
import { getNotes, getNoteDetail, createNote, updateNote, deleteNote, getCategories } from '../controllers/noteController';
import { getWorkspaceMetrics } from '../controllers/metricsController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Todas as rotas abaixo requerem autenticação
router.use(authenticateToken);

// Workspaces
router.get('/workspaces', getWorkspaces);
router.post('/workspaces', createWorkspace);
router.delete('/workspaces/:id', deleteWorkspace);

// Projetos
router.get('/projects/:workspaceId', getProjects);
router.post('/projects', createProject);
router.delete('/projects/:id', deleteProject);

// Steps (Kanban)
router.get('/steps/:projectId', getSteps);
router.post('/steps', createStep);
router.patch('/steps/:id', updateStep);
router.delete('/steps/:id', deleteStep);

// Workflows (Flow Builder)
router.get('/workflows/:projectId', getWorkflow);
router.post('/workflows', saveWorkflow);

// Notas (Knowledge Base)
router.get('/notes/:workspaceId', getNotes);
router.get('/notes/categories/:workspaceId', getCategories);
router.get('/notes/detail/:id', getNoteDetail);
router.post('/notes', createNote);
router.patch('/notes/:id', updateNote);
router.delete('/notes/:id', deleteNote);

// Métricas
router.get('/metrics/:workspaceId', getWorkspaceMetrics);

export default router;
