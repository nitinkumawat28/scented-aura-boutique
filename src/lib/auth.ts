import { supabase } from "./supabase";

/**
 * Checks if the given email is in the allowed "admin access" table.
 * 
 * @param email - The email to check.
 * @returns A promise that resolves to true if the email is an admin, false otherwise.
 */
export async function isAdmin(email: string | undefined | null): Promise<boolean> {
  if (!email) return false;

  try {
    const { data, error } = await supabase
      .from("admin access")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Error verifying admin credentials:", error);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("Exception checking admin credentials:", err);
    return false;
  }
}
