import { Database as DatabaseGenerated } from "./types";
import { SavedRecipe } from "@/types/recipe";

export interface Database extends DatabaseGenerated {
  public: {
    Tables: {
      saved_recipes: {
        Row: SavedRecipe;
        Insert: Omit<SavedRecipe, "id" | "created_at">;
        Update: Partial<Omit<SavedRecipe, "id" | "created_at">>;
      };
    } & DatabaseGenerated["public"]["Tables"];
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];