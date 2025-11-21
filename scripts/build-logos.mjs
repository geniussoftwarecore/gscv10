import fs from "fs";
import path from "path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const SRC = path.resolve("assets/logo-source.png");
const OUT = path.resolve("client/public/brand");

if (!fs.existsSync(SRC)) {
  console.error("❌ Missing assets/logo-source.png");
  process.exit(1);
}

if (!fs.existsSync(OUT)) {
  fs.mkdirSync(OUT, { recursive: true });
}

const tasks = [
  { name: "logo-gsc-512.png", size: 512 },
  { name: "logo-gsc-256.png", size: 256 },
  { name: "logo-gsc-192.png", size: 192 },
  { name: "logo-gsc-150.png", size: 150 },
  { name: "logo-gsc-96.png",  size: 96  },
  { name: "logo-gsc-64.png",  size: 64  },
  { name: "logo-gsc-48.png",  size: 48  },
  { name: "logo-gsc-32.png",  size: 32  },
  { name: "logo-gsc-16.png",  size: 16  },
  // Special presets for UI components
  { name: "logo-gsc-navbar.png", height: 28 },        // 24-28px effective height
  { name: "logo-gsc-hero-desktop.png", height: 64 },  // 56-72px
  { name: "logo-gsc-hero-mobile.png",  height: 44 }   // 40-48px
];

const resize = async (input, output, opt) => {
  let img = sharp(input);
  
  if (opt.size) {
    // Square resize for standard sizes
    img = img.resize({
      width: opt.size,
      height: opt.size,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    });
  } else if (opt.height) {
    // Height-constrained resize for UI presets
    img = img.resize({
      height: opt.height,
      fit: "inside",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    });
  }
  
  await img.png({ 
    compressionLevel: 9, 
    adaptiveFiltering: true 
  }).toFile(output);
};

const run = async () => {
  console.log("🚀 Generating GSC logo assets...\n");
  
  for (const task of tasks) {
    const outputPath = path.join(OUT, task.name);
    await resize(SRC, outputPath, task);
    console.log("✅", task.name);
  }
  
  // Generate favicon.ico from 16px and 32px versions
  console.log("\n🔧 Creating favicon.ico...");
  const favicon16 = fs.readFileSync(path.join(OUT, "logo-gsc-16.png"));
  const favicon32 = fs.readFileSync(path.join(OUT, "logo-gsc-32.png"));
  const icoBuffer = await pngToIco([favicon16, favicon32]);
  fs.writeFileSync("client/public/favicon.ico", icoBuffer);
  console.log("✅ favicon.ico");
  
  console.log("\n🎉 All logo assets generated successfully!");
  console.log("📁 Assets location: client/public/brand/");
};

run().catch((error) => {
  console.error("❌ Error generating logos:", error);
  process.exit(1);
});