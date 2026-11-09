// Verifies every WAV in public/sfx: duration, peak, RMS, clipping.  (run: npm run check-sfx)
import fs from "node:fs";
const dir = new URL("../public/sfx/", import.meta.url).pathname;
let bad = false;
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".wav"))) {
  const b = fs.readFileSync(dir + f); const n = (b.length - 44) / 2;
  let peak = 0, sum = 0, clip = 0;
  for (let i = 0; i < n; i++) { const v = b.readInt16LE(44 + i * 2) / 32768; peak = Math.max(peak, Math.abs(v)); sum += v * v; if (Math.abs(v) >= 0.999) clip++; }
  const sec = n / b.readUInt32LE(24), rms = Math.sqrt(sum / n);
  const db = (v) => (20 * Math.log10(v || 1e-9)).toFixed(1);
  const max = f.startsWith("whoosh") || f.startsWith("swipe") ? 0.8 : 0.5;
  const ok = sec <= max && peak < 0.95 && clip === 0; if (!ok) bad = true;
  console.log(`${ok ? "OK " : "BAD"} ${f.padEnd(11)} ${sec.toFixed(3)}s  peak ${peak.toFixed(3)} (${db(peak)} dBFS)  rms ${db(rms)} dBFS  clipped ${clip}`);
}
process.exit(bad ? 1 : 0);
