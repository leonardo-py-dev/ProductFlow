export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  created_by: string;
  created_at: Date;
}

export type Role = 'admin' | 'member' | 'viewer';
