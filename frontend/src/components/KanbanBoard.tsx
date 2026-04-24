import { MoreHorizontal, Plus, Clock, User } from 'lucide-react';
import { useSteps, useUpdateStep } from '../hooks/useApi';

const COLUMNS = [
  { id: 'pending', name: 'Pendente', color: 'gray' },
  { id: 'in_progress', name: 'Em Progresso', color: 'blue' },
  { id: 'blocked', name: 'Bloqueado', color: 'red' },
  { id: 'done', name: 'Concluído', color: 'green' },
];

export default function KanbanBoard({ projectId }: { projectId: string }) {
  const { data: steps, isLoading } = useSteps(projectId);
  const updateStep = useUpdateStep();

  if (isLoading) return <div className="p-8 text-gray-500">Carregando tarefas...</div>;

  const handleStatusChange = (stepId: string, newStatus: string) => {
    updateStep.mutate({ id: stepId, status: newStatus });
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 h-full min-h-[600px]">
      {COLUMNS.map((col) => (
        <div key={col.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-200">{col.name}</h3>
              <span className="bg-white/5 px-2 py-0.5 rounded text-xs text-gray-500">
                {steps?.filter((s: any) => s.status === col.id).length || 0}
              </span>
            </div>
            <button className="p-1 hover:bg-white/5 rounded text-gray-500">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 space-y-4 bg-white/2 rounded-2xl p-2 min-h-[200px] border border-transparent hover:border-white/5 transition-colors">
            {steps?.filter((s: any) => s.status === col.id).map((step: any) => (
              <div 
                key={step.id} 
                className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-sm hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                    step.priority === 'high' || step.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                    step.priority === 'medium' ? 'bg-primary/20 text-primary-light' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {step.priority}
                  </span>
                  <button className="text-gray-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-semibold text-gray-100 mb-2 leading-tight">{step.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{step.description}</p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                    {step.deadline && (
                      <span className="flex items-center gap-1">
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
                      onClick={() => handleStatusChange(step.id, c.id)}
                      className="flex-1 py-1 text-[9px] font-bold uppercase rounded bg-white/5 hover:bg-white/20 transition-colors"
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
  );
}
