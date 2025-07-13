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
          email: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          company: string | null
          role: string
          onboarding_completed: boolean
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          role?: string
          onboarding_completed?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          company?: string | null
          role?: string
          onboarding_completed?: boolean
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          description: string | null
          type: string
          status: string
          visibility: string
          icon: string
          color: string
          settings: Json
          metadata: Json
          last_accessed_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          description?: string | null
          type?: string
          status?: string
          visibility?: string
          icon?: string
          color?: string
          settings?: Json
          metadata?: Json
          last_accessed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          description?: string | null
          type?: string
          status?: string
          visibility?: string
          icon?: string
          color?: string
          settings?: Json
          metadata?: Json
          last_accessed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      project_collaborators: {
        Row: {
          id: string
          project_id: string
          user_id: string
          role: string
          permissions: Json
          invited_by: string | null
          accepted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          role?: string
          permissions?: Json
          invited_by?: string | null
          accepted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          role?: string
          permissions?: Json
          invited_by?: string | null
          accepted_at?: string | null
          created_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          project_id: string
          name: string
          slug: string
          path: string
          type: string
          parent_id: string | null
          template: string | null
          settings: Json
          meta: Json
          content: Json
          order_index: number
          is_home: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          slug: string
          path: string
          type?: string
          parent_id?: string | null
          template?: string | null
          settings?: Json
          meta?: Json
          content?: Json
          order_index?: number
          is_home?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          slug?: string
          path?: string
          type?: string
          parent_id?: string | null
          template?: string | null
          settings?: Json
          meta?: Json
          content?: Json
          order_index?: number
          is_home?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      features: {
        Row: {
          id: string
          project_id: string
          name: string
          slug: string
          description: string | null
          category: string | null
          type: string | null
          status: string
          priority: string
          settings: Json
          dependencies: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          slug: string
          description?: string | null
          category?: string | null
          type?: string | null
          status?: string
          priority?: string
          settings?: Json
          dependencies?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: string | null
          type?: string | null
          status?: string
          priority?: string
          settings?: Json
          dependencies?: Json
          created_at?: string
          updated_at?: string
        }
      }
      journeys: {
        Row: {
          id: string
          project_id: string
          name: string
          slug: string
          description: string | null
          type: string
          persona: string | null
          status: string
          steps: Json
          triggers: Json
          outcomes: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          slug: string
          description?: string | null
          type?: string
          persona?: string | null
          status?: string
          steps?: Json
          triggers?: Json
          outcomes?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          slug?: string
          description?: string | null
          type?: string
          persona?: string | null
          status?: string
          steps?: Json
          triggers?: Json
          outcomes?: Json
          created_at?: string
          updated_at?: string
        }
      }
      components: {
        Row: {
          id: string
          project_id: string
          name: string
          slug: string
          category: string | null
          description: string | null
          props: Json
          slots: Json
          events: Json
          code: string | null
          preview_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          slug: string
          category?: string | null
          description?: string | null
          props?: Json
          slots?: Json
          events?: Json
          code?: string | null
          preview_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          slug?: string
          category?: string | null
          description?: string | null
          props?: Json
          slots?: Json
          events?: Json
          code?: string | null
          preview_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      wizard_runs: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          wizard_id: string
          status: string
          current_phase: string | null
          answers: Json
          outputs: Json
          started_at: string
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          wizard_id: string
          status?: string
          current_phase?: string | null
          answers?: Json
          outputs?: Json
          started_at?: string
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          wizard_id?: string
          status?: string
          current_phase?: string | null
          answers?: Json
          outputs?: Json
          started_at?: string
          completed_at?: string | null
          updated_at?: string
        }
      }
      project_activity: {
        Row: {
          id: string
          project_id: string
          user_id: string
          action: string
          entity_type: string | null
          entity_id: string | null
          entity_name: string | null
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          action: string
          entity_type?: string | null
          entity_id?: string | null
          entity_name?: string | null
          details?: Json
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          action?: string
          entity_type?: string | null
          entity_id?: string | null
          entity_name?: string | null
          details?: Json
          created_at?: string
        }
      }
      ai_chats: {
        Row: {
          id: string
          project_id: string
          user_id: string
          wizard_run_id: string | null
          messages: Json
          context: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          wizard_run_id?: string | null
          messages?: Json
          context?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          wizard_run_id?: string | null
          messages?: Json
          context?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_project_slug: {
        Args: {
          project_name: string
          user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}