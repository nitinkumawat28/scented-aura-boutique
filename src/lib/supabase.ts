import { createClient } from "@supabase/supabase-js";

// Local image imports for high-quality static assets
import royalOud from "@/assets/products/royal-oud.png";
import kashmiriSaffron from "@/assets/products/kashmiri-saffron.png";
import mograAbsolute from "@/assets/products/mogra-absolute.png";
import mysoreSandalwood from "@/assets/products/mysore-sandalwood.png";
import darjeelingTea from "@/assets/products/darjeeling-tea.png";
import malabarSpice from "@/assets/products/malabar-spice.png";
import monsoonRain from "@/assets/products/monsoon-rain.png";
import varanasiRose from "@/assets/products/varanasi-rose.png";

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
