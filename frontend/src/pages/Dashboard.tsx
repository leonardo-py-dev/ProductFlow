import { useState } from 'react';
import { 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  ChevronRight, 
  Folder, 
  Search,
  Bell,
  User as UserIcon,
  Workflow as FlowIcon,
  FileText,
  CheckCircle,
  Trash2,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useWorkspaces, useProjects, useCreateWorkspace, useCreateProject, useDeleteWorkspace, useDeleteProject, useMetrics } from '../hooks/useApi';

// Componentes internos
import KanbanBoard from '../components/KanbanBoard';
import FlowBuilderPage from './FlowBuilder';
import NotesPage from './Notes';
import QuickCapture from '../components/QuickCapture';

type ViewType = 'dashboard' | 'kanban' | 'workflow' | 'notes';

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const { data: workspaces, isLoading: loadingWS } = useWorkspaces();
  const [selectedWSId, setSelectedWSId] = useState<string | null>(null);
  const { data: projects, isLoading: loadingProjects } = useProjects(selectedWSId || workspaces?.[0]?.id);
  const createWorkspace = useCreateWorkspace();
  const createProject = useCreateProject();
  const deleteWorkspace = useDeleteWorkspace();
  const deleteProject = useDeleteProject();
  const { data: metrics } = useMetrics(selectedWSId || workspaces?.[0]?.id);

  // Estados de Navegação Interna
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Estados para Modais
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
  // Estados de Formulário
  const [newWSName, setNewWSName] = useState('');
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  // Função para saudação dinâmica
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Workspace Ativo
  const activeWorkspace = workspaces?.find((ws: any) => ws.id === (selectedWSId || workspaces?.[0]?.id));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openProject = (id: string) => {
    setSelectedProjectId(id);
    setCurrentView('kanban');
  };

  const backToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedProjectId(null);
  };

  if (loadingWS) return <div className="min-h-screen bg-dark-deep flex items-center justify-center text-primary">Carregando Workspaces...</div>;

  return (
    <div className="flex h-screen bg-dark-deep text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-white/5 border-r border-white/10 flex flex-col backdrop-blur-xl z-20">
        <div className="p-6 flex items-center gap-3">
          <div 
            onClick={backToDashboard}
            className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer hover:scale-105 transition-transform"
          >
            <FlowIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">ProductFlow</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto">
          {/* Workspaces Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Workspace</h2>
              <div className="flex gap-1">
                <button 
                  onClick={() => setIsWorkspaceModalOpen(true)}
                  className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  title="Criar Novo Workspace"
                >
                  <Plus className="w-4 h-4" />
                </button>
                {activeWorkspace && workspaces && workspaces.length > 0 && (
                  <button 
                    onClick={() => {
                      if (confirm(`Atenção: Você tem certeza que deseja excluir o workspace "${activeWorkspace.name}" e tudo dentro dele?`)) {
                        deleteWorkspace.mutate({ id: activeWorkspace.id });
                        setSelectedWSId(null); // Volta para o primeiro disponível
                      }
                    }}
                    className="p-1 hover:bg-red-500/20 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                    title="Excluir Workspace"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="space-y-1">
              {workspaces?.map((ws: any) => (
                <button
                  key={ws.id}
                  onClick={() => { setSelectedWSId(ws.id); backToDashboard(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    activeWorkspace?.id === ws.id 
                      ? 'bg-primary/20 text-primary-light border border-primary/20 shadow-lg shadow-primary/5' 
                      : 'hover:bg-white/5 text-gray-400 hover:text-gray-200 border border-transparent'
                  }`}
                >
                  <span className="text-lg">📁</span>
                  <span className="font-medium truncate text-left flex-1">{ws.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-1">
            <button 
              onClick={backToDashboard}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all border ${
                currentView === 'dashboard' ? 'bg-white/5 text-white border-white/10 shadow-sm' : 'text-gray-400 border-transparent hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 ${currentView === 'dashboard' ? 'text-secondary' : ''}`} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button 
              onClick={() => setCurrentView('notes')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all border ${
                currentView === 'notes' ? 'bg-white/5 text-white border-white/10 shadow-sm' : 'text-gray-400 border-transparent hover:bg-white/5'
              }`}
            >
              <FileText className={`w-5 h-5 ${currentView === 'notes' ? 'text-blue-400' : ''}`} />
              <span className="font-medium">Notas</span>
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 mb-2">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
              <UserIcon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-dark overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-dark/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            {selectedProjectId && (
              <button onClick={backToDashboard} className="p-2 hover:bg-white/5 rounded-full text-gray-400 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-gray-500">
                {selectedProjectId ? `${activeWorkspace?.name} /` : `${getGreeting()}, ${user?.name?.split(' ')[0]} 👋`}
              </span> 
              {selectedProjectId ? projects?.find((p: any) => p.id === selectedProjectId)?.name : ''}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar..."
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
              />
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full relative transition-colors text-gray-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-dark" />
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <div className="p-8">
              {/* Metrics Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-2 text-gray-400">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Concluídas</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics?.done_tasks || 0}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Total de tarefas finalizadas</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-2 text-gray-400">
                    <Plus className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">Em Progresso</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics?.in_progress_tasks || 0}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Trabalhando agora</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-2 text-gray-400">
                    <Clock className="w-5 h-5 text-secondary" />
                    <span className="text-xs font-bold uppercase tracking-widest">Prazos Próximos</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics?.upcoming_deadlines || 0}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Próximos 7 dias</div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-2 text-gray-400">
                    <LayoutDashboard className="w-5 h-5 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">Total Tarefas</span>
                  </div>
                  <div className="text-3xl font-bold">{metrics?.total_tasks || 0}</div>
                  <div className="text-[10px] text-gray-500 mt-1">No workspace atual</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Meus Projetos</h1>
                  <p className="text-gray-400">Gerencie seus fluxos e produtividade abaixo.</p>
                </div>
                <button 
                  onClick={() => setIsProjectModalOpen(true)}
                  className="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Criar Projeto 🔥
                </button>
              </div>

              {loadingProjects ? (
                <div className="py-12 text-center text-gray-500">Carregando projetos...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects?.map((project: any) => (
                    <div 
                      key={project.id}
                      onClick={() => openProject(project.id)}
                      className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group cursor-pointer hover:-translate-y-1 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Folder className="w-6 h-6" />
                        </div>
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Excluir o projeto "${project.name}" e todas as suas tarefas?`)) {
                                deleteProject.mutate({ id: project.id });
                              }
                            }}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            title="Excluir Projeto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary-light transition-colors">{project.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-1">{project.description || 'Sem descrição'}</p>
                      <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <FlowIcon className="w-3 h-3 text-secondary" />
                          Flow Builder
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          Steps
                        </span>
                      </div>
                    </div>
                  ))}
                  {projects?.length === 0 && (
                    <div className="col-span-full py-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-gray-500">
                      <Folder className="w-12 h-12 mb-4 opacity-20" />
                      <p>Nenhum projeto encontrado neste workspace.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {(currentView === 'kanban' || currentView === 'workflow') && selectedProjectId && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-6 border-b border-white/5 flex gap-4 bg-dark/20 items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentView('kanban')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentView === 'kanban' ? 'bg-primary text-white' : 'bg-white/5 text-gray-500'}`}
                  >
                    Kanban Board
                  </button>
                  <button 
                    onClick={() => setCurrentView('workflow')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentView === 'workflow' ? 'bg-secondary text-white' : 'bg-white/5 text-gray-500'}`}
                  >
                    Flow Builder
                  </button>
                </div>
                {activeWorkspace && (
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {projects?.map((project: any) => (
                        <div key={project.id} className="relative group">
                          <button
                            onClick={() => openProject(project.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                              selectedProjectId === project.id ? 'bg-white/10 text-white border-white/20' : 'bg-transparent text-gray-400 border-transparent hover:bg-white/5'
                            }`}
                          >
                            {project.name}
                          </button>
                          {selectedProjectId === project.id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Excluir o projeto "${project.name}" e todas as suas tarefas?`)) {
                                  deleteProject.mutate({ id: project.id });
                                  setSelectedProjectId(null);
                                  setCurrentView('dashboard');
                                }
                              }}
                              className="absolute -top-2 -right-2 bg-dark border border-white/10 p-1 rounded-full text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                              title="Excluir Projeto"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-auto">
                {currentView === 'kanban' ? (
                  <div className="p-8"><KanbanBoard projectId={selectedProjectId} /></div>
                ) : (
                  <FlowBuilderPage projectId={selectedProjectId} />
                )}
              </div>
            </div>
          )}

          {currentView === 'notes' && (
            <NotesPage workspaceId={activeWorkspace?.id} />
          )}
        </div>
      </main>
      {/* Modais */}
      {isWorkspaceModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-light border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Criar Novo Workspace</h2>
            <input 
              type="text" 
              placeholder="Nome do Workspace"
              value={newWSName}
              onChange={(e) => setNewWSName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setIsWorkspaceModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  console.log('Tentando criar workspace:', newWSName);
                  if (!newWSName) return;
                  createWorkspace.mutate({ name: newWSName }, {
                    onSuccess: () => {
                      setIsWorkspaceModalOpen(false);
                      setNewWSName('');
                    },
                    onError: (err) => {
                      console.error('Erro ao criar workspace:', err);
                      alert('Erro ao criar workspace. Verifique o console.');
                    }
                  });
                }}
                disabled={createWorkspace.isPending}
                className="flex-1 px-4 py-3 rounded-xl bg-primary hover:bg-primary-dark transition-all font-bold disabled:opacity-50"
              >
                {createWorkspace.isPending ? 'Criando...' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-light border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Criar Novo Projeto</h2>
            {!activeWorkspace ? (
              <p className="text-red-400 mb-6 text-sm">Crie um Workspace primeiro no menu lateral!</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">Nome do Projeto</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Novo Lançamento"
                      value={newProjName}
                      onChange={(e) => setNewProjName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2 block">Descrição (Opcional)</label>
                    <textarea 
                      placeholder="Descreva o objetivo deste projeto..."
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                </div>
              </>
            )}
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setIsProjectModalOpen(false);
                  setNewProjName('');
                  setNewProjDesc('');
                }}
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button 
                disabled={!activeWorkspace}
                onClick={() => {
                  console.log('Tentando criar projeto:', newProjName, 'no WS:', activeWorkspace?.id);
                  if (!newProjName || !activeWorkspace) return;
                  createProject.mutate({ 
                    name: newProjName, 
                    description: newProjDesc,
                    workspaceId: activeWorkspace.id 
                  }, {
                    onSuccess: () => {
                      setIsProjectModalOpen(false);
                      setNewProjName('');
                      setNewProjDesc('');
                    },
                    onError: (err) => {
                      console.error('Erro ao criar projeto:', err);
                      alert('Erro ao criar projeto. Verifique o console.');
                    }
                  });
                }}
                className="flex-1 px-4 py-3 rounded-xl bg-secondary hover:bg-secondary-dark transition-all font-bold disabled:opacity-50"
              >
                {createProject.isPending ? 'Criando...' : 'Criar Projeto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeWorkspace && <QuickCapture workspaceId={activeWorkspace.id} />}
    </div>
  );
}

