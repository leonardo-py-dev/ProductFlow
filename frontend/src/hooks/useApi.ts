import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL;
  if (!url) return '/api';
  // Garante que não tenha barra dupla e adicione /api
  return `${url.replace(/\/$/, '')}/api`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Workspaces ---

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data } = await api.get('/workspaces');
      return data;
    },
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newWorkspace: { name: string; description?: string }) => {
      const { data } = await api.post('/workspaces', newWorkspace);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
    },
  });
};

// --- Projetos ---

export const useProjects = (workspaceId?: string) => {
  return useQuery({
    queryKey: ['projects', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const { data } = await api.get(`/projects/${workspaceId}`);
      return data;
    },
    enabled: !!workspaceId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProject: { workspaceId: string; name: string; description?: string }) => {
      const { data } = await api.post('/projects', newProject);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.workspaceId] });
    },
  });
};

// --- Steps (Kanban) ---

export const useSteps = (projectId?: string) => {
  return useQuery({
    queryKey: ['steps', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data } = await api.get(`/steps/${projectId}`);
      return data;
    },
    enabled: !!projectId,
  });
};

export const useUpdateStep = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: { id: string; [key: string]: any }) => {
      const { data } = await api.patch(`/steps/${id}`, fields);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['steps', data.project_id] });
    },
  });
};

export const useCreateStep = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newStep: { project_id: string; title: string; description?: string; priority?: string; deadline?: string }) => {
      const { data } = await api.post('/steps', newStep);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['steps', variables.project_id] });
    },
  });
};

export const useDeleteStep = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await api.delete(`/steps/${id}`);
      return id;
    },
    onSuccess: (_, variables) => {
      // Invalidate everything step related just to be safe, or we could pass projectId to the mutation
      queryClient.invalidateQueries({ queryKey: ['steps'] });
    },
  });
};

// --- Workflows ---

export const useWorkflow = (projectId?: string) => {
  return useQuery({
    queryKey: ['workflow', projectId],
    queryFn: async () => {
      if (!projectId) return { nodes: [], edges: [] };
      const { data } = await api.get(`/workflows/${projectId}`);
      return data;
    },
    enabled: !!projectId,
  });
};

export const useSaveWorkflow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workflow: { project_id: string; flow_json: any }) => {
      const { data } = await api.post('/workflows', workflow);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workflow', variables.project_id] });
    },
  });
};

// --- Notas ---

export const useNotes = (workspaceId?: string) => {
  return useQuery({
    queryKey: ['notes', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const { data } = await api.get(`/notes/${workspaceId}`);
      return data;
    },
    enabled: !!workspaceId,
  });
};

export const useNoteDetail = (id?: string) => {
  return useQuery({
    queryKey: ['note', id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`/notes/detail/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newNote: { workspace_id: string; title: string }) => {
      const { data } = await api.post('/notes', newNote);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes', variables.workspace_id] });
    },
  });
};

export const useUpdateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: { id: string; title?: string; content?: string }) => {
      const { data } = await api.patch(`/notes/${id}`, fields);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['note', data.id] });
      queryClient.invalidateQueries({ queryKey: ['notes', data.workspace_id] });
    },
  });
};
