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
      mlb_schedule: {
        Row: {
          away_id: number | null
          away_name: string | null
          away_pitcher_note: string | null
          away_probable_pitcher: string | null
          away_score: number | null
          created_at: string | null
          current_inning: number | null
          doubleheader: string | null
          game_date: string | null
          game_datetime: string | null
          game_id: number
          game_num: number | null
          game_type: string | null
          home_id: number | null
          home_name: string | null
          home_pitcher_note: string | null
          home_probable_pitcher: string | null
          home_score: number | null
          id: string
          inning_state: string | null
          losing_pitcher: string | null
          losing_team: string | null
          save_pitcher: string | null
          season: number
          status: string | null
          summary: string | null
          venue_id: number | null
          venue_name: string | null
          winning_pitcher: string | null
          winning_team: string | null
        }
        Insert: {
          away_id?: number | null
          away_name?: string | null
          away_pitcher_note?: string | null
          away_probable_pitcher?: string | null
          away_score?: number | null
          created_at?: string | null
          current_inning?: number | null
          doubleheader?: string | null
          game_date?: string | null
          game_datetime?: string | null
          game_id: number
          game_num?: number | null
          game_type?: string | null
          home_id?: number | null
          home_name?: string | null
          home_pitcher_note?: string | null
          home_probable_pitcher?: string | null
          home_score?: number | null
          id?: string
          inning_state?: string | null
          losing_pitcher?: string | null
          losing_team?: string | null
          save_pitcher?: string | null
          season: number
          status?: string | null
          summary?: string | null
          venue_id?: number | null
          venue_name?: string | null
          winning_pitcher?: string | null
          winning_team?: string | null
        }
        Update: {
          away_id?: number | null
          away_name?: string | null
          away_pitcher_note?: string | null
          away_probable_pitcher?: string | null
          away_score?: number | null
          created_at?: string | null
          current_inning?: number | null
          doubleheader?: string | null
          game_date?: string | null
          game_datetime?: string | null
          game_id?: number
          game_num?: number | null
          game_type?: string | null
          home_id?: number | null
          home_name?: string | null
          home_pitcher_note?: string | null
          home_probable_pitcher?: string | null
          home_score?: number | null
          id?: string
          inning_state?: string | null
          losing_pitcher?: string | null
          losing_team?: string | null
          save_pitcher?: string | null
          season?: number
          status?: string | null
          summary?: string | null
          venue_id?: number | null
          venue_name?: string | null
          winning_pitcher?: string | null
          winning_team?: string | null
        }
        Relationships: []
      }
      mlb_teams: {
        Row: {
          created_at: string | null
          file_code: string | null
          id: string
          location_name: string | null
          mlb_team_id: number
          name: string | null
          short_name: string | null
          team_code: string | null
          team_name: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          file_code?: string | null
          id?: string
          location_name?: string | null
          mlb_team_id: number
          name?: string | null
          short_name?: string | null
          team_code?: string | null
          team_name?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          file_code?: string | null
          id?: string
          location_name?: string | null
          mlb_team_id?: number
          name?: string | null
          short_name?: string | null
          team_code?: string | null
          team_name?: string | null
          year?: number
        }
        Relationships: []
      }
      user_game_logs: {
        Row: {
          company: string | null
          created_at: string | null
          game_id: string
          id: string
          mode: Database["public"]["Enums"]["log_mode"]
          notes: string | null
          rating: number | null
          rooted_for: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          game_id: string
          id?: string
          mode: Database["public"]["Enums"]["log_mode"]
          notes?: string | null
          rating?: number | null
          rooted_for?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string | null
          game_id?: string
          id?: string
          mode?: Database["public"]["Enums"]["log_mode"]
          notes?: string | null
          rating?: number | null
          rooted_for?: string | null
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
      log_mode: "attended" | "watched"
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
    Enums: {
      log_mode: ["attended", "watched"],
    },
  },
} as const
