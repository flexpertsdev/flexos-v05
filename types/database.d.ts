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
          title: string | null
          status: string
          model: string
          total_messages: number
          context: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          wizard_run_id?: string | null
          title?: string | null
          status?: string
          model?: string
          total_messages?: number
          context?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          wizard_run_id?: string | null
          title?: string | null
          status?: string
          model?: string
          total_messages?: number
          context?: Json
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          chat_id: string
          project_id: string
          user_id: string
          role: 'user' | 'assistant' | 'system'
          content: string | null
          context_mode: 'focus' | 'builder' | 'wizard'
          wizard_session_id: string | null
          message_type: 'text' | 'thinking' | 'selection' | 'comparison' | 'form' | 'visual' | 'code' | 'design'
          message_data: Json
          is_streaming: boolean
          stream_id: string | null
          stream_completed: boolean
          contexts: Json
          created_entities: Json
          suggested_actions: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          project_id: string
          user_id: string
          role: 'user' | 'assistant' | 'system'
          content?: string | null
          context_mode?: 'focus' | 'builder' | 'wizard'
          wizard_session_id?: string | null
          message_type?: 'text' | 'thinking' | 'selection' | 'comparison' | 'form' | 'visual' | 'code' | 'design'
          message_data?: Json
          is_streaming?: boolean
          stream_id?: string | null
          stream_completed?: boolean
          contexts?: Json
          created_entities?: Json
          suggested_actions?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          project_id?: string
          user_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string | null
          context_mode?: 'focus' | 'builder' | 'wizard'
          wizard_session_id?: string | null
          message_type?: 'text' | 'thinking' | 'selection' | 'comparison' | 'form' | 'visual' | 'code' | 'design'
          message_data?: Json
          is_streaming?: boolean
          stream_id?: string | null
          stream_completed?: boolean
          contexts?: Json
          created_entities?: Json
          suggested_actions?: Json
          created_at?: string
          updated_at?: string
        }
      }
      message_outputs: {
        Row: {
          id: string
          message_id: string
          output_type: string
          entity_id: string
          entity_table: string
          entity_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          output_type: string
          entity_id: string
          entity_table: string
          entity_data: Json
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          output_type?: string
          entity_id?: string
          entity_table?: string
          entity_data?: Json
          created_at?: string
        }
      }
      message_actions: {
        Row: {
          id: string
          message_id: string
          action_type: 'button' | 'suggestion' | 'quick_reply'
          action_key: string
          label: string
          description: string | null
          icon: string | null
          style: Json
          action_data: Json
          requires_confirmation: boolean
          is_enabled: boolean
          was_used: boolean
          used_at: string | null
          used_by: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          message_id: string
          action_type: 'button' | 'suggestion' | 'quick_reply'
          action_key: string
          label: string
          description?: string | null
          icon?: string | null
          style?: Json
          action_data: Json
          requires_confirmation?: boolean
          is_enabled?: boolean
          was_used?: boolean
          used_at?: string | null
          used_by?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          action_type?: 'button' | 'suggestion' | 'quick_reply'
          action_key?: string
          label?: string
          description?: string | null
          icon?: string | null
          style?: Json
          action_data?: Json
          requires_confirmation?: boolean
          is_enabled?: boolean
          was_used?: boolean
          used_at?: string | null
          used_by?: string | null
          display_order?: number
          created_at?: string
        }
      }
      wizard_sessions: {
        Row: {
          id: string
          user_id: string
          project_id: string
          wizard_type: string
          status: 'active' | 'completed' | 'abandoned'
          total_steps: number | null
          completed_steps: string[]
          current_step: string | null
          collected_data: Json
          pending_decisions: Json
          started_at: string
          completed_at: string | null
          updated_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          wizard_type: string
          status?: 'active' | 'completed' | 'abandoned'
          total_steps?: number | null
          completed_steps?: string[]
          current_step?: string | null
          collected_data?: Json
          pending_decisions?: Json
          started_at?: string
          completed_at?: string | null
          updated_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          wizard_type?: string
          status?: 'active' | 'completed' | 'abandoned'
          total_steps?: number | null
          completed_steps?: string[]
          current_step?: string | null
          collected_data?: Json
          pending_decisions?: Json
          started_at?: string
          completed_at?: string | null
          updated_at?: string
          expires_at?: string
        }
      }
      attachments: {
        Row: {
          id: string
          project_id: string
          user_id: string
          message_id: string | null
          attachment_type: 'file' | 'image' | 'document' | 'url' | 'project_context' | 'selection' | 'component_reference'
          name: string
          original_name: string | null
          mime_type: string | null
          size_bytes: number | null
          storage_path: string | null
          public_url: string | null
          parsed_content: Json
          metadata: Json
          processing_status: 'pending' | 'processing' | 'completed' | 'failed'
          processing_error: string | null
          processing_attempts: number
          created_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          message_id?: string | null
          attachment_type: 'file' | 'image' | 'document' | 'url' | 'project_context' | 'selection' | 'component_reference'
          name: string
          original_name?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          public_url?: string | null
          parsed_content?: Json
          metadata?: Json
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          processing_error?: string | null
          processing_attempts?: number
          created_at?: string
          processed_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          message_id?: string | null
          attachment_type?: 'file' | 'image' | 'document' | 'url' | 'project_context' | 'selection' | 'component_reference'
          name?: string
          original_name?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string | null
          public_url?: string | null
          parsed_content?: Json
          metadata?: Json
          processing_status?: 'pending' | 'processing' | 'completed' | 'failed'
          processing_error?: string | null
          processing_attempts?: number
          created_at?: string
          processed_at?: string | null
        }
      }
      project_flows: {
        Row: {
          id: string
          project_id: string
          user_id: string
          name: string
          description: string | null
          nodes: Json
          edges: Json
          viewport: Json
          layout_type: 'auto' | 'hierarchical' | 'force' | 'manual'
          layout_config: Json
          node_groups: Json
          version: number
          is_current: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          name?: string
          description?: string | null
          nodes?: Json
          edges?: Json
          viewport?: Json
          layout_type?: 'auto' | 'hierarchical' | 'force' | 'manual'
          layout_config?: Json
          node_groups?: Json
          version?: number
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          name?: string
          description?: string | null
          nodes?: Json
          edges?: Json
          viewport?: Json
          layout_type?: 'auto' | 'hierarchical' | 'force' | 'manual'
          layout_config?: Json
          node_groups?: Json
          version?: number
          is_current?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      flow_node_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          node_type: string
          default_data: Json
          default_style: Json
          allowed_source_types: string[]
          allowed_target_types: string[]
          max_connections: number | null
          icon: string | null
          color: string | null
          is_system: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          node_type: string
          default_data?: Json
          default_style?: Json
          allowed_source_types?: string[]
          allowed_target_types?: string[]
          max_connections?: number | null
          icon?: string | null
          color?: string | null
          is_system?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          node_type?: string
          default_data?: Json
          default_style?: Json
          allowed_source_types?: string[]
          allowed_target_types?: string[]
          max_connections?: number | null
          icon?: string | null
          color?: string | null
          is_system?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      builder_states: {
        Row: {
          id: string
          project_id: string
          user_id: string
          current_mode: 'builder' | 'focus' | 'map'
          active_tab: string
          panel_sizes: Json
          collapsed_panels: string[]
          panel_order: string[]
          focus_preferences: Json
          map_preferences: Json
          preferences: Json
          last_active_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          current_mode?: 'builder' | 'focus' | 'map'
          active_tab?: string
          panel_sizes?: Json
          collapsed_panels?: string[]
          panel_order?: string[]
          focus_preferences?: Json
          map_preferences?: Json
          preferences?: Json
          last_active_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          current_mode?: 'builder' | 'focus' | 'map'
          active_tab?: string
          panel_sizes?: Json
          collapsed_panels?: string[]
          panel_order?: string[]
          focus_preferences?: Json
          map_preferences?: Json
          preferences?: Json
          last_active_at?: string
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