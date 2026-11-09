// Synthesizes the SFX kit into public/sfx/*.wav  (run: npm run sfx)
// Zero downloads, deterministic. 16-bit mono 44.1 kHz.
import fs from "node:fs";
import path from "node:path";

const SR = 44100;
const OUT = new URL("../public/sfx/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

// deterministic noise
let seed = 1337;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

const buf = (sec) => new Float32Array(Math.round(sec * SR));
const lowpass = (x, fc) => { const a = 1 - Math.exp((-2 * Math.PI * fc) / SR); let y = 0; for (let i = 0; i < x.length; i++) { y += a * (x[i] - y); x[i] = y; } return x; };
const highpass = (x, fc) => { const a = Math.exp((-2 * Math.PI * fc) / SR); let py = 0, px = 0; for (let i = 0; i < x.length; i++) { const y = a * (py + x[i] - px); px = x[i]; py = y; x[i] = y; } return x; };
const reverb = (x, mix = 0.14) => {
  const taps = [[0.029, 0.32], [0.037, 0.28], [0.043, 0.24]];
  const out = Float32Array.from(x);
  for (const [d, g] of taps) { const n = Math.round(d * SR); for (let i = n; i < x.length; i++) out[i] += out[i - n] * g * mix * 3; }
  return out;
};
const fadeEdges = (x, inMs = 3, outMs = 30) => {
  const a = Math.round((inMs / 1000) * SR), b = Math.round((outMs / 1000) * SR);
  for (let i = 0; i < a; i++) x[i] *= i / a;
  for (let i = 0; i < b; i++) x[x.length - 1 - i] *= i / b;
  return x;
};
// band-pass via state-variable filter with sweeping centre frequency
const svfSweep = (src, f0, f1, q, curve = (t) => t) => {
  const y = new Float32Array(src.length); let low = 0, band = 0;
  for (let i = 0; i < src.length; i++) {
    const t = curve(i / src.length);
    const fc = f0 * Math.pow(f1 / f0, t);
    const f = 2 * Math.sin((Math.PI * fc) / SR);
    low += f * band; const high = src[i] - low - band / q; band += f * high; y[i] = band;
  }
  return y;
};

const kit = {
  pop() {
    const x = buf(0.22);
    let ph = 0;
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      const f = 190 + 380 * Math.exp(-t / 0.028);
      ph += (2 * Math.PI * f) / SR;
      const env = (1 - Math.exp(-t / 0.003)) * Math.exp(-t / 0.055);
      x[i] = (Math.sin(ph) + 0.18 * Math.sin(2 * ph)) * env;
    }
    return reverb(lowpass(fadeEdges(x, 2, 40), 3200));
  },
  click() {
    const x = buf(0.1);
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      const env = (1 - Math.exp(-t / 0.0008)) * Math.exp(-t / 0.009);
      x[i] = (rnd() * 0.9 + 0.35 * Math.sin(2 * Math.PI * 1900 * t)) * env;
    }
    return lowpass(highpass(fadeEdges(x, 1, 20), 2400), 7000);
  },
  whoosh() {
    const n = buf(0.58); for (let i = 0; i < n.length; i++) n[i] = rnd();
    const y = svfSweep(n, 320, 1900, 1.6, (t) => t * t * (3 - 2 * t));
    for (let i = 0; i < y.length; i++) { const t = i / y.length; y[i] *= Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), 2) * 0.9; }
    return reverb(lowpass(fadeEdges(y, 5, 60), 5200), 0.1);
  },
  swipe() {
    const n = buf(0.42); for (let i = 0; i < n.length; i++) n[i] = rnd();
    const y = svfSweep(n, 700, 3600, 2.2, (t) => 1 - Math.pow(1 - t, 2));
    for (let i = 0; i < y.length; i++) { const t = i / y.length; y[i] *= Math.pow(Math.sin(Math.PI * t), 1.6); }
    return reverb(lowpass(fadeEdges(y, 5, 50), 6500), 0.1);
  },
  chime() {
    const x = buf(0.5);
    const partials = [[880, 1, 0.22], [1320, 0.42, 0.15], [1768, 0.2, 0.1], [2640, 0.08, 0.06]];
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      let s = 0;
      for (const [f, a, tau] of partials) s += a * Math.sin(2 * Math.PI * f * t) * Math.exp(-t / tau);
      x[i] = s * (1 - Math.exp(-t / 0.004));
    }
    return reverb(lowpass(fadeEdges(x, 2, 90), 6000), 0.18);
  },
  thud() {
    const x = buf(0.36); let ph = 0;
    for (let i = 0; i < x.length; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * (52 + 60 * Math.exp(-t / 0.05))) / SR;
      x[i] = Math.sin(ph) * (1 - Math.exp(-t / 0.006)) * Math.exp(-t / 0.085);
    }
    return lowpass(fadeEdges(x, 3, 60), 420);
  },
};

// loudness-match: equal RMS, hard peak ceiling
const TARGET_RMS = 0.13, CEIL = 0.9;
const report = [];
for (const [name, make] of Object.entries(kit)) {
  seed = 1337;
  const x = make();
  let peak = 0, sum = 0, cnt = 0;
  for (const v of x) { peak = Math.max(peak, Math.abs(v)); }
  const thr = peak * 0.05; // RMS over the audible part only
  for (const v of x) if (Math.abs(v) > thr) { sum += v * v; cnt++; }
  const rms = Math.sqrt(sum / Math.max(1, cnt));
  const g = Math.min(TARGET_RMS / rms, CEIL / peak);
  const pcm = Buffer.alloc(44 + x.length * 2);
  pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + x.length * 2, 4); pcm.write("WAVEfmt ", 8);
  pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22);
  pcm.writeUInt32LE(SR, 24); pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34);
  pcm.write("data", 36); pcm.writeUInt32LE(x.length * 2, 40);
  for (let i = 0; i < x.length; i++) pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(x[i] * g * 32767))), 44 + i * 2);
  fs.writeFileSync(path.join(OUT, `${name}.wav`), pcm);
  report.push({ name, sec: +(x.length / SR).toFixed(3) });
}
console.log("wrote", report.map((r) => `${r.name}(${r.sec}s)`).join(" "));
