import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useNotes, useNoteDetail, useCreateNote, useUpdateNote, useDeleteNote, useNoteCategories, useNoteVersions } from '../hooks/useApi';
import { FileText, Plus, Search, Save, Trash2, Edit2, Clock, Copy } from 'lucide-react';

const TEMPLATES = [
  { name: 'Reunião', content: '<h1>Resumo da Reunião</h1><p><strong>Data:</strong> </p><p><strong>Participantes:</strong> </p><h2>Pontos Discussão</h2><ul><li></li></ul><h2>Decisões</h2><ul><li></li></ul><h2>Ações</h2><ul><li></li></ul>' },
  { name: 'Brainstorm', content: '<h1>Brainstorm: Tema</h1><h2>Ideias</h2><ul><li></li><li></li><li></li></ul><h2>Próximos Passos</h2><p></p>' },
  { name: 'Tutorial', content: '<h1>Título do Tutorial</h1><p>Descrição breve...</p><h2>Pré-requisitos</h2><ul><li></li></ul><h2>Passo 1</h2><p></p><h2>Passo 2</h2><p></p><h2>Conclusão</h2><p></p>' },
  { name: 'Documentação', content: '<h1>Título</h1><h2>Visão Geral</h2><p></p><h2>Detalles</h2><p></p><h2>Referências</h2><p></p>' },
];

