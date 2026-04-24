import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useNotes, useNoteDetail, useCreateNote, useUpdateNote, useDeleteNote } from '../hooks/useApi';
import { FileText, Plus, Search, ChevronRight, Save, Trash2, Edit2 } from 'lucide-react';

export default function NotesPage({ workspaceId }: { workspaceId: string }) {
  const { data: notes, isLoading } = useNotes(workspaceId);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const { data: noteDetail } = useNoteDetail(selectedNoteId || undefined);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  // Estados de Edição
  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content: noteDetail?.content || '<p>Selecione uma nota para começar...</p>',
    editable: !!selectedNoteId,
  });

  // Atualizar conteúdo do editor quando a nota muda
  useEffect(() => {
    if (editor && noteDetail) {
      editor.commands.setContent(noteDetail.content);
      setTempTitle(noteDetail.title);
      setEditingTitle(false);
    }
  }, [noteDetail, editor, selectedNoteId]);

  if (isLoading) return <div className="p-8 text-gray-500">Carregando notas...</div>;

  return (
    <div className="flex h-full">
      {/* Sidebar de Notas */}
      <aside className="w-80 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar notas..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Nova Nota
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {notes?.map((note: any) => (
            <button
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                selectedNoteId === note.id ? 'bg-primary/10 text-primary-light border border-primary/20' : 'hover:bg-white/5 text-gray-400'
              }`}
            >
              <FileText className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium truncate text-left flex-1">{note.title}</span>
              <ChevronRight className="w-3 h-3 text-gray-600" />
            </button>
          ))}
        </div>
      </aside>

      {/* Editor Area */}
      <main className="flex-1 flex flex-col bg-dark/30">
        <header className="p-6 border-b border-white/10 flex justify-between items-center bg-dark/40 backdrop-blur-md">
          {editingTitle ? (
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={() => {
                setEditingTitle(false);
                if (tempTitle !== noteDetail?.title && selectedNoteId) {
                  updateNote.mutate({ id: selectedNoteId, title: tempTitle });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.currentTarget.blur();
              }}
              className="text-2xl font-bold bg-transparent text-gray-100 border-b border-primary/50 focus:outline-none w-1/2"
              autoFocus
            />
          ) : (
            <h2 
              className="text-2xl font-bold text-gray-100 flex items-center gap-2 cursor-pointer group"
              onClick={() => selectedNoteId && setEditingTitle(true)}
            >
              {noteDetail?.title || 'Selecione uma nota'}
              {selectedNoteId && <Edit2 className="w-4 h-4 opacity-0 group-hover:opacity-100 text-gray-500" />}
            </h2>
          )}
          <div className="flex gap-4 items-center">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              Atualizado em: {noteDetail ? new Date(noteDetail.updated_at).toLocaleDateString() : '-'}
            </span>
            {selectedNoteId && (
              <>
                <button 
                  onClick={() => {
                    if (confirm(`Excluir a nota "${noteDetail?.title}"?`)) {
                      deleteNote.mutate({ id: selectedNoteId });
                      setSelectedNoteId(null);
                    }
                  }}
                  className="p-2 bg-dark hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-xl transition-all"
                  title="Excluir Nota"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => {
                    if (editor && selectedNoteId) {
                      updateNote.mutate({ id: selectedNoteId, content: editor.getHTML() });
                    }
                  }}
                  disabled={updateNote.isPending}
                  className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {updateNote.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </>
            )}
          </div>
        </header>
        <div className="flex-1 p-8 prose prose-invert max-w-none overflow-y-auto outline-none focus:outline-none">
          <EditorContent editor={editor} className="outline-none" />
        </div>
      </main>

      {/* Modal de Nova Nota */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-light border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Criar Nova Nota</h2>
            <input 
              type="text" 
              placeholder="Título da Nota"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (!newNoteTitle) return;
                  createNote.mutate({ workspace_id: workspaceId, title: newNoteTitle });
                  setIsModalOpen(false);
                  setNewNoteTitle('');
                }}
                disabled={!newNoteTitle || createNote.isPending}
                className="flex-1 px-4 py-3 rounded-xl bg-primary hover:bg-primary-dark transition-all font-bold disabled:opacity-50"
              >
                Criar Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
