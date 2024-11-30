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
      email_notifications: {
        Row: {
          email_type: string
          id: string
          metadata: Json | null
          notification_type: string
          sent_at: string | null
          status: string | null
          template_id: string | null
          user_id: string
          variables: Json | null
        }
        Insert: {
          email_type?: string
          id?: string
          metadata?: Json | null
          notification_type: string
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
          user_id: string
          variables?: Json | null
        }
        Update: {
          email_type?: string
          id?: string
          metadata?: Json | null
          notification_type?: string
          sent_at?: string | null
          status?: string | null
          template_id?: string | null
          user_id?: string
          variables?: Json | null
        }
        Relationships: []
      }
      meal_plan_generations: {
        Row: {
          generated_at: string | null
          id: string
          plan_id: string
          user_id: string
        }
        Insert: {
          generated_at?: string | null
          id?: string
          plan_id: string
          user_id: string
        }
        Update: {
          generated_at?: string | null
          id?: string
          plan_id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          allergies: string[] | null
          avatar_url: string | null
          country: string | null
          cuisine_style: string | null
          dietary_preference: string | null
          full_name: string | null
          id: string
          last_meal_plan_generated: string | null
          notification_preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          allergies?: string[] | null
          avatar_url?: string | null
          country?: string | null
          cuisine_style?: string | null
          dietary_preference?: string | null
          full_name?: string | null
          id: string
          last_meal_plan_generated?: string | null
          notification_preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          allergies?: string[] | null
          avatar_url?: string | null
          country?: string | null
          cuisine_style?: string | null
          dietary_preference?: string | null
          full_name?: string | null
          id?: string
          last_meal_plan_generated?: string | null
          notification_preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          end_date: string
          id: string
          payment_reference: string | null
          plan_id: string
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          payment_reference?: string | null
          plan_id: string
          start_date?: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          payment_reference?: string | null
          plan_id?: string
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_auth_status: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_attempt: string | null
          login_attempts: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          last_attempt?: string | null
          login_attempts?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_attempt?: string | null
          login_attempts?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      trial_status: {
        Row: {
          end_date: string | null
          is_expired: boolean | null
          plan_id: string | null
          user_id: string | null
        }
        Insert: {
          end_date?: string | null
          is_expired?: never
          plan_id?: string | null
          user_id?: string | null
        }
        Update: {
          end_date?: string | null
          is_expired?: never
          plan_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      check_trial_expiration: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
