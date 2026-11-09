import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Sfx } from "../sfx";
import { useCue, useSpread } from "../timing";
import { AppIcon, Breathe, Glass, Icon, IconName, IconTile, LogoLockup, Pill, Pop, Sheet, Words, clampX, useDraw, useSpringAt } from "../ui/primitives";

/* ───────── S16 · Messy → organised — scatter converges into a notebook grid (cue 35) ───────── */
const SCATTER = [
  { x: 150, y: 260, t: -12, i: "doc" }, { x: 1480, y: 250, t: 9, i: "note" }, { x: 330, y: 640, t: 7, i: "web" }, { x: 1290, y: 700, t: -8, i: "book" },
  { x: 720, y: 760, t: -5, i: "doc" }, { x: 800, y: 230, t: 11, i: "note" }, { x: 1620, y: 560, t: -10, i: "web" }, { x: 60, y: 520, t: 6, i: "book" },
] as const;
const GRID = { x: 410, y: 330, cw: 270, ch: 190, gx: 28, gy: 28 };

export const S16Organize: React.FC = () => {
  const a = useCue(35);
  const conv = useCue(35, 0.5);
  const frame = useCurrentFrame();
  const p = useSpringAt(conv, "smooth");
  const frameIn = useDraw(conv + 2, 20);
  return (
    <AbsoluteFill>
      <Sfx kind="pop" at={a} />
      <Sfx kind="swipe" at={conv} gain={0.9} />
      <Sfx kind="chime" at={conv + 22} gain={0.85} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", height: 130 }}>
        <div style={{ position: "relative", width: 1700, height: 130 }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
            <Words text="ছড়িয়ে ছিটিয়ে থাকা *তথ্য*" at={a} size={86} until={conv - 8} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
            <Words text="গোছানো *AI powered* notebook" at={conv + 2} size={86} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: GRID.x - 50, top: GRID.y - 50, width: 4 * GRID.cw + 3 * GRID.gx + 100, height: 2 * GRID.ch + GRID.gy + 100, borderRadius: 40, border: `2px solid ${theme.colors.primary}`, background: `${theme.colors.primary}12`, boxShadow: theme.shadow.glow, opacity: frameIn, transform: `scale(${0.96 + 0.04 * frameIn})` }} />
      {SCATTER.map((s, k) => {
        const gx = GRID.x + (k % 4) * (GRID.cw + GRID.gx);
        const gy = GRID.y + Math.floor(k / 4) * (GRID.ch + GRID.gy);
        const float = Math.sin(frame / 20 + k) * 10 * (1 - p);
        const x = s.x + (gx - s.x) * p;
        const y = s.y + (gy - s.y) * p + float;
        const rot = s.t * (1 - p);
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y }}>
            <Pop at={a + k * 3} cfg="bouncy" from={0.4} y={30}>
              <div style={{ width: GRID.cw, height: GRID.ch, borderRadius: 24, transform: `rotate(${rot}deg)`, background: "linear-gradient(170deg, rgba(255,255,255,0.18), rgba(255,255,255,0.07))", border: `1.5px solid ${p > 0.9 ? theme.colors.primary : theme.colors.border}`, boxShadow: theme.shadow.card, padding: 24, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 16 }}>
                <Icon name={s.i as IconName} size={52} color={theme.colors.text} />
                <div style={{ height: 14, width: "82%", borderRadius: 99, background: theme.colors.textDim, opacity: 0.4 }} />
                <div style={{ height: 14, width: "56%", borderRadius: 99, background: theme.colors.textDim, opacity: 0.3 }} />
              </div>
            </Pop>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: GRID.y + 2 * GRID.ch + GRID.gy + 90, display: "flex", justifyContent: "center" }}>
        <Pop at={conv + 22} cfg="bouncy" from={0.5}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <AppIcon size={96} />
            <span style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 70, color: theme.colors.text, letterSpacing: 0 }}>NotebookLM</span>
          </div>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── S17 · Caution — Statement card → verify → the question (cues 36–38) ───────── */
