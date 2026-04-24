import { useState } from 'react';
import { Plus, Clock, User, Trash2 } from 'lucide-react';
import { useSteps, useUpdateStep, useCreateStep, useDeleteStep } from '../hooks/useApi';

const COLUMNS = [
  { id: 'pending', name: 'Pendente', color: 'gray' },
  { id: 'in_progress', name: 'Em Progresso', color: 'blue' },
  { id: 'blocked', name: 'Bloqueado', color: 'red' },
  { id: 'done', name: 'Concluído', color: 'green' },
];

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const { data: steps, isLoading } = useSteps(projectId);
  const updateStep = useUpdateStep();
  const createStep = useCreateStep();
  const deleteStep = useDeleteStep();

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [newStep, setNewStep] = useState({ title: '', description: '', priority: 'medium', deadline: '' });
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  if (isLoading) return <div className="p-8 text-gray-500">Carregando tarefas...</div>;

  const filteredSteps = priorityFilter 
    ? steps?.filter((s: any) => s.priority === priorityFilter) 
    : steps;

  const totalTasks = steps?.length || 0;
  const doneTasks = steps?.filter((s: any) => s.status === 'done').length || 0;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;


  const isOverdue = (deadline: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date() && !steps?.find((s: any) => s.deadline === deadline && s.status === 'done');
  };

  const handleStatusChange = (stepId: string, newStatus: string) => {
    updateStep.mutate({ id: stepId, status: newStatus });
  };

  const handleSaveStep = () => {
    if (!newStep.title) return;
    
    if (editingStepId) {
      updateStep.mutate({
        id: editingStepId,
        title: newStep.title,
        description: newStep.description,
        priority: newStep.priority,
        deadline: newStep.deadline || undefined,
      });
    } else {
      createStep.mutate({
        project_id: projectId,
        title: newStep.title,
        description: newStep.description,
        priority: newStep.priority,
        deadline: newStep.deadline || undefined,
      });
    }
    
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStepId(null);
    setNewStep({ title: '', description: '', priority: 'medium', deadline: '' });
  };

  const openEditModal = (step: any) => {
    setEditingStepId(step.id);
    setNewStep({
      title: step.title,
      description: step.description || '',
      priority: step.priority,
      deadline: step.deadline ? new Date(step.deadline).toISOString().split('T')[0] : '',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Kanban Header / Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Progresso Geral</div>
            <div className="flex items-center gap-3">
              <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm font-bold text-primary-light">{progressPercent}%</span>
            </div>
          </div>
          <div className="h-10 w-px bg-white/10 hidden md:block" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mr-2">Filtrar:</span>
            {['low', 'medium', 'high', 'critical'].map(p => (
              <button
                key={p}
                onClick={() => setPriorityFilter(priorityFilter === p ? null : p)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                  priorityFilter === p ? 'bg-white/10 border-white/20 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={() => { setIsModalOpen(true); setEditingStepId(null); }}
          className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Nova Tarefa
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 h-full min-h-[600px]">
      {COLUMNS.map((col) => (
        <div key={col.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                col.id === 'pending' ? 'bg-gray-500' : 
                col.id === 'in_progress' ? 'bg-blue-500' : 
                col.id === 'blocked' ? 'bg-red-500' : 'bg-green-500'
              }`} />
              <h3 className="font-bold text-gray-200">{col.name}</h3>
              <span className="bg-white/5 px-2 py-0.5 rounded text-xs text-gray-500 font-mono">
                {steps?.filter((s: any) => s.status === col.id).length || 0}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4 bg-white/2 rounded-2xl p-2 min-h-[200px] border border-transparent hover:border-white/5 transition-colors">
            {filteredSteps?.filter((s: any) => s.status === col.id).map((step: any) => (
              <div 
                key={step.id} 
                onClick={() => openEditModal(step)}
                className={`bg-white/5 border border-white/10 rounded-2xl p-4 shadow-sm hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden ${
                  isOverdue(step.deadline) ? 'border-red-500/50' : ''
                }`}
              >
                {isOverdue(step.deadline) && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
                )}
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[9px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded-lg ${
                    step.priority === 'high' || step.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                    step.priority === 'medium' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {step.priority}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Tem certeza que deseja excluir esta etapa?')) {
                        deleteStep.mutate({ id: step.id });
                      }
                    }}
                    className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-semibold text-gray-100 mb-2 leading-tight">{step.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{step.description}</p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    {step.deadline && (
                      <span className={`flex items-center gap-1 ${isOverdue(step.deadline) ? 'text-red-400' : 'text-gray-500'}`}>
                        <Clock className="w-3 h-3" />
                        {new Date(step.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-[10px] text-gray-400">
                    <User className="w-3 h-3" />
                  </div>
                </div>

                {/* Seletor de status rápido no hover */}
                <div className="mt-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  {COLUMNS.filter(c => c.id !== step.status).map(c => (
                    <button
                      key={c.id}
                      onClick={(e) => { e.stopPropagation(); handleStatusChange(step.id, c.id); }}
                      className="flex-1 py-1 text-[9px] font-bold uppercase rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary-light transition-all border border-transparent hover:border-primary/20"
                      title={`Mover para ${c.name}`}
                    >
                      {c.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      </div>

      {/* Modal de Nova/Editar Etapa */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-light border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">{editingStepId ? 'Editar Tarefa' : 'Criar Nova Tarefa'}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1 block">Título</label>
                <input 
                  type="text" 
                  value={newStep.title}
                  onChange={(e) => setNewStep({...newStep, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1 block">Descrição</label>
                <textarea 
                  value={newStep.description}
                  onChange={(e) => setNewStep({...newStep, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1 block">Prioridade</label>
                  <select 
                    value={newStep.priority}
                    onChange={(e) => setNewStep({...newStep, priority: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white [&>option]:bg-dark"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="critical">Crítica</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1 block">Prazo</label>
                  <input 
                    type="date" 
                    value={newStep.deadline}
                    onChange={(e) => setNewStep({...newStep, deadline: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-white [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4 mt-6 border-t border-white/10">
                <button 
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveStep}
                  disabled={createStep.isPending || updateStep.isPending}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary hover:bg-primary-dark transition-all font-bold disabled:opacity-50"
                >
                  {createStep.isPending || updateStep.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}
