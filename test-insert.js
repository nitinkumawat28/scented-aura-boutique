import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ptkwzwfdfaouhoiesfsd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a3d6d2ZkZmFvdWhvaWVzZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzEwNDMsImV4cCI6MjA5NTEwNzA0M30.xK1mGIwL6HqnR4OeItjI_lazZxZAqyrJQEf3Jjv3evs";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log("🚀 Testing insert with 'intensity' field...");
  
  const newProduct = {
    id: "test-insert-intensity",
    name: "Test Scent",
    price: 1500,
    category: "Fresh",
    tagline: "Test",
    description: "Test",
    notes: { top: ["Test"], heart: ["Test"], base: ["Test"] },
    intensity: "Medium", // Let's see if this fails!
    image: "royal-oud",
    stock: 10,
    featured: false
  };

  try {
    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
    } else {
      console.log("✅ Supabase insert success:", data);
      
      // Clean up
      await supabase
        .from("products")
        .delete()
        .eq("id", "test-insert-intensity");
      console.log("✅ Successfully cleaned up.");
    }
  } catch (err) {
    console.error("❌ Exception:", err);
  }
}

testInsert();