export const S17Caution: React.FC = () => {
  const a = useCue(36);
  const b = useCue(36, 0.34);
  const c = useCue(38);
  const d = useCue(38, 0.5);
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [c + 14, c + 70], [0, 1], { easing: theme.ease.inOut, ...clampX });
  const under = useDraw(b + 26, 22);
  return (
    <AbsoluteFill>
      <Sfx kind="chime" at={a} gain={0.8} />
      <Sfx kind="pop" at={b} />
      <Sfx kind="click" at={c + 70} />
      <Sfx kind="thud" at={d} gain={0.7} />
      {/* A — brand beat */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 36 }}>
        <Pop at={a} until={b - 8} cfg="bouncy" from={0.5}>
          <AppIcon size={230} style={{ boxShadow: `${theme.shadow.card}, ${theme.shadow.glow}` }} />
        </Pop>
        <Words text="NotebookLM" at={a + 4} size={140} until={b - 8} />
      </AbsoluteFill>
      {/* B — AI is not 100% accurate */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Pop at={b} until={c - 8} y={50} from={0.9}>
          <Breathe amp={5}>
            <Glass w={1320} h={520} pad={56} strong style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
              <IconTile name="spark" size={120} />
              <Words text="AI সবসময় *শতভাগ নির্ভুল* হয় না" at={b + 6} size={92} maxWidth={1180} />
              <svg width={760} height={20} viewBox="0 0 760 20" style={{ marginTop: -6 }}>
                <line x1={0} y1={10} x2={760 * under} y2={10} stroke={theme.colors.primary} strokeWidth={8} strokeLinecap="round" />
              </svg>
            </Glass>
          </Breathe>
        </Pop>
      </AbsoluteFill>
      {/* C — verify */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 90 }}>
        <Pop at={c} until={d - 8} x={-60} y={20}>
          <div style={{ position: "relative", width: 420, height: 520 }}>
            <Sheet w={420} h={520} lines={8} hi={3} />
            <div style={{ position: "absolute", left: 40 + scan * 150, top: 150 + Math.sin(scan * Math.PI) * 60, transform: `rotate(${-20 + scan * 14}deg)` }}>
              <IconTile name="search" size={190} hero />
            </div>
          </div>
        </Pop>
        <div style={{ width: 760, display: "flex", flexDirection: "column", gap: 30 }}>
          <Words text="গুরুত্বপূর্ণ তথ্য অবশ্যই *যাচাই* করে নেবেন" at={c + 4} size={86} align="flex-start" until={d - 8} maxWidth={760} />
          <Pop at={c + 70} until={d - 8} cfg="bouncy" from={0.5}>
            <Pill size={42} filled><Icon name="check" size={42} sw={2.8} /> Verified</Pill>
          </Pop>
        </div>
      </AbsoluteFill>
      {/* D — the question */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 0 }}>
        <Pop at={d} cfg="bouncy" from={0.4} y={60}>
          <Breathe amp={6}>
            <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 420, lineHeight: 1, letterSpacing: 0, background: theme.gradient.hero, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent", textShadow: "none", filter: `drop-shadow(0 0 40px ${theme.colors.glow})` }}>?</div>
          </Breathe>
        </Pop>
        <Words text="এত সব *সুবিধা* পেতে" at={d + 6} size={84} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────── S18 · Price — Glass pricing card (cues 39–41) ───────── */
