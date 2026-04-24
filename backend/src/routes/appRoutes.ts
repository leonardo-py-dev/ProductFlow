import { Router } from 'express';
import { getWorkspaces, createWorkspace } from '../controllers/workspaceController';
import { getProjects, createProject } from '../controllers/projectController';
import { getSteps, createStep, updateStep, deleteStep } from '../controllers/stepController';
import { getWorkflow, saveWorkflow } from '../controllers/workflowController';
import { getNotes, getNoteDetail, createNote, updateNote } from '../controllers/noteController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Todas as rotas abaixo requerem autenticação
router.use(authenticateToken);

// Workspaces
router.get('/workspaces', getWorkspaces);
router.post('/workspaces', createWorkspace);

// Projetos
router.get('/projects/:workspaceId', getProjects);
router.post('/projects', createProject);

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
router.get('/notes/detail/:id', getNoteDetail);
router.post('/notes', createNote);
router.patch('/notes/:id', updateNote);

export default router;
