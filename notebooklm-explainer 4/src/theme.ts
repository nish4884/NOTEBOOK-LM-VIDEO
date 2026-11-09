// theme.ts — single source of truth. NEVER inline colors, easings, springs or fonts in components.
import { Easing } from "remotion";

// Scheme 2: "Midnight Notebook"
export const theme = {
  colors: {
    bg: "#0B1020",
    bgAlt: "#131B35",
    primary: "#4C8DFF", // THE hero color
    accent: "#2DE2C4",
    text: "#EAF1FF",
    textDim: "#9AA8C7",
    glow: "rgba(76, 141, 255, 0.45)",
    glowAccent: "rgba(45, 226, 196, 0.35)",
    surface: "rgba(255, 255, 255, 0.06)",
    surfaceStrong: "rgba(255, 255, 255, 0.10)",
    border: "rgba(255, 255, 255, 0.14)",
    paper: "#FFFFFF", // logo cards (logos are designed on white)
    ink: "#0B1020",
  },
  gradient: {
    hero: "linear-gradient(120deg, #4C8DFF 0%, #2DE2C4 100%)",
    card: "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)",
  },
  fonts: {
    display: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
    body: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
  },
  weight: { title: 700, strong: 600, body: 500, light: 400 },
  radius: { card: 28, small: 16, pill: 999 },
  shadow: {
    card: "0 30px 70px -20px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.06) inset",
    glow: "0 0 60px rgba(76,141,255,0.45), 0 0 120px rgba(76,141,255,0.22)",
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    bouncy: { damping: 11, stiffness: 170, mass: 0.7 },
  },
  sfxVolume: { whoosh: 0.26, pop: 0.3, click: 0.3, chime: 0.28, swipe: 0.24, thud: 0.22 },
} as const;
