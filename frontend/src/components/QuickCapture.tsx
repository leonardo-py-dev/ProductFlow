import { useState } from 'react';
import { Zap, X, FileText, CheckCircle, Send } from 'lucide-react';
import { useCreateNote, useCreateStep, useProjects } from '../hooks/useApi';

export default function QuickCapture({ workspaceId }: { workspaceId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'note' | 'task'>('note');
  const [content, setContent] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const { data: projects } = useProjects(workspaceId);
  const createNote = useCreateNote();
  const createStep = useCreateStep();

  const handleSave = () => {
    if (!content) return;

    if (type === 'note') {
      createNote.mutate({ workspace_id: workspaceId, title: content }, {
        onSuccess: () => {
          setIsOpen(false);
          setContent('');
        }
      });
    } else {
      if (!selectedProjectId) return alert('Selecione um projeto para a tarefa');
      createStep.mutate({ project_id: selectedProjectId, title: content }, {
        onSuccess: () => {
          setIsOpen(false);
          setContent('');
        }
      });
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <div className="bg-dark-light border border-white/10 rounded-3xl p-6 w-80 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Quick Capture
            </h3>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/5 rounded-lg text-gray-500">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            <button 
              onClick={() => setType('note')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'note' ? 'bg-primary/20 text-primary-light border border-primary/20' : 'bg-white/5 text-gray-500 border border-transparent'
              }`}
            >
              <FileText className="w-3 h-3" />
              Nota
            </button>
            <button 
              onClick={() => setType('task')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                type === 'task' ? 'bg-secondary/20 text-secondary border border-secondary/20' : 'bg-white/5 text-gray-500 border border-transparent'
              }`}
            >
              <CheckCircle className="w-3 h-3" />
              Tarefa
            </button>
          </div>

          <div className="space-y-4">
            {type === 'task' && (
              <select 
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Selecionar Projeto...</option>
                {projects?.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
            
            <div className="relative">
              <textarea 
                placeholder={type === 'note' ? "Título da nova nota..." : "O que precisa ser feito?"}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                autoFocus
              />
              <button 
                onClick={handleSave}
                disabled={!content || (type === 'task' && !selectedProjectId)}
                className="absolute bottom-3 right-3 p-2 bg-primary hover:bg-primary-dark rounded-lg text-white transition-all disabled:opacity-50 disabled:bg-gray-700"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-110 active:scale-95 transition-all group"
        >
          <Zap className="w-6 h-6 text-white group-hover:animate-pulse" />
        </button>
      )}
    </div>
  );
}
