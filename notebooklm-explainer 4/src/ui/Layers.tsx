import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme } from "../theme";

/** Layer 1 — never a flat background: drifting colour blobs. */
export const BgMesh: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 90) * 80;
  const d2 = Math.cos(frame / 110) * 60;
  const d3 = Math.sin(frame / 140 + 1) * 50;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${theme.colors.bg} 0%, ${theme.colors.bgAlt} 100%)` }}>
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", top: -560 + d3, left: -320 + d1, filter: "blur(60px)", background: `radial-gradient(circle, ${theme.colors.primary}38, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: "50%", bottom: -480, right: -260 - d2, filter: "blur(70px)", background: `radial-gradient(circle, ${theme.colors.accent}26, transparent 65%)` }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1.2px, transparent 1.4px)", backgroundSize: "56px 56px", opacity: 0.55, transform: `translate(${(frame * 0.15) % 56}px, ${(frame * 0.1) % 56}px)` }} />
    </AbsoluteFill>
  );
};

/** Layer 4 — colour grade above all content. */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.primary, mixBlendMode: "soft-light", opacity: 0.16 }} />
    <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.12), transparent 26%, transparent 74%, rgba(0,0,0,0.22))" }} />
  </AbsoluteFill>
);

/** Layer 5a — procedural film grain. */
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px", backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`, opacity: 0.05, mixBlendMode: "overlay" }} />
  );
};

/** Layer 5b — vignette, topmost. */
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.34) 100%)" }} />
);
