const obfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

const sourceDir = "dist/Rivo";
const outputDir = "dist/Rivo-obfuscated";

function ChickPath(file) {
  if (typeof file === "string") {
    if (file.endsWith('js')) {   
      return true;
    }
  }
  return false;
}

function obfuscateFile(filePath, relativePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  const obfuscatedCode = obfuscator
    .obfuscate(code, {
      compact: true,
      deadCodeInjection: false,
      stringArray: true,
      stringArrayThreshold: 0.1,
      stringArrayEncoding: ['base64', 'rc4'],
      selfDefending: false,
      disableConsoleOutput: true,
      transformObjectKeys: true,
      debugProtection:true,
      sourceMap: false,
    })
    .getObfuscatedCode();

  const outputPath = path.join(outputDir, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, obfuscatedCode, "utf-8");

}

function copyAndObfuscateFiles(dir, base = "") {
  const items = fs.readdirSync(dir);
  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const relPath = path.join(base, item);
    const stat = fs.statSync(fullPath);
    console.log("🧐"," chick file path => ", `'${fullPath}' \n\n`)
    if (stat.isDirectory()) {
      copyAndObfuscateFiles(fullPath, relPath);
    } else if (ChickPath(relPath)) {
      console.log("start date  ",Date.now());
      console.log("\uD83D\uDE80"," start Encryption file => ", `'${fullPath}' .... \n\n`);
      obfuscateFile(fullPath, relPath);
      console.log("end date  ",Date.now());
      console.log("👍"," end Encryption file => ", `'${fullPath}' .... \n\n`);
    } else {
      console.log("\u274C"," No Encryption  file => ", `'${fullPath}' \n\n`)
      const dest = path.join(outputDir, relPath);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      // نسخ الملف كما هو
      fs.copyFileSync(fullPath, dest);
    }
  });
}
console.log("start date  ",Date.now());
// تنظيف المجلد القديم
if (fs.existsSync(outputDir)) fs.rmSync(outputDir, { recursive: true });

// تشغيل التشفير

copyAndObfuscateFiles(sourceDir);
console.log("End date ",Date.now());
console.log("✅ Obfuscation complete! Output in:", outputDir);
