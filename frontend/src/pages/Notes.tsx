import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useNotes, useNoteDetail } from '../hooks/useApi';
import { FileText, Plus, Search, ChevronRight } from 'lucide-react';

export default function NotesPage({ workspaceId }: { workspaceId: string }) {
  const { data: notes, isLoading } = useNotes(workspaceId);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const { data: noteDetail } = useNoteDetail(selectedNoteId || undefined);

  const editor = useEditor({
    extensions: [StarterKit],
    content: noteDetail?.content || '<p>Selecione uma nota para começar...</p>',
    editable: !!selectedNoteId,
  });

  // Atualizar conteúdo do editor quando a nota muda
  useEffect(() => {
    if (editor && noteDetail) {
      editor.commands.setContent(noteDetail.content);
    }
  }, [noteDetail, editor]);

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
          <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all">
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
        <header className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-100">{noteDetail?.title || 'Selecione uma nota'}</h2>
          <div className="flex gap-2">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">
              Atualizado em: {noteDetail ? new Date(noteDetail.updated_at).toLocaleDateString() : '-'}
            </span>
          </div>
        </header>
        <div className="flex-1 p-8 prose prose-invert max-w-none overflow-y-auto">
          <EditorContent editor={editor} />
        </div>
      </main>
    </div>
  );
}
