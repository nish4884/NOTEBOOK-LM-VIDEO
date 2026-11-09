// SRT -> src/cues.generated.ts  (run: npm run cues)
import fs from "node:fs";
const srt = fs.readFileSync(new URL("../script/narration.srt", import.meta.url), "utf8").replace(/\r/g, "");
const toMs = (t) => {
  const m = t.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  return ((+m[1] * 60 + +m[2]) * 60 + +m[3]) * 1000 + +m[4].padEnd(3, "0").slice(0, 3) * 1;
};
const cues = srt.trim().split(/\n\s*\n/).map((b) => {
  const lines = b.split("\n");
  const [a, z] = lines[1].split("-->");
  return { startMs: toMs(a), endMs: toMs(z), text: lines.slice(2).join(" ").trim() };
});
const out = `// AUTO-GENERATED from script/narration.srt by scripts/make-cues.mjs — do not edit by hand.\nexport type Cue = { startMs: number; endMs: number; text: string };\nexport const CUES: Cue[] = ${JSON.stringify(cues, null, 2)};\n`;
fs.writeFileSync(new URL("../src/cues.generated.ts", import.meta.url), out);
console.log(`cues: ${cues.length}, last end ${cues.at(-1).endMs} ms`);