export const S18Price: React.FC = () => {
  const q = useCue(39);
  const card = useCue(40);
  const note = useCue(41);
  const tech = useCue(41, 0.5);
  return (
    <AbsoluteFill>
      <Sfx kind="whoosh" at={q} />
      <Sfx kind="pop" at={card} />
      <Sfx kind="chime" at={card + 10} gain={0.8} />
      <Sfx kind="pop" at={note} rate={1.06} />
      <Sfx kind="whoosh" at={tech} gain={0.8} />
      {/* P1 */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
        <Words text="কত *টাকা*" at={q} size={230} until={card - 8} />
        <Words text="খরচ করতে হবে?" at={q + 8} size={120} color={theme.colors.textDim} until={card - 8} />
      </AbsoluteFill>
      {/* P2 + P3: pricing card shifts left, notes appear right */}
      <PriceCard card={card} note={note} tech={tech} />
      {/* P4 */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Words text="প্রযুক্তি এখন শুধু *কাজ সহজ* করছে না," at={tech} size={92} maxWidth={1500} />
        <Words text="*বরং…*" at={tech + 14} size={150} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PriceCard: React.FC<{ card: number; note: number; tech: number }> = ({ card, note, tech }) => {
  const shift = useSpringAt(note - 4, "smooth");
  const gone = useSpringAt(tech - 8, "snappy");
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - Math.min(1, gone), transform: `translateY(${-gone * 30}px)` }}>
      <div style={{ position: "absolute", left: 960 - 380 - shift * 380, top: 230 }}>
        <Pop at={card} y={70} from={0.88}>
          <Breathe amp={5}>
            <Glass w={760} h={600} pad={52} strong style={{ border: `2px solid ${theme.colors.primary}`, boxShadow: `${theme.shadow.card}, ${theme.shadow.glow}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <AppIcon size={120} />
                <span style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 56, color: theme.colors.text, letterSpacing: 0 }}>NotebookLM</span>
              </div>
              <div style={{ marginTop: 56, fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 170, lineHeight: 1.1, letterSpacing: 0, background: theme.gradient.hero, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>বিনামূল্যে</div>
              <div style={{ marginTop: 12, fontFamily: theme.fonts.body, fontWeight: theme.weight.strong, fontSize: 60, color: theme.colors.textDim, letterSpacing: 0 }}>সংস্করণও রয়েছে</div>
            </Glass>
          </Breathe>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 1130, top: 290, width: 640, opacity: shift }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {[{ t: "কিছু feature", i: "layers" as IconName }, { t: "ব্যবহারের সীমা", i: "clock" as IconName }].map((r, i) => (
            <Pop key={i} at={note + i * 6} x={50} y={0}>
              <Glass pad={30} radius={26} style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <IconTile name={r.i} size={92} />
                <span style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 56, color: theme.colors.text, letterSpacing: 0 }}>{r.t}</span>
              </Glass>
            </Pop>
          ))}
          <Pop at={note + 16} y={20}>
            <Pill size={46} filled style={{ boxShadow: theme.shadow.glow }}>plan অনুযায়ী ভিন্ন</Pill>
          </Pop>
        </div>
      </div>
    </div>
  );
};

/* ───────── S19 · How we learn — orbit ring (cues 42–43) ───────── */
export const S19Orbit: React.FC = () => {
  const spread = useSpread(42, 3);
  const turn = useCue(43);
  const frame = useCurrentFrame();
  const spin = useSpringAt(turn, "smooth");
  const rot = frame * 0.12 + spin * 120;
  const Rr = 395;
  const items: { t: string; i: IconName }[] = [{ t: "শিখি", i: "cap" }, { t: "পড়াশোনা", i: "book" }, { t: "গবেষণা", i: "search" }];
  return (
    <AbsoluteFill>
      <Sfx kind="pop" at={spread(0)} />
      <Sfx kind="pop" at={spread(1)} rate={1.06} />
      <Sfx kind="pop" at={spread(2)} rate={1.12} />
      <Sfx kind="swipe" at={turn} gain={0.9} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <circle cx={960} cy={540} r={Rr} fill="none" stroke={theme.colors.border} strokeWidth={3} strokeDasharray="4 16" strokeLinecap="round" transform={`rotate(${rot} 960 540)`} />
        <circle cx={960} cy={540} r={Rr + 90} fill="none" stroke={theme.colors.primary} strokeOpacity={0.18} strokeWidth={2} />
      </svg>
      {items.map((it, k) => {
        const ang = ((rot + k * 120 - 90) * Math.PI) / 180;
        const x = 960 + Math.cos(ang) * Rr;
        const y = 540 + Math.sin(ang) * Rr;
        return (
          <div key={k} style={{ position: "absolute", left: x - 150, top: y - 60, width: 300, display: "flex", justifyContent: "center" }}>
            <Pop at={spread(k)} cfg="bouncy" from={0.4} y={20}>
              <Pill size={52} style={{ background: theme.colors.bgAlt, border: `2px solid ${theme.colors.border}`, boxShadow: theme.shadow.card, gap: 18 }}>
                <Icon name={it.i} size={56} color={theme.colors.accent} />
                {it.t}
              </Pill>
            </Pop>
          </div>
        );
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Words text="*পদ্ধতিটাই* বদলে দিচ্ছে" at={turn + 4} size={68} maxWidth={400} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────── S20 · Call to action — search bar → new world (cues 44–45) ───────── */
const QUERY = "NotebookLM";
export const S20Search: React.FC = () => {
  const a = useCue(44);
  const bar = useCue(44, 0.1);
  const b = useCue(45);
  const frame = useCurrentFrame();
  const typeStart = bar + 14;
  const chars = Math.max(0, Math.min(QUERY.length, Math.floor((frame - typeStart) / 3) + 1));
  const result = typeStart + QUERY.length * 3 + 12;
  const portal = useSpringAt(b - 2, "smooth");
  return (
    <AbsoluteFill>
      <Sfx kind="whoosh" at={a} />
      <Sfx kind="click" at={result} />
      <Sfx kind="pop" at={result + 4} />
      <Sfx kind="swipe" at={b} gain={0.9} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center" }}>
        <Words text="*Google* এ search করুন" at={a} size={100} until={b - 8} />
      </div>
      <div style={{ position: "absolute", left: 260, top: 380 }}>
        <Pop at={bar} until={b - 8} y={50}>
          <Glass w={1400} h={140} pad={0} radius={999} strong style={{ display: "flex", alignItems: "center", gap: 28, padding: "0 56px" }}>
            <Icon name="search" size={64} color={theme.colors.textDim} />
            <div style={{ fontFamily: theme.fonts.body, fontWeight: theme.weight.strong, fontSize: 70, color: theme.colors.text, letterSpacing: 0, minHeight: 90, display: "flex", alignItems: "center" }}>
              {QUERY.slice(0, chars)}
              {frame >= typeStart - 6 && Math.floor(frame / 12) % 2 === 0 && <span style={{ display: "inline-block", width: 5, height: 70, marginLeft: 6, background: theme.colors.primary, borderRadius: 3 }} />}
            </div>
          </Glass>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 340, top: 580 }}>
        <Pop at={result + 4} until={b - 8} y={40}>
          <Glass w={1240} pad={34} style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <AppIcon size={150} />
            <div>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 70, color: theme.colors.text, letterSpacing: 0 }}>NotebookLM</div>
              <div style={{ fontFamily: theme.fonts.body, fontWeight: theme.weight.body, fontSize: 40, color: theme.colors.textDim, letterSpacing: 0 }}>Google</div>
            </div>
          </Glass>
        </Pop>
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", width: 360 + portal * 1900, height: 360 + portal * 1900, borderRadius: "50%", background: `radial-gradient(circle, ${theme.colors.primary}55 0%, ${theme.colors.accent}22 45%, transparent 70%)`, opacity: portal }} />
        <div style={{ position: "absolute", width: 300 + portal * 900, height: 300 + portal * 900, borderRadius: "50%", border: `3px solid ${theme.colors.accent}`, opacity: (1 - portal) * 0.7 * Math.min(1, portal * 8) }} />
        <Words text="AI-এর *নতুন দুনিয়া*" at={b} size={150} maxWidth={1500} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ───────── S21 · Outro — your sources, your AI, your knowledge (cues 46–47) ───────── */
export const S21Outro: React.FC = () => {
  const a = useCue(46);
  const l1 = useCue(46, 0.24);
  const l2 = useCue(46, 0.62);
  const l3 = useCue(47);
  const frame = useCurrentFrame();
  const glow = 0.55 + Math.sin(frame / 20) * 0.15;
  const line = (text: string, at: number, hero?: boolean) => (
    <Pop at={at} x={-50} y={10} cfg="smooth">
      <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 112, lineHeight: 1.22, letterSpacing: 0, color: theme.colors.text, ...(hero ? { background: theme.gradient.hero, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent", filter: `drop-shadow(0 0 ${30 * glow}px ${theme.colors.glow})` } : {}) }}>{text}</div>
    </Pop>
  );
  return (
    <AbsoluteFill>
      <Sfx kind="whoosh" at={a} gain={0.8} />
      <Sfx kind="pop" at={l1} />
      <Sfx kind="pop" at={l2} rate={1.06} />
      <Sfx kind="chime" at={l3} />
      <div style={{ position: "absolute", left: 150, top: 250 }}>
        <Words text="মনে রাখবেন," at={a} size={58} color={theme.colors.textDim} weight={theme.weight.strong} align="flex-start" />
        <div style={{ marginTop: 12 }}>
          {line("your sources,", l1)}
          {line("your AI,", l2)}
          {line("your knowledge.", l3, true)}
        </div>
      </div>
      <div style={{ position: "absolute", right: 150, top: 270 }}>
        <Pop at={l3 + 2} y={60} cfg="bouncy" from={0.6}>
          <Breathe amp={6}>
            <LogoLockup w={520} style={{ boxShadow: `${theme.shadow.card}, ${theme.shadow.glow}` }} />
          </Breathe>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};
