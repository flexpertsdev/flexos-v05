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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
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
          created_at?: string
          updated_at?: string
        }
      }
      project_vision: {
        Row: {
          id: string
          project_id: string
          vision_statement: string | null
          target_audience: string | null
          key_features: string[] | null
          success_metrics: string[] | null
          inspiration_apps: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          vision_statement?: string | null
          target_audience?: string | null
          key_features?: string[] | null
          success_metrics?: string[] | null
          inspiration_apps?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          vision_statement?: string | null
          target_audience?: string | null
          key_features?: string[] | null
          success_metrics?: string[] | null
          inspiration_apps?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      pages: {
        Row: {
          id: string
          project_id: string
          name: string
          path: string
          description: string | null
          type: string
          status: string
          parent_id: string | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          path: string
          description?: string | null
          type?: string
          status?: string
          parent_id?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          path?: string
          description?: string | null
          type?: string
          status?: string
          parent_id?: string | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      mockups: {
        Row: {
          id: string
          page_id: string
          version: number
          html_content: string
          css_content: string | null
          javascript_content: string | null
          description: string | null
          is_current: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          page_id: string
          version?: number
          html_content: string
          css_content?: string | null
          javascript_content?: string | null
          description?: string | null
          is_current?: boolean
          created_by?: string
          created_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          version?: number
          html_content?: string
          css_content?: string | null
          javascript_content?: string | null
          description?: string | null
          is_current?: boolean
          created_by?: string
          created_at?: string
        }
      }
      features: {
        Row: {
          id: string
          project_id: string
          name: string
          description: string | null
          category: string | null
          status: string
          priority: string
          requirements: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description?: string | null
          category?: string | null
          status?: string
          priority?: string
          requirements?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string | null
          category?: string | null
          status?: string
          priority?: string
          requirements?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      journeys: {
        Row: {
          id: string
          project_id: string
          name: string
          description: string | null
          persona: string | null
          entry_point: string | null
          goal: string | null
          steps: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          description?: string | null
          persona?: string | null
          entry_point?: string | null
          goal?: string | null
          steps?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          description?: string | null
          persona?: string | null
          entry_point?: string | null
          goal?: string | null
          steps?: Json
          created_at?: string
          updated_at?: string
        }
      }
      design_system: {
        Row: {
          id: string
          project_id: string
          colors: Json
          typography: Json
          spacing: Json
          components: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          colors?: Json
          typography?: Json
          spacing?: Json
          components?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          colors?: Json
          typography?: Json
          spacing?: Json
          components?: Json
          created_at?: string
          updated_at?: string
        }
      }
      project_schema: {
        Row: {
          id: string
          project_id: string
          models: Json
          version: number
          is_current: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          models?: Json
          version?: number
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          models?: Json
          version?: number
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      workspace_items: {
        Row: {
          id: string
          project_id: string
          user_id: string
          name: string
          type: string
          original_name: string | null
          mime_type: string | null
          size_bytes: number | null
          storage_path: string | null
          content_text: string | null
          ai_analysis: Json
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          name: string
          type: string
          original_name?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          content_text?: string | null
          ai_analysis?: Json
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          name?: string
          type?: string
          original_name?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          content_text?: string | null
          ai_analysis?: Json
          tags?: string[] | null
          created_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          project_id: string
          user_id: string
          title: string | null
          context_mode: string
          context_id: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          title?: string | null
          context_mode?: string
          context_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          title?: string | null
          context_mode?: string
          context_id?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: string
          content: string
          message_type: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role: string
          content: string
          message_type?: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role?: string
          content?: string
          message_type?: string
          metadata?: Json
          created_at?: string
        }
      }
      ai_actions: {
        Row: {
          id: string
          message_id: string
          action_type: string
          entity_type: string
          entity_id: string
          changes: Json
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          action_type: string
          entity_type: string
          entity_id: string
          changes?: Json
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          action_type?: string
          entity_type?: string
          entity_id?: string
          changes?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_mockup: {
        Args: {
          page_id: string
        }
        Returns: {
          id: string
          html_content: string
          css_content: string | null
          javascript_content: string | null
        }[]
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
