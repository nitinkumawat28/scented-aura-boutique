import { supabase } from "./supabase";

/**
 * Checks if the given user ID or email is in the allowed "admin access" table.
 * 
 * @param id - The auth user ID to check.
 * @param email - The email to check.
 * @returns A promise that resolves to true if authorized, false otherwise.
 */
export async function isAdmin(id: string | undefined | null, email?: string | undefined | null): Promise<boolean> {
  if (!id && !email) return false;

  try {
    // 1. Check by user ID first if available
    if (id) {
      const { data, error } = await supabase
        .from("admin access")
        .select("id")
        .eq("id", id)
        .maybeSingle();

      if (!error && data) return true;
    }

    // 2. Fallback to check by email if available (case-insensitive & trimmed)
    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase
        .from("admin access")
        .select("email")
        .ilike("email", cleanEmail)
        .maybeSingle();

      if (!error && data) return true;
    }

    return false;
  } catch (err) {
    console.error("Exception checking admin credentials:", err);
    return false;
  }
}
