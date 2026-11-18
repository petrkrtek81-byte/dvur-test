// node nastroje/webp.js – ke každé fotce assets/img/*.jpg a assets/img/thumbs/*.jpg vytvoří menší kopii ve formátu WebP.
// Web pak nabídne prohlížeči WebP (rychlejší načítání) a JPEG zůstává jako záloha. Potřebuje ffmpeg s libwebp.
// Spouští se po nastroje/zpracuj-fotky.js; hotové soubory (novější než JPEG) přeskočí.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const DIRS = ['assets/img', 'assets/img/thumbs'];
let made = 0, skipped = 0;
for (const dir of DIRS) {
  const abs = path.join(ROOT, dir);
  for (const f of fs.readdirSync(abs).filter(f => f.endsWith('.jpg'))) {
    const src = path.join(abs, f);
    const out = src.replace(/\.jpg$/, '.webp');
    if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) { skipped++; continue; }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-c:v', 'libwebp', '-quality', '78', '-compression_level', '6', out]);
    made++;
  }
}
let jpg = 0, webp = 0;
for (const d of DIRS) for (const f of fs.readdirSync(path.join(ROOT, d))) {
  const s = fs.statSync(path.join(ROOT, d, f)).size;
  if (f.endsWith('.jpg')) jpg += s; else if (f.endsWith('.webp')) webp += s;
}
console.log(`WebP: vytvořeno ${made}, beze změny ${skipped}. Velikost JPEG ${(jpg / 1e6).toFixed(1)} MB, WebP ${(webp / 1e6).toFixed(1)} MB.`);
