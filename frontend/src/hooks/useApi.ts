import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const api = axios.create({
  baseURL: '/api',
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
