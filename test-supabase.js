import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ptkwzwfdfaouhoiesfsd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0a3d6d2ZkZmFvdWhvaWVzZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzEwNDMsImV4cCI6MjA5NTEwNzA0M30.xK1mGIwL6HqnR4OeItjI_lazZxZAqyrJQEf3Jjv3evs";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("🔍 Testing Supabase connection...");
  
  // 1. Fetch products
  console.log("\n--- 1. Fetching Products ---");
  const { data: products, error: fetchError } = await supabase
    .from("products")
    .select("*");
    
  if (fetchError) {
    console.error("❌ Error fetching products:", fetchError);
    return;
  }
  
  console.log(`✅ Successfully fetched ${products?.length || 0} products:`);
  if (products) {
    products.forEach(p => {
      console.log(`   - ID: ${p.id} | Name: ${p.name} | Price: ${p.price} | Stock: ${p.stock}`);
    });
  }

  // 2. Try an update on a product if any exist
  if (products && products.length > 0) {
    const firstProduct = products[0];
    console.log(`\n--- 2. Testing Update on Product ID: ${firstProduct.id} ---`);
    
    // Attempt updating name
    const { data: updatedData, error: updateError } = await supabase
      .from("products")
      .update({ name: firstProduct.name + " (Updated Test)" })
      .eq("id", firstProduct.id)
      .select();
      
    if (updateError) {
      console.error("❌ Error updating product:", updateError);
    } else {
      console.log("✅ Successfully updated product:", updatedData);
      
      // Revert the test update
      await supabase
        .from("products")
        .update({ name: firstProduct.name })
        .eq("id", firstProduct.id);
      console.log("✅ Successfully reverted test update.");
    }
  } else {
    console.log("\n⚠️ No products found in the database. Cannot test update.");
  }
}

run().catch(console.error);
