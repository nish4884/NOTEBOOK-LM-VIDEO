import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Sfx } from "../sfx";
import { useCue, useSpread } from "../timing";
import { AppIcon, Breathe, Glass, Icon, IconName, IconTile, Pill, Pop, Sheet, Words, clampX, useDraw, useSpringAt } from "../ui/primitives";

/* ───────── S11 · Citations — answer card + source panel (cues 22–24) ───────── */
const ANS = { x: 130, y: 270, w: 840, h: 560 };
const SRC = { x: 1130, y: 270, w: 660, h: 640 };
const lineY = (i: number) => ANS.y + 190 + i * 120;
const chipPos = (i: number) => ({ x: ANS.x + ANS.w - 110, y: lineY(i) + 8 });

export const S11Citation: React.FC = () => {
  const c22 = useCue(22);
  const c23 = useCue(23);
  const c24 = useCue(24);
  const spread = useSpread(22, 3);
  const frame = useCurrentFrame();
  const link = useDraw(c23 + 6, 26);
  const hiSweep = interpolate(frame, [c23 + 24, c23 + 50], [0, 1], { easing: theme.ease.out, ...clampX });
  const chip = chipPos(1);
  // source sheet geometry (see Sheet): padding 10% of w, header bar, then lines
  const sheetW = SRC.w - 60;
  const hiIdx = 3;
  const hiY = SRC.y + 30 + sheetW * 0.1 + sheetW * 0.045 + sheetW * 0.08 + hiIdx * (sheetW * 0.034 + sheetW * 0.05) + (sheetW * 0.034) / 2;
  const hiX = SRC.x + 30 + sheetW * 0.1;
  const hiW = sheetW * 0.8;
  const midX = (chip.x + 22 + hiX) / 2;
  const path = `M ${chip.x + 22} ${chip.y} C ${midX} ${chip.y}, ${midX} ${hiY}, ${hiX - 10} ${hiY}`;
  const L = 700;
  return (
    <AbsoluteFill>
      <Sfx kind="pop" at={c22 + 8} />
      <Sfx kind="click" at={c23 + 24} />
      <Sfx kind="chime" at={c24} gain={0.9} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", height: 130 }}>
        <div style={{ position: "relative", width: 1700, height: 130 }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
            <Words text="উত্তরের সঙ্গে *source citation*" at={c22} size={84} until={c23 - 10} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
            <Words text="কোন *তথ্যের ভিত্তিতে* উত্তর?" at={c23} size={84} until={c24 - 6} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
            <Words text="নিজেই *যাচাই* করতে পারবেন" at={c24} size={84} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: ANS.x, top: ANS.y }}>
        <Pop at={c22 + 6} x={-40} y={40}>
          <Glass w={ANS.w} h={ANS.h} pad={44} strong>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: theme.gradient.hero, display: "flex", alignItems: "center", justifyContent: "center", color: theme.colors.ink }}>
                <Icon name="spark" size={46} sw={2.2} />
              </div>
              <span style={{ fontFamily: theme.fonts.body, fontWeight: theme.weight.strong, fontSize: 42, color: theme.colors.textDim, letterSpacing: 0 }}>উত্তর</span>
            </div>
          </Glass>
        </Pop>
      </div>
      {[0, 1, 2].map((i) => {
        const w = [100, 94, 78][i];
        const grow = interpolate(frame, [spread(i) + 8, spread(i) + 34], [0, 1], { easing: theme.ease.out, ...clampX });
        return (
          <div key={i} style={{ position: "absolute", left: ANS.x + 44, top: lineY(i), width: ANS.w - 88 - 90, height: 34, display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ height: 22, width: `${w * grow}%`, borderRadius: 99, background: theme.colors.textDim, opacity: 0.4, marginTop: 6 }} />
          </div>
        );
      })}
      {[0, 1, 2].map((i) => {
        const p = chipPos(i);
        const active = i === 1;
        const pulse = active ? interpolate(useSpringAt(c23 + 4, "bouncy"), [0, 1], [1, 1.28], clampX) : 1;
        return (
          <div key={i} style={{ position: "absolute", left: p.x - 22, top: p.y - 22 }}>
            <Pop at={spread(i) + 14} cfg="bouncy" from={0.3} y={10}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${pulse})`, background: active && frame >= c23 + 4 ? theme.colors.primary : theme.colors.surfaceStrong, border: `2px solid ${active && frame >= c23 + 4 ? theme.colors.primary : theme.colors.border}`, color: active && frame >= c23 + 4 ? theme.colors.ink : theme.colors.text, boxShadow: active && frame >= c23 + 4 ? theme.shadow.glow : undefined }}>
                <Icon name="link" size={26} sw={2.2} />
              </div>
            </Pop>
          </div>
        );
      })}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path d={path} fill="none" stroke={theme.colors.primary} strokeWidth={5} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - link)} style={{ filter: `drop-shadow(0 0 10px ${theme.colors.glow})` }} />
      </svg>
      <div style={{ position: "absolute", left: SRC.x, top: SRC.y }}>
        <Pop at={c23 - 2} x={50} y={40}>
          <Breathe amp={4}>
            <Glass w={SRC.w} h={SRC.h} pad={30}>
              <Sheet w={sheetW} h={SRC.h - 60} lines={8} hi={hiIdx} style={{ background: "transparent", border: "none", boxShadow: "none" }} />
            </Glass>
          </Breathe>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: hiX - 8, top: hiY - 22, width: (hiW + 16) * hiSweep, height: 44, borderRadius: 12, background: `${theme.colors.accent}33`, border: `2px solid ${theme.colors.accent}`, opacity: hiSweep > 0 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: SRC.x + 90, top: SRC.y + SRC.h - 10 }}>
        <Pop at={c24} cfg="bouncy" from={0.5}>
          <Pill size={44} filled style={{ boxShadow: theme.shadow.glow }}>
            <Icon name="check" size={44} sw={2.8} /> Source verified
          </Pill>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── S12 · "That's not all" — statement card → strike the book (cues 25–26) ───────── */
export const S12NotOver: React.FC = () => {
  const a = useCue(25);
  const b = useCue(26);
  const strike = useDraw(b + 26, 14);
  return (
    <AbsoluteFill>
      <Sfx kind="whoosh" at={a} />
      <Sfx kind="pop" at={b} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Breathe amp={5}>
          <Words text="এখানেই *শেষ* না।" at={a} per={6} size={200} until={b - 8} />
        </Breathe>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
        <Pop at={b} cfg="bouncy" from={0.5} y={40}>
          <div style={{ position: "relative" }}>
            <IconTile name="book" size={300} />
            <svg width={300} height={300} viewBox="0 0 300 300" style={{ position: "absolute", inset: 0 }}>
              <line x1={30} y1={270} x2={30 + 240 * strike} y2={270 - 240 * strike} stroke={theme.colors.primary} strokeWidth={14} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 14px ${theme.colors.glow})` }} />
            </svg>
          </div>
        </Pop>
        <Words text="বই পড়তে *পছন্দ করেন না?*" at={b + 8} size={104} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────── S13 · Audio overview — player mock (cues 27–29) ───────── */
export const S13Audio: React.FC = () => {
  const a = useCue(27);
  const b = useCue(28);
  const c = useCue(29);
  const frame = useCurrentFrame();
  const live = frame >= c ? 1 : 0.18;
  const speaker = Math.floor(Math.max(0, frame - c - 10) / 42) % 2; // alternates after the dialogue starts
  const bars = 41;
  const chips: IconName[] = ["doc", "book", "web"];
  return (
    <AbsoluteFill>
      <Sfx kind="pop" at={a} />
      <Sfx kind="pop" at={c} rate={1.06} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", height: 130 }}>
        <div style={{ position: "relative", width: 1700, height: 130 }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
            <Words text="*Audio overview*" at={a} size={92} until={b - 8} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
            <Words text="আপনার upload করা তথ্য থেকেই" at={b} size={84} until={c - 8} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
            <Words text="দুইজনের কথোপকথন — *AI podcast*" at={c} size={84} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 300, top: 270 }}>
        <Pop at={a + 4} y={60} from={0.94}>
          <Breathe amp={4}>
            <Glass w={1320} h={640} pad={44} strong>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <IconTile name="headphones" size={84} hero />
                <span style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 56, color: theme.colors.text, letterSpacing: 0 }}>Audio overview</span>
                <div style={{ marginLeft: "auto" }}>
                  <Pop at={c + 6} cfg="bouncy" from={0.4}>
                    <Pill size={36} filled>AI podcast</Pill>
                  </Pop>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 52 }}>
                {[0, 1].map((k) => {
                  const active = frame >= c + 10 && speaker === k;
                  return (
                    <Pop key={k} at={c + 2 + k * 5} cfg="bouncy" from={0.3} y={30}>
                      <div style={{ width: 190, height: 190, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: active ? theme.colors.ink : theme.colors.text, background: active ? theme.gradient.hero : theme.colors.surfaceStrong, border: `2px solid ${active ? "transparent" : theme.colors.border}`, boxShadow: active ? theme.shadow.glow : undefined, transform: `scale(${active ? 1.08 : 1})` }}>
                        <Icon name="person" size={96} sw={1.7} />
                      </div>
                    </Pop>
                  );
                })}
                <div style={{ position: "absolute", left: 300, right: 300, top: 238, height: 200, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  {Array.from({ length: bars }).map((_, i) => {
                    const env = Math.sin((i / (bars - 1)) * Math.PI);
                    const h = (0.25 + 0.75 * Math.abs(Math.sin(frame / 6 + i * 0.7) * Math.cos(frame / 11 + i * 0.31))) * env * 190 * live + 8;
                    return <div key={i} style={{ width: 12, height: h, borderRadius: 99, background: i % 7 === 3 ? theme.colors.accent : theme.colors.primary, opacity: 0.92 }} />;
                  })}
                </div>
              </div>
              <div style={{ position: "absolute", left: 44, right: 44, bottom: 40, display: "flex", alignItems: "center", gap: 28 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: theme.colors.text, color: theme.colors.ink, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + Math.sin(frame / 12) * 0.03})` }}>
                  <Icon name="play" size={40} sw={2.2} style={{ marginLeft: 4 }} />
                </div>
                <div style={{ flex: 1, height: 14, borderRadius: 99, background: theme.colors.surfaceStrong, overflow: "hidden" }}>
                  <div style={{ width: `${interpolate(frame, [c, c + 600], [4, 42], clampX)}%`, height: "100%", background: theme.gradient.hero }} />
                </div>
              </div>
            </Glass>
          </Breathe>
        </Pop>
      </div>
      {chips.map((n, i) => {
        const at = b + i * 5;
        const p = useSpringAt(at, "smooth");
        const x0 = 960 - 52 + (i - 1) * 440;
        const x = interpolate(p, [0, 1], [x0, 960 - 52], clampX);
        const y = interpolate(p, [0, 1], [230, 520], clampX);
        const o = interpolate(frame, [at + 26, at + 42], [1, 0], clampX) * Math.min(1, p * 3);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: o, transform: `scale(${1 - p * 0.25})` }}>
            <IconTile name={n} size={104} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────── S14 · Book → audio → listening — Process Flow (cues 30–32) ───────── */
export const S14Flow: React.FC = () => {
  const a = useCue(30);
  const n1 = useCue(31);
  const n2 = useCue(31, 0.55);
  const n3 = useCue(32, 0.25);
  const frame = useCurrentFrame();
  const d1 = useDraw(n2 - 6, 20);
  const d2 = useDraw(n3 - 6, 20);
  const xs = [330, 960, 1590];
  const nodes: { icon: IconName; title: string; sub: string; at: number }[] = [
    { icon: "book", title: "আপনার বই", sub: "নিজের পড়ার বিষয়", at: n1 },
    { icon: "wave", title: "podcast-এর মতো audio", sub: "AI-এর কথোপকথন", at: n2 },
    { icon: "headphones", title: "শুনেই *ধারণা*", sub: "বই না পড়েও", at: n3 },
  ];
  return (
    <AbsoluteFill>
      <Sfx kind="pop" at={n1} />
      <Sfx kind="pop" at={n2} rate={1.06} />
      <Sfx kind="chime" at={n3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", height: 140 }}>
        <div style={{ position: "relative", width: 1700, height: 140 }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
            <Words text="অর্থাৎ" at={a} size={96} color={theme.colors.textDim} until={n1 - 8} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
            <Words text="বই থেকেই *podcast*" at={n1} size={100} />
          </div>
        </div>
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[0, 1].map((i) => {
          const x1 = xs[i] + 245;
          const x2 = xs[i + 1] - 245;
          const d = i === 0 ? d1 : d2;
          const dot = frame > (i === 0 ? n2 : n3) + 20 ? ((frame - (i === 0 ? n2 : n3)) % 50) / 50 : -1;
          return (
            <g key={i}>
              <line x1={x1} y1={620} x2={x1 + (x2 - x1) * d} y2={620} stroke={theme.colors.primary} strokeWidth={6} strokeLinecap="round" />
              {d > 0.95 && <path d={`M ${x2 - 22} 598 L ${x2} 620 L ${x2 - 22} 642`} fill="none" stroke={theme.colors.primary} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
              {dot >= 0 && <circle cx={x1 + (x2 - x1) * dot} cy={620} r={10} fill={theme.colors.accent} />}
            </g>
          );
        })}
      </svg>
      {nodes.map((n, i) => (
        <div key={i} style={{ position: "absolute", left: xs[i] - 235, top: 400 }}>
          <Pop at={n.at} y={50} cfg="bouncy" from={0.8}>
            <Breathe amp={5} phase={i * 1.7}>
              <Glass w={470} h={440} pad={36} strong={i === 2} style={i === 2 ? { border: `2px solid ${theme.colors.primary}`, boxShadow: `${theme.shadow.card}, ${theme.shadow.glow}` } : undefined}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, textAlign: "center" }}>
                  <IconTile name={n.icon} size={150} hero={i === 2} />
                  <Words text={n.title} at={n.at + 6} size={52} maxWidth={400} />
                  <div style={{ fontFamily: theme.fonts.body, fontWeight: theme.weight.body, fontSize: 38, color: theme.colors.textDim, letterSpacing: 0 }}>{n.sub}</div>
                </div>
              </Glass>
            </Breathe>
          </Pop>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ───────── S15 · Features — 3D Carousel with counter (cues 33–34) ───────── */
const STEP = 52;
const R = 880;
const CARDS: { icon: IconName; title: string }[] = [
  { icon: "mindmap", title: "Mind maps" },
  { icon: "cards", title: "Flashcards" },
  { icon: "quiz", title: "Quizzes" },
  { icon: "spark", title: "আরও অনেক সুবিধা" },
];
const Mini: React.FC<{ k: number }> = ({ k }) => {
  const line = (w: number, key: number, hi?: boolean) => <div key={key} style={{ height: 18, width: `${w}%`, borderRadius: 99, background: hi ? theme.colors.accent : theme.colors.textDim, opacity: hi ? 0.9 : 0.35 }} />;
  if (k === 0)
    return (
      <svg width={360} height={200} viewBox="0 0 360 200">
        <g stroke={theme.colors.primary} strokeWidth={4} strokeLinecap="round" opacity={0.8}>
          <line x1={180} y1={100} x2={60} y2={40} /><line x1={180} y1={100} x2={300} y2={40} /><line x1={180} y1={100} x2={60} y2={160} /><line x1={180} y1={100} x2={300} y2={160} />
        </g>
        <circle cx={180} cy={100} r={34} fill={theme.colors.primary} />
        {[[60, 40], [300, 40], [60, 160], [300, 160]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={20} fill={theme.colors.surfaceStrong} stroke={theme.colors.accent} strokeWidth={3} />)}
      </svg>
    );
  if (k === 1)
    return (
      <div style={{ position: "relative", width: 360, height: 200 }}>
        {[-8, 0, 8].map((t, i) => (
          <div key={i} style={{ position: "absolute", left: 60 + i * 14, top: 14 + i * 8, width: 230, height: 150, borderRadius: 20, transform: `rotate(${t}deg)`, background: i === 2 ? theme.gradient.hero : theme.colors.surfaceStrong, border: `1.5px solid ${theme.colors.border}` }} />
        ))}
      </div>
    );
  if (k === 2)
    return (
      <div style={{ width: 360, display: "flex", flexDirection: "column", gap: 18 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", border: `3px solid ${i === 1 ? theme.colors.accent : theme.colors.textDim}`, background: i === 1 ? theme.colors.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: theme.colors.ink }}>
              {i === 1 && <Icon name="check" size={24} sw={3.4} />}
            </div>
            {line([82, 92, 66][i], i)}
          </div>
        ))}
      </div>
    );
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", width: 360 }}>
      {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} style={{ width: 100, height: 54, borderRadius: 99, background: i % 3 === 0 ? theme.gradient.hero : theme.colors.surfaceStrong, opacity: i % 3 === 0 ? 1 : 0.8 }} />)}
    </div>
  );
};

export const S15Carousel: React.FC = () => {
  const spread = useSpread(33, 3);
  const starts = [useCue(33), spread(1), spread(2), useCue(34)];
  const sp = starts.map((s) => useSpringAt(s, "smooth"));
  // active index as a smooth float: 0 → 3
  const active = sp[1] * 1 + sp[2] * 1 + sp[3] * 1;
  const idx = Math.min(3, Math.round(active));
  const enter = useSpringAt(starts[0] - 2, "smooth");
  return (
    <AbsoluteFill>
      <Sfx kind="pop" at={starts[1]} />
      <Sfx kind="pop" at={starts[2]} rate={1.06} />
      <Sfx kind="pop" at={starts[3]} rate={1.12} />
      <div style={{ position: "absolute", inset: 0, perspective: 1800, perspectiveOrigin: "50% 45%", opacity: enter }}>
        <div style={{ position: "absolute", left: 960, top: 150, transformStyle: "preserve-3d", transform: `translateZ(${-R}px) rotateY(${-active * STEP}deg)` }}>
          {CARDS.map((c, k) => {
            const dist = Math.abs(k - active);
            return (
              <div key={k} style={{ position: "absolute", left: -280, top: 0, width: 560, height: 700, transform: `rotateY(${k * STEP}deg) translateZ(${R}px)`, opacity: interpolate(dist, [0, 1.4, 2.6], [1, 0.55, 0.15], clampX), backfaceVisibility: "hidden" }}>
                <Glass w={560} h={700} pad={44} strong={dist < 0.5} style={dist < 0.5 ? { border: `2px solid ${theme.colors.primary}`, boxShadow: `${theme.shadow.card}, ${theme.shadow.glow}` } : undefined}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
                    <IconTile name={c.icon} size={150} hero={dist < 0.5} />
                    <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 66, lineHeight: 1.2, color: theme.colors.text, letterSpacing: 0, textAlign: "center" }}>{c.title}</div>
                    <div style={{ marginTop: 14 }}><Mini k={k} /></div>
                  </div>
                </Glass>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", right: 120, top: 70, display: "flex", alignItems: "baseline", gap: 14, fontFamily: theme.fonts.display, fontWeight: theme.weight.title, letterSpacing: 0 }}>
        <span style={{ fontSize: 110, background: theme.gradient.hero, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>{String(idx + 1).padStart(2, "0")}</span>
        <span style={{ fontSize: 52, color: theme.colors.textDim }}>/ {String(CARDS.length).padStart(2, "0")}</span>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 52, display: "flex", justifyContent: "center", gap: 18 }}>
        {CARDS.map((_, i) => (
          <div key={i} style={{ width: i === idx ? 64 : 18, height: 18, borderRadius: 99, background: i === idx ? theme.gradient.hero : theme.colors.surfaceStrong }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