export default function NotesPage({ workspaceId }: { workspaceId: string }) {
  const { data: notes, isLoading } = useNotes(workspaceId);
  const { data: categories } = useNoteCategories(workspaceId);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const { data: noteDetail } = useNoteDetail(selectedNoteId || undefined);
  const { data: versions } = useNoteVersions(selectedNoteId || undefined);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote();
  const deleteNote = useDeleteNote();

  const [editingTitle, setEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState('default');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: noteDetail?.content || '<p>Selecione uma nota para começar...</p>',
    editable: !!selectedNoteId,
  });

  useEffect(() => {
    if (editor && noteDetail) {
      editor.commands.setContent(noteDetail.content);
      setTempTitle(noteDetail.title);
      setEditingTitle(false);
    }
  }, [noteDetail, editor, selectedNoteId]);

  if (isLoading) return <div className="p-8 text-gray-500">Carregando notas...</div>;

  const filteredNotes = notes?.filter((note: any) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory || (selectedCategory === 'templates' && note.is_template);
    return matchesSearch && matchesCategory;
  });

  const allCategories = ['all', 'templates', ...(categories || [])];

  return (
    <div className="flex h-full">
      <aside className="w-72 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {allCategories.slice(0, 5).map((cat: any) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-1 text-[10px] rounded-lg transition-all ${
                  selectedCategory === cat ? 'bg-primary text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat === 'templates' ? 'Templates' : cat}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Nota
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes?.map((note: any) => (
            <button
              key={note.id}
              onClick={() => setSelectedNoteId(note.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                selectedNoteId === note.id ? 'bg-primary/10 text-primary-light border border-primary/20' : 'hover:bg-white/5 text-gray-400 border border-transparent'
              }`}
            >
              {note.is_template ? <Copy className="w-4 h-4 text-yellow-500" /> : <FileText className="w-4 h-4 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate text-left">{note.title}</div>
                <div className="text-[10px] text-gray-600 truncate">{note.category}</div>
              </div>
            </button>
          ))}
          {filteredNotes?.length === 0 && (
            <div className="text-center py-8 text-gray-600 text-xs">Nenhuma nota</div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-dark/30">
        <header className="p-6 border-b border-white/10 flex flex-col gap-6 bg-dark/40">
          <div className="flex justify-between items-center">
            {editingTitle ? (
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onBlur={() => {
                  setEditingTitle(false);
                  if (tempTitle !== noteDetail?.title && selectedNoteId) {
                    updateNote.mutate({ id: selectedNoteId, title: tempTitle, workspace_id: workspaceId });
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
            <div className="flex gap-2 items-center">
              <span className="text-[10px] text-gray-500 mr-2">
                {noteDetail ? new Date(noteDetail.updated_at).toLocaleDateString() : ''}
              </span>
              {selectedNoteId && !noteDetail?.is_template && (
                <>
                  <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className={`p-2 rounded-xl transition-all ${showHistory ? 'bg-primary/20 text-primary-light' : 'bg-dark hover:bg-white/10 text-gray-500'}`}
                    title="Histórico"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Excluir "${noteDetail?.title}"?`)) {
                        deleteNote.mutate({ id: selectedNoteId });
                        setSelectedNoteId(null);
                      }
                    }}
                    className="p-2 bg-dark hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (editor && selectedNoteId) {
                        updateNote.mutate({ id: selectedNoteId, content: editor.getHTML(), workspace_id: workspaceId });
                      }
                    }}
                    disabled={updateNote.isPending}
                    className="bg-primary hover:bg-primary-dark px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {updateNote.isPending ? 'Salvando...' : 'Salvar'}
                  </button>
                </>
              )}
            </div>
          </div>
          {selectedNoteId && !noteDetail?.is_template && <Toolbar editor={editor} />}
        </header>

        <div className="flex-1 flex">
          <div className="flex-1 p-8 prose prose-invert max-w-none overflow-y-auto">
            <EditorContent editor={editor} className="outline-none" />
          </div>
          {showHistory && selectedNoteId && (
            <div className="w-48 border-l border-white/10 p-4 overflow-y-auto">
              <h3 className="text-xs font-bold text-gray-500 mb-3">Histórico</h3>
              <div className="space-y-2">
                {versions?.map((v: any) => (
                  <div
                    key={v.id}
                    className="text-xs text-gray-500 p-2"
                  >
                    {new Date(v.edited_at).toLocaleDateString()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-light border border-white/10 p-6 rounded-3xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Nota</h2>
            <input 
              type="text" 
              placeholder="Título"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setNewNoteCategory('default')}
                className={`px-3 py-1.5 rounded-lg text-xs ${newNoteCategory === 'default' ? 'bg-primary text-white' : 'bg-white/5'}`}
              >
                Padrão
              </button>
              <button
                onClick={() => setNewNoteCategory('projetos')}
                className={`px-3 py-1.5 rounded-lg text-xs ${newNoteCategory === 'projetos' ? 'bg-primary text-white' : 'bg-white/5'}`}
              >
                Projetos
              </button>
              <button
                onClick={() => setNewNoteCategory('pessoal')}
                className={`px-3 py-1.5 rounded-lg text-xs ${newNoteCategory === 'pessoal' ? 'bg-primary text-white' : 'bg-white/5'}`}
              >
                Pessoal
              </button>
            </div>
            <button 
              onClick={() => setShowTemplates(!showTemplates)}
              className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:text-white mb-3"
            >
              Usar template...
            </button>
            {showTemplates && (
              <div className="grid grid-cols-2 gap-2 mb-4 max-h-32 overflow-y-auto">
                {TEMPLATES.map(t => (
                  <button
                    key={t.name}
                    onClick={() => {
                      createNote.mutate({ 
                        workspace_id: workspaceId, 
                        title: newNoteTitle || t.name, 
                        category: newNoteCategory,
                        content: t.content
                      });
                      setIsModalOpen(false);
                      setNewNoteTitle('');
                      setShowTemplates(false);
                    }}
                    className="px-3 py-2 text-xs bg-white/5 rounded-lg hover:bg-white/10 text-left"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (!newNoteTitle) return;
                  createNote.mutate({ workspace_id: workspaceId, title: newNoteTitle, category: newNoteCategory });
                  setIsModalOpen(false);
                  setNewNoteTitle('');
                }}
                disabled={!newNoteTitle || createNote.isPending}
                className="flex-1 px-4 py-3 rounded-xl bg-primary hover:bg-primary-dark font-bold disabled:opacity-50"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToolbarButton({ onClick, active, label, italic, strike }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase ${
        active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
      } ${italic ? 'italic' : ''} ${strike ? 'line-through' : ''}`}
    >
      {label}
    </button>
  );
}

function Toolbar({ editor }: { editor: any }) {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit">
      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label="B" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label="I" italic />
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} label="S" strike />
      <div className="w-px h-4 bg-white/10 mx-1" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} label="H1" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} label="H2" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} label="H3" />
      <div className="w-px h-4 bg-white/10 mx-1" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} label="• List" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} label="1. List" />
      <div className="w-px h-4 bg-white/10 mx-1" />
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} label="“ Quote" />
    </div>
  );
}