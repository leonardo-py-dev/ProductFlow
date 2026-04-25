-- Adiciona coluna de categoria/pasta às notas
ALTER TABLE notes ADD COLUMN category TEXT DEFAULT 'default';

-- Cria índice para buscar por categoria
CREATE INDEX idx_notes_category ON notes(category);

-- Adiciona coluna de template
ALTER TABLE notes ADD COLUMN is_template BOOLEAN DEFAULT false;