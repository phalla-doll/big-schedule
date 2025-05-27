import { supabase } from './supabase';
import { User, Agenda, AgendaItem, DatabaseUser, DatabaseAgenda, DatabaseAgendaItem } from './global-interface';

// Helper functions to convert between frontend interfaces and database types
export const mapDatabaseUserToUser = (dbUser: DatabaseUser): User => ({
  id: dbUser.id,
  name: dbUser.name,
  email: dbUser.email || undefined,
  passwordHash: dbUser.password_hash || undefined,
  role: dbUser.role,
  createdAt: dbUser.created_at,
  phone: dbUser.phone || undefined,
  telegramId: dbUser.telegram_id || undefined,
});

export const mapUserToDatabaseUser = (user: User): Partial<DatabaseUser> => ({
  id: user.id,
  name: user.name,
  email: user.email || null,
  password_hash: user.passwordHash || null,
  role: user.role,
  created_at: user.createdAt,
  phone: user.phone || null,
  telegram_id: user.telegramId || null,
});

export const mapDatabaseAgendaToAgenda = (dbAgenda: DatabaseAgenda): Omit<Agenda, 'agendaItems' | 'author'> => ({
  id: dbAgenda.id,
  title: dbAgenda.title,
  description: dbAgenda.description || undefined,
  ownerId: dbAgenda.owner_id,
  isPublic: dbAgenda.is_public,
  createdAt: dbAgenda.created_at,
});

export const mapAgendaToDatabaseAgenda = (agenda: Agenda): Partial<DatabaseAgenda> => ({
  id: agenda.id,
  title: agenda.title,
  description: agenda.description || null,
  owner_id: agenda.ownerId,
  is_public: agenda.isPublic,
  created_at: agenda.createdAt,
});

export const mapDatabaseAgendaItemToAgendaItem = (dbItem: DatabaseAgendaItem): AgendaItem => ({
  id: dbItem.id,
  agendaId: dbItem.agenda_id,
  title: dbItem.title,
  description: dbItem.description || undefined,
  startTime: dbItem.start_time,
  endTime: dbItem.end_time || undefined,
  location: dbItem.location || undefined,
  createdAt: dbItem.created_at,
});

export const mapAgendaItemToDatabaseAgendaItem = (item: AgendaItem): Partial<DatabaseAgendaItem> => ({
  id: item.id,
  agenda_id: item.agendaId,
  title: item.title,
  description: item.description || null,
  start_time: item.startTime,
  end_time: item.endTime || null,
  location: item.location || null,
  created_at: item.createdAt,
});

// Database operations
export const createUser = async (user: Omit<User, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('users')
    .insert(mapUserToDatabaseUser({
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }))
    .select()
    .single();

  if (error) throw error;
  return mapDatabaseUserToUser(data);
};

export const createAgenda = async (agenda: Omit<Agenda, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('agendas')
    .insert(mapAgendaToDatabaseAgenda({
      ...agenda,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }))
    .select()
    .single();

  if (error) throw error;
  return mapDatabaseAgendaToAgenda(data);
};

export const createAgendaItem = async (item: Omit<AgendaItem, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('agenda_items')
    .insert(mapAgendaItemToDatabaseAgendaItem({
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }))
    .select()
    .single();

  if (error) throw error;
  return mapDatabaseAgendaItemToAgendaItem(data);
};

export const getAgendaWithItems = async (agendaId: string) => {
  const { data: agendaData, error: agendaError } = await supabase
    .from('agendas')
    .select('*')
    .eq('id', agendaId)
    .single();

  if (agendaError) throw agendaError;

  const { data: itemsData, error: itemsError } = await supabase
    .from('agenda_items')
    .select('*')
    .eq('agenda_id', agendaId)
    .order('start_time');

  if (itemsError) throw itemsError;

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', agendaData.owner_id)
    .single();

  if (userError) throw userError;

  return {
    ...mapDatabaseAgendaToAgenda(agendaData),
    agendaItems: itemsData.map(mapDatabaseAgendaItemToAgendaItem),
    author: mapDatabaseUserToUser(userData),
  } as Agenda;
};
