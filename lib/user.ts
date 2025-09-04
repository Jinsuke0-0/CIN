import { supabase } from "./supabase";

export interface User {
  id: string; // wallet address
  created_at?: string;
}

export async function upsertUser(address: string): Promise<{ data: User | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('users') // Assuming your table name is 'users'
    .upsert({ id: address })
    .select()
    .single();

  if (error) {
    console.error("Error upserting user:", JSON.stringify(error, null, 2));
    return { data: null, error };
  }

  return { data, error: null };
}
