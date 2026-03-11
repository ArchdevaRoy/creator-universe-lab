export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      karma_events: {
        Row: {
          created_at: string
          id: string
          item_id: string
          milestone: number
          points: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          milestone: number
          points: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          milestone?: number
          points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "karma_events_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "library_items"
            referencedColumns: ["id"]
          },
        ]
      }
      library_items: {
        Row: {
          category: Database["public"]["Enums"]["content_category"]
          content_type: Database["public"]["Enums"]["library_content_type"]
          created_at: string
          creator_id: string
          description: string | null
          duration_seconds: number | null
          file_url: string | null
          genre: Database["public"]["Enums"]["music_genre"]
          id: string
          karma_total: number
          play_count: number
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["content_category"]
          content_type: Database["public"]["Enums"]["library_content_type"]
          created_at?: string
          creator_id: string
          description?: string | null
          duration_seconds?: number | null
          file_url?: string | null
          genre?: Database["public"]["Enums"]["music_genre"]
          id?: string
          karma_total?: number
          play_count?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["content_category"]
          content_type?: Database["public"]["Enums"]["library_content_type"]
          created_at?: string
          creator_id?: string
          description?: string | null
          duration_seconds?: number | null
          file_url?: string | null
          genre?: Database["public"]["Enums"]["music_genre"]
          id?: string
          karma_total?: number
          play_count?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      creator_karma: {
        Row: {
          creator_id: string | null
          total_events: number | null
          total_karma: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_karma: {
        Args: { p_item_id: string; p_milestone: number; p_user_id: string }
        Returns: Json
      }
      increment_play_count: { Args: { p_item_id: string }; Returns: undefined }
    }
    Enums: {
      content_category:
        | "tutorial"
        | "vlog"
        | "podcast"
        | "cinematic"
        | "asmr"
        | "documentary"
        | "music-video"
        | "short-film"
        | "behind-the-scenes"
        | "live-session"
        | "remix"
        | "original"
        | "other"
      library_content_type: "audio" | "video"
      music_genre:
        | "hip-hop"
        | "electronic"
        | "r-and-b"
        | "rock"
        | "lo-fi"
        | "jazz"
        | "classical"
        | "pop"
        | "ambient"
        | "metal"
        | "soul"
        | "reggae"
        | "country"
        | "latin"
        | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_category: [
        "tutorial",
        "vlog",
        "podcast",
        "cinematic",
        "asmr",
        "documentary",
        "music-video",
        "short-film",
        "behind-the-scenes",
        "live-session",
        "remix",
        "original",
        "other",
      ],
      library_content_type: ["audio", "video"],
      music_genre: [
        "hip-hop",
        "electronic",
        "r-and-b",
        "rock",
        "lo-fi",
        "jazz",
        "classical",
        "pop",
        "ambient",
        "metal",
        "soul",
        "reggae",
        "country",
        "latin",
        "other",
      ],
    },
  },
} as const
