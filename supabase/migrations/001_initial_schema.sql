-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE permission_type AS ENUM ('view', 'edit', 'manage');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
    role user_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    phone TEXT,
    telegram_id TEXT
);

-- Create agendas table
CREATE TABLE agendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_public BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create agenda_items table
CREATE TABLE agenda_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agenda_id UUID NOT NULL REFERENCES agendas(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create shared_agendas table
CREATE TABLE shared_agendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agenda_id UUID NOT NULL REFERENCES agendas(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission permission_type NOT NULL DEFAULT 'view',
    shared_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agenda_id, user_id)
);

-- Create event_displays table
CREATE TABLE event_displays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agenda_item_id UUID NOT NULL REFERENCES agenda_items(id) ON DELETE CASCADE,
    color_code TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER
);

-- Create indexes for better performance
CREATE INDEX idx_agendas_owner_id ON agendas(owner_id);
CREATE INDEX idx_agendas_is_public ON agendas(is_public);
CREATE INDEX idx_agenda_items_agenda_id ON agenda_items(agenda_id);
CREATE INDEX idx_agenda_items_start_time ON agenda_items(start_time);
CREATE INDEX idx_shared_agendas_agenda_id ON shared_agendas(agenda_id);
CREATE INDEX idx_shared_agendas_user_id ON shared_agendas(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE agenda_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_agendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_displays ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Agendas policies
CREATE POLICY "Anyone can view public agendas" ON agendas FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own agendas" ON agendas FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can view shared agendas" ON agendas FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM shared_agendas 
        WHERE agenda_id = agendas.id AND user_id = auth.uid()
    )
);
CREATE POLICY "Users can create agendas" ON agendas FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own agendas" ON agendas FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own agendas" ON agendas FOR DELETE USING (auth.uid() = owner_id);

-- Agenda items policies
CREATE POLICY "Anyone can view public agenda items" ON agenda_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM agendas 
        WHERE id = agenda_items.agenda_id AND is_public = true
    )
);
CREATE POLICY "Users can view own agenda items" ON agenda_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM agendas 
        WHERE id = agenda_items.agenda_id AND owner_id = auth.uid()
    )
);
CREATE POLICY "Users can view shared agenda items" ON agenda_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM shared_agendas 
        WHERE agenda_id = agenda_items.agenda_id AND user_id = auth.uid()
    )
);
CREATE POLICY "Users can create agenda items for own agendas" ON agenda_items FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM agendas 
        WHERE id = agenda_items.agenda_id AND owner_id = auth.uid()
    )
);
CREATE POLICY "Users can update agenda items for own agendas" ON agenda_items FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM agendas 
        WHERE id = agenda_items.agenda_id AND owner_id = auth.uid()
    )
);
CREATE POLICY "Users can delete agenda items for own agendas" ON agenda_items FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM agendas 
        WHERE id = agenda_items.agenda_id AND owner_id = auth.uid()
    )
);
