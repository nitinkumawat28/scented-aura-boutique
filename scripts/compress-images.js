import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, "../src/assets");
const productsDir = path.join(assetsDir, "products");

async function compressDirectory(dirPath) {
  try {
    const files = await fs.promises.readdir(dirPath);
    const pngFiles = files.filter(f => f.endsWith(".png"));
    
    console.log(`\nScanning directory: ${path.relative(process.cwd(), dirPath)}`);
    console.log(`Found ${pngFiles.length} PNG files.`);

    for (const file of pngFiles) {
      const inputPath = path.join(dirPath, file);
      const outputPath = path.join(dirPath, file.replace(".png", ".webp"));

      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        const inputStat = fs.statSync(inputPath);
        const outputStat = fs.statSync(outputPath);
        
        const beforeKB = (inputStat.size / 1024).toFixed(1);
        const afterKB = (outputStat.size / 1024).toFixed(1);
        const savedPercent = ((1 - outputStat.size / inputStat.size) * 100).toFixed(1);
        
        console.log(`✅ ${file} -> ${file.replace(".png", ".webp")} | ${beforeKB}KB -> ${afterKB}KB (-${savedPercent}%)`);
      } catch (err) {
        console.error(`❌ Failed to convert ${file}:`, err);
      }
    }
  } catch (err) {
    console.error(`❌ Failed to read directory ${dirPath}:`, err);
  }
}

async function run() {
  console.log("🚀 Starting Image WebP Conversion & Optimization...");
  // Compress products
  await compressDirectory(productsDir);
  // Compress general assets (like hero-perfume.png)
  await compressDirectory(assetsDir);
  console.log("\n🎉 Image conversion completed!");
}

run();
