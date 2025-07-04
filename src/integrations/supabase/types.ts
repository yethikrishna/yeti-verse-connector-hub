export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_model_configurations: {
        Row: {
          context_tokens: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          model_name: string
          model_type: string
          provider: string
          updated_at: string | null
          yeti_display_name: string
        }
        Insert: {
          context_tokens?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model_name: string
          model_type: string
          provider: string
          updated_at?: string | null
          yeti_display_name: string
        }
        Update: {
          context_tokens?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          model_name?: string
          model_type?: string
          provider?: string
          updated_at?: string | null
          yeti_display_name?: string
        }
        Relationships: []
      }
      deployment_logs: {
        Row: {
          author_email: string | null
          author_name: string | null
          commit_id: string | null
          commit_message: string | null
          created_at: string | null
          deploy_id: string | null
          deploy_url: string | null
          id: number
          site_name: string | null
          site_status: string | null
          timestamp: string | null
        }
        Insert: {
          author_email?: string | null
          author_name?: string | null
          commit_id?: string | null
          commit_message?: string | null
          created_at?: string | null
          deploy_id?: string | null
          deploy_url?: string | null
          id?: number
          site_name?: string | null
          site_status?: string | null
          timestamp?: string | null
        }
        Update: {
          author_email?: string | null
          author_name?: string | null
          commit_id?: string | null
          commit_message?: string | null
          created_at?: string | null
          deploy_id?: string | null
          deploy_url?: string | null
          id?: number
          site_name?: string | null
          site_status?: string | null
          timestamp?: string | null
        }
        Relationships: []
      }
      user_ai_usage: {
        Row: {
          cost_estimate: number | null
          created_at: string | null
          id: string
          model_name: string
          provider: string
          request_count: number | null
          tokens_used: number | null
          usage_type: string
          user_id: string
        }
        Insert: {
          cost_estimate?: number | null
          created_at?: string | null
          id?: string
          model_name: string
          provider: string
          request_count?: number | null
          tokens_used?: number | null
          usage_type: string
          user_id: string
        }
        Update: {
          cost_estimate?: number | null
          created_at?: string | null
          id?: string
          model_name?: string
          provider?: string
          request_count?: number | null
          tokens_used?: number | null
          usage_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_memories: {
        Row: {
          content: string
          created_at: string | null
          id: string
          memory_type: string
          metadata: Json | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          memory_type: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          memory_type?: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
