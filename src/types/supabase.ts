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
      external_game_providers: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      game_notes: {
        Row: {
          content: string
          created_at: string | null
          game_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          game_id: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          game_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "game_notes_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "user_games"
            referencedColumns: ["id"]
          },
        ]
      }
      user_games: {
        Row: {
          achievements_earned: number | null
          achievements_total: number | null
          completion_percentage: number | null
          cover_art: string | null
          created_at: string | null
          estimated_completion_time: number | null
          genre: string | null
          id: string
          platform: string | null
          playtime: number | null
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements_earned?: number | null
          achievements_total?: number | null
          completion_percentage?: number | null
          cover_art?: string | null
          created_at?: string | null
          estimated_completion_time?: number | null
          genre?: string | null
          id?: string
          platform?: string | null
          playtime?: number | null
          status?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements_earned?: number | null
          achievements_total?: number | null
          completion_percentage?: number | null
          cover_art?: string | null
          created_at?: string | null
          estimated_completion_time?: number | null
          genre?: string | null
          id?: string
          platform?: string | null
          playtime?: number | null
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_games_external_providers: {
        Row: {
          created_at: string | null
          external_game_id: string
          external_game_provider_id: string
          id: string
          updated_at: string | null
          user_game_id: string
        }
        Insert: {
          created_at?: string | null
          external_game_id: string
          external_game_provider_id: string
          id?: string
          updated_at?: string | null
          user_game_id: string
        }
        Update: {
          created_at?: string | null
          external_game_id?: string
          external_game_provider_id?: string
          id?: string
          updated_at?: string | null
          user_game_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_games_external_providers_external_game_provider_id_fkey"
            columns: ["external_game_provider_id"]
            isOneToOne: false
            referencedRelation: "external_game_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_games_external_providers_user_game_id_fkey"
            columns: ["user_game_id"]
            isOneToOne: false
            referencedRelation: "user_games"
            referencedColumns: ["id"]
          },
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
