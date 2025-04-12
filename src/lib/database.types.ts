
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
      cycle_tracking: {
        Row: {
          id: string
          created_at: string
          user_id: string
          date: string
          cycle_day: number
          symptoms: string[]
          mood: string
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          date: string
          cycle_day: number
          symptoms: string[]
          mood: string
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          date?: string
          cycle_day?: number
          symptoms?: string[]
          mood?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cycle_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      goals: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          description: string | null
          target_date: string | null
          status: string
          related_emotions: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          description?: string | null
          target_date?: string | null
          status?: string
          related_emotions?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          description?: string | null
          target_date?: string | null
          status?: string
          related_emotions?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      journal_entries: {
        Row: {
          id: string
          created_at: string
          user_id: string
          date: string
          title: string | null
          content: string
          mood: string
          mood_intensity: number
          tags: string[]
          is_private: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          date: string
          title?: string | null
          content: string
          mood: string
          mood_intensity: number
          tags?: string[]
          is_private?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          date?: string
          title?: string | null
          content?: string
          mood?: string
          mood_intensity?: number
          tags?: string[]
          is_private?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      mood_types: {
        Row: {
          id: string
          created_at: string
          name: string
          emoji: string
          color: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          emoji: string
          color: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          emoji?: string
          color?: string
        }
        Relationships: []
      }
      private_entries: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          content?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
