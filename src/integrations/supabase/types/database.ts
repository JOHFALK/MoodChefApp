import { Tables, TablesInsert, TablesUpdate, Enums } from './tables';

export type Database = {
  public: {
    Tables: {
      [K in keyof Tables]: {
        Row: Tables[K];
        Insert: TablesInsert[K];
        Update: TablesUpdate[K];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [K in keyof Enums]: Enums[K];
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};