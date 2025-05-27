export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string | null
          password_hash: string | null
          role: 'admin' | 'user'
          created_at: string
          phone: string | null
          telegram_id: string | null
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          password_hash?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          phone?: string | null
          telegram_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          password_hash?: string | null
          role?: 'admin' | 'user'
          created_at?: string
          phone?: string | null
          telegram_id?: string | null
        }
      }
      agendas: {
        Row: {
          id: string
          title: string
          description: string | null
          owner_id: string
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          owner_id: string
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          owner_id?: string
          is_public?: boolean
          created_at?: string
        }
      }
      agenda_items: {
        Row: {
          id: string
          agenda_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string | null
          location: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agenda_id: string
          title: string
          description?: string | null
          start_time: string
          end_time?: string | null
          location?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          agenda_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string | null
          location?: string | null
          created_at?: string
        }
      }
      shared_agendas: {
        Row: {
          id: string
          agenda_id: string
          user_id: string
          permission: 'view' | 'edit' | 'manage'
          shared_at: string
        }
        Insert: {
          id?: string
          agenda_id: string
          user_id: string
          permission: 'view' | 'edit' | 'manage'
          shared_at?: string
        }
        Update: {
          id?: string
          agenda_id?: string
          user_id?: string
          permission?: 'view' | 'edit' | 'manage'
          shared_at?: string
        }
      }
      event_displays: {
        Row: {
          id: string
          agenda_item_id: string
          color_code: string
          icon: string | null
          display_order: number | null
        }
        Insert: {
          id?: string
          agenda_item_id: string
          color_code: string
          icon?: string | null
          display_order?: number | null
        }
        Update: {
          id?: string
          agenda_item_id?: string
          color_code?: string
          icon?: string | null
          display_order?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'user'
      permission_type: 'view' | 'edit' | 'manage'
    }
  }
}
