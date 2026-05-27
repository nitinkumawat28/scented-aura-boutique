// Let's write it in a way that executes the actual productService.updateProduct.
// Since we are running in Vite project, we can run a simple Node script that mimics productService.updateProduct exactly.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ptkwzwfdfaouhoiesfsd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a3d6d2ZkZmFvdWhvaWVzZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzEwNDMsImV4cCI6MjA5NTEwNzA0M30.xK1mGIwL6HqnR4OeItjI_lazZxZAqyrJQEf3Jjv3evs";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testUpdate() {
  console.log("🚀 Testing productService.updateProduct mimic...");
  
  const id = "mogra-absolute";
  const updates = {
    name: "Mogra Absolute",
    category: "Floral",
    price: 2799,
    stock: 55,
    tagline: "Radiant white floral",
    description: "Night-blooming Indian jasmine and fresh greens. A rich, intoxicating bouquet of fresh Mogra flowers harvested at dusk, balanced with delicate white musk."
  };

  try {
    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase update error:", error);
    } else {
      console.log("✅ Supabase update success:", data);
    }
  } catch (err) {
    console.error("❌ Exception:", err);
  }
}

testUpdate();
