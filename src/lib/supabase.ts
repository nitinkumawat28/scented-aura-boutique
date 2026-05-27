import { createClient } from "@supabase/supabase-js";

// Local image imports for high-quality static assets
import royalOud from "@/assets/products/royal-oud.webp";
import kashmiriSaffron from "@/assets/products/kashmiri-saffron.webp";
import mograAbsolute from "@/assets/products/mogra-absolute.webp";
import mysoreSandalwood from "@/assets/products/mysore-sandalwood.webp";
import darjeelingTea from "@/assets/products/darjeeling-tea.webp";
import malabarSpice from "@/assets/products/malabar-spice.webp";
import monsoonRain from "@/assets/products/monsoon-rain.webp";
import varanasiRose from "@/assets/products/varanasi-rose.webp";

// Map Supabase product image column values to compiled assets
export const imageMap: Record<string, string> = {
  "royal-oud": royalOud,
  "kashmiri-saffron": kashmiriSaffron,
  "mogra-absolute": mograAbsolute,
  "mysore-sandalwood": mysoreSandalwood,
  "darjeeling-tea": darjeelingTea,
  "malabar-spice": malabarSpice,
  "monsoon-rain": monsoonRain,
  "varanasi-rose": varanasiRose,
};

export const supabaseUrl = 
  (typeof process !== "undefined" ? process.env?.VITE_SUPABASE_URL : undefined) ||
  import.meta.env.VITE_SUPABASE_URL || 
  "https://your-project-id.supabase.co";

export const isSupabaseConfigured = !supabaseUrl.includes("your-project-id");

const supabaseAnonKey = 
  (typeof process !== "undefined" ? process.env?.VITE_SUPABASE_ANON_KEY : undefined) ||
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Automatically retries an async database request up to N times with exponential backoff.
 */
export async function retryRequest<T>(fn: () => Promise<T>, retries = 2, delayMs = 1000): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    console.warn(`Supabase request failed. Retrying in ${delayMs}ms... (${retries} retries left)`);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return retryRequest(fn, retries - 1, delayMs * 2);
  }
}
