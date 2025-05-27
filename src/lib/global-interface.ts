export type Role = 'admin' | 'user';
export type Permission = 'view' | 'edit' | 'manage';

export interface User {
  id: string;
  name: string;
  email?: string;
  passwordHash?: string;
  role: 'admin' | 'user';
  createdAt?: string;
  phone?: string;
  telegramId?: string;
}

export interface Agenda {
  id?: string;
  title: string;
  description?: string;
  ownerId: string;
  isPublic: boolean;
  createdAt: string;
  agendaItems?: AgendaItem[];
  author?: User;
}

export interface AgendaItem {
  id: string;
  agendaId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  location?: string;
  createdAt: string;
}

export interface SharedAgenda {
  id: string;
  agendaId: string;
  userId: string;
  permission: 'view' | 'edit' | 'manage';
  sharedAt: string;
}

export interface EventDisplay {
  id: string;
  agendaItemId: string;
  colorCode: string;
  icon?: string;
  displayOrder?: number;
}

// Database helper types for mapping between frontend and Supabase
export type DatabaseUser = {
  id: string;
  name: string;
  email: string | null;
  password_hash: string | null;
  role: 'admin' | 'user';
  created_at: string;
  phone: string | null;
  telegram_id: string | null;
};

export type DatabaseAgenda = {
  id: string;
  title: string;
  description: string | null;
  owner_id: string;
  is_public: boolean;
  created_at: string;
};

export type DatabaseAgendaItem = {
  id: string;
  agenda_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  created_at: string;
};
