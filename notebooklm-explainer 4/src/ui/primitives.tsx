import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const clampX = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type SpringKey = keyof typeof theme.spring;

export const useSpringAt = (at: number, cfg: SpringKey = "smooth") => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: theme.spring[cfg] });
};

/** Exit factor: 1 before `until`, easing to 0 over `dur` frames (exits are faster than entrances). */
export const useExit = (until: number | undefined, dur = 9) => {
  const frame = useCurrentFrame();
  if (until === undefined) return 1;
  return interpolate(frame, [until, until + dur], [1, 0], { easing: theme.ease.in, ...clampX });
};

/** Premium entrance: opacity + translate + scale together, optional exit. */
export const Pop: React.FC<{
  at: number;
  until?: number;
  x?: number;
  y?: number;
  from?: number;
  cfg?: SpringKey;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ at, until, x = 0, y = 36, from = 0.92, cfg = "smooth", style, children }) => {
  const p = useSpringAt(at, cfg);
  const e = useExit(until);
  const k = Math.min(1, Math.max(0, p));
  return (
    <div
      style={{
        opacity: k * e,
        transform: `translate(${(1 - p) * x}px, ${(1 - p) * y - (1 - e) * 22}px) scale(${(from + (1 - from) * p) * (0.97 + 0.03 * e)})`,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Idle breathing so nothing sits dead still. */
export const Breathe: React.FC<{ amp?: number; speed?: number; phase?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  amp = 6,
  speed = 34,
  phase = 0,
  style,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ transform: `translateY(${Math.sin(frame / speed + phase) * amp}px) scale(${1 + Math.sin(frame / (speed * 1.3) + phase) * 0.008})`, ...style }}>
      {children}
    </div>
  );
};

const GRAD_TEXT: React.CSSProperties = {
  background: theme.gradient.hero,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  WebkitTextFillColor: "transparent",
};

/**
 * Word-by-word staggered reveal. Words split ONLY on spaces (Bengali conjuncts never broken).
 * Prefix a word with * to highlight it (gradient keyword).
 */
export const Words: React.FC<{
  text: string;
  at: number;
  per?: number;
  size?: number;
  weight?: number;
  color?: string;
  align?: "flex-start" | "center" | "flex-end";
  until?: number;
  lineHeight?: number;
  maxWidth?: number;
  style?: React.CSSProperties;
}> = ({ text, at, per = 4, size = 96, weight = theme.weight.title, color = theme.colors.text, align = "center", until, lineHeight = 1.25, maxWidth, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = useExit(until);
  // *…* marks a highlighted phrase (may span several words); asterisks are stripped.
  let on = false;
  const words = text.split(" ").filter(Boolean).map((raw) => {
    if (raw.startsWith("*")) on = true;
    const hi = on || raw.includes("*");
    if (raw.endsWith("*") && raw.length > 1) on = false;
    return { w: raw.replace(/\*/g, ""), hi };
  });
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align,
        columnGap: Math.round(size * 0.26),
        rowGap: Math.round(size * 0.04),
        fontFamily: theme.fonts.display,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: 0,
        color,
        maxWidth,
        opacity: e,
        transform: `translateY(${(1 - e) * -18}px)`,
        ...style,
      }}
    >
      {words.map(({ w, hi }, i) => {
        const p = spring({ frame: frame - at - i * per, fps, config: theme.spring.snappy });
        const k = Math.min(1, Math.max(0, p));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: k,
              transform: `translateY(${(1 - p) * 34}px) scale(${0.9 + 0.1 * p})`,
              ...(hi ? GRAD_TEXT : {}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Left→right mask sweep for text (typewriter-style that never breaks Bengali glyphs). */
export const MaskText: React.FC<{ at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, dur = 18, children, style }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + dur], [0, 1], { easing: theme.ease.out, ...clampX });
  return (
    <div style={{ clipPath: `inset(-10% ${(1 - p) * 100}% -10% 0)`, opacity: p > 0 ? 1 : 0, ...style }}>{children}</div>
  );
};

/** Word-by-word typing for chat/search inputs (blinking caret). */
export const TypedWords: React.FC<{ text: string; at: number; perWord?: number; size: number; color?: string; caret?: boolean; weight?: number }> = ({
  text,
  at,
  perWord = 5,
  size,
  color = theme.colors.text,
  caret = true,
  weight = theme.weight.body,
}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const shown = Math.max(0, Math.min(words.length, Math.floor((frame - at) / perWord) + (frame >= at ? 1 : 0)));
  const done = shown >= words.length;
  const blink = Math.floor(frame / 12) % 2 === 0;
  return (
    <span style={{ fontFamily: theme.fonts.body, fontSize: size, fontWeight: weight, color, letterSpacing: 0, whiteSpace: "pre-wrap" }}>
      {words.slice(0, shown).join(" ")}
      {caret && (!done || blink) && frame >= at - 6 ? <span style={{ display: "inline-block", width: size * 0.07, height: size * 0.9, marginLeft: 6, background: theme.colors.primary, verticalAlign: "middle", borderRadius: 2 }} /> : null}
    </span>
  );
};

export const Glass: React.FC<{ w?: number | string; h?: number | string; pad?: number; radius?: number; strong?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  w,
  h,
  pad = 32,
  radius = theme.radius.card,
  strong,
  style,
  children,
}) => (
  <div
    style={{
      width: w,
      height: h,
      boxSizing: "border-box",
      padding: pad,
      borderRadius: radius,
      background: strong ? theme.colors.surfaceStrong : theme.gradient.card,
      border: `1.5px solid ${theme.colors.border}`,
      boxShadow: theme.shadow.card,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ children: React.ReactNode; size?: number; filled?: boolean; dim?: boolean; style?: React.CSSProperties }> = ({ children, size = 34, filled, dim, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: `${size * 0.28}px ${size * 0.7}px`,
      borderRadius: theme.radius.pill,
      fontFamily: theme.fonts.body,
      fontWeight: theme.weight.strong,
      fontSize: size,
      lineHeight: 1.2,
      letterSpacing: 0,
      color: filled ? theme.colors.ink : dim ? theme.colors.textDim : theme.colors.text,
      background: filled ? theme.gradient.hero : theme.colors.surface,
      border: filled ? "none" : `1.5px solid ${theme.colors.border}`,
      ...style,
    }}
  >
    {children}
  </div>
);

export type IconName =
  | "doc" | "book" | "web" | "note" | "check" | "search" | "cap" | "headphones" | "mindmap" | "cards"
  | "quiz" | "chat" | "spark" | "person" | "play" | "upload" | "x" | "wave" | "clock" | "link" | "layers";

const PATHS: Record<IconName, React.ReactNode> = {
  doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13h6M10 17h6" /></>,
  book: <><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z" /><path d="M12 6v13.5" /></>,
  web: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
  note: <><path d="M5 4h14v16H5z" /><path d="M8 9h8M8 13h8M8 17h4" /></>,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l5 5" /></>,
  cap: <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11.5V16c3 2.5 9 2.5 12 0v-4.5" /><path d="M22 9v6" /></>,
  headphones: <><path d="M4 15v-3a8 8 0 0116 0v3" /><rect x="3" y="14" width="4.5" height="7" rx="1.5" /><rect x="16.5" y="14" width="4.5" height="7" rx="1.5" /></>,
  mindmap: <><circle cx="12" cy="12" r="2.5" /><circle cx="4.5" cy="6" r="1.8" /><circle cx="19.5" cy="6" r="1.8" /><circle cx="4.5" cy="18" r="1.8" /><circle cx="19.5" cy="18" r="1.8" /><path d="M6 7l4.2 3.6M18 7l-4.2 3.6M6 17l4.2-3.6M18 17l-4.2-3.6" /></>,
  cards: <><rect x="3" y="7" width="14" height="12" rx="2" /><path d="M7 7V5a2 2 0 012-2h10a2 2 0 012 2v9a2 2 0 01-2 2h-2" /></>,
  quiz: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 114 2c-.8.6-1.5 1-1.5 2.2" /><path d="M12 17v.01" /></>,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  spark: <path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z" />,
  person: <><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" /></>,
  play: <path d="M8 5l11 7-11 7z" />,
  upload: <><path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 16v4h16v-4" /></>,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  wave: <path d="M3 12v0M7 8v8M11 4v16M15 7v10M19 10v4" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  link: <><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" /></>,
  layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>,
};

export const Icon: React.FC<{ name: IconName; size?: number; color?: string; sw?: number; style?: React.CSSProperties }> = ({ name, size = 48, color = "currentColor", sw = 1.8, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {PATHS[name]}
  </svg>
);

/** Rounded gradient tile holding an icon. */
export const IconTile: React.FC<{ name: IconName; size?: number; hero?: boolean; style?: React.CSSProperties }> = ({ name, size = 96, hero, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: hero ? theme.gradient.hero : theme.colors.surfaceStrong,
      border: hero ? "none" : `1.5px solid ${theme.colors.border}`,
      color: hero ? theme.colors.ink : theme.colors.text,
      boxShadow: hero ? theme.shadow.glow : undefined,
      ...style,
    }}
  >
    <Icon name={name} size={size * 0.5} sw={1.9} />
  </div>
);

/** Full "Google NotebookLM" lockup, undistorted, on a white card (the artwork is designed for white). */
export const LogoLockup: React.FC<{ w?: number; style?: React.CSSProperties }> = ({ w = 520, style }) => (
  <div style={{ width: w, borderRadius: theme.radius.card, background: theme.colors.paper, overflow: "hidden", boxShadow: theme.shadow.card, ...style }}>
    <Img src={staticFile("logo-notebooklm.png")} style={{ display: "block", width: "100%", height: "auto" }} />
  </div>
);

/** The arch app-icon, centre-cropped to a square (no stretching). */
export const AppIcon: React.FC<{ size?: number; style?: React.CSSProperties }> = ({ size = 220, style }) => (
  <div style={{ width: size, height: size, borderRadius: size * 0.24, background: theme.colors.paper, overflow: "hidden", boxShadow: theme.shadow.card, ...style }}>
    <Img src={staticFile("logo-icon.png")} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 45%", transform: "scale(1.0)" }} />
  </div>
);

/** A little document sheet with skeleton lines. */
export const Sheet: React.FC<{ w?: number; h?: number; lines?: number; label?: string; tilt?: number; hi?: number; style?: React.CSSProperties }> = ({
  w = 260,
  h = 330,
  lines = 7,
  label,
  tilt = 0,
  hi,
  style,
}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: theme.radius.small + 4,
      background: "linear-gradient(170deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))",
      border: `1.5px solid ${theme.colors.border}`,
      boxShadow: theme.shadow.card,
      padding: w * 0.1,
      boxSizing: "border-box",
      transform: `rotate(${tilt}deg)`,
      ...style,
    }}
  >
    {label ? (
      <div style={{ fontFamily: theme.fonts.body, fontWeight: theme.weight.strong, fontSize: w * 0.11, color: theme.colors.textDim, letterSpacing: 0, marginBottom: w * 0.07 }}>{label}</div>
    ) : (
      <div style={{ width: "46%", height: w * 0.045, borderRadius: 99, background: theme.colors.textDim, opacity: 0.7, marginBottom: w * 0.08 }} />
    )}
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        style={{
          height: w * 0.034,
          borderRadius: 99,
          marginBottom: w * 0.05,
          width: `${[100, 92, 96, 70, 100, 84, 60, 94][i % 8]}%`,
          background: hi === i ? theme.colors.accent : theme.colors.textDim,
          opacity: hi === i ? 0.95 : 0.34,
        }}
      />
    ))}
  </div>
);

const BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const toBn = (n: number | string) => String(n).replace(/\d/g, (d) => BN[+d]);

/** Draw-on line (stroke-dashoffset), eased. */
export const useDraw = (at: number, dur = 22) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + dur], [0, 1], { easing: theme.ease.out, ...clampX });
};
