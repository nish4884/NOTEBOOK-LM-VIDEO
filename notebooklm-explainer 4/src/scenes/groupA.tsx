import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Sfx } from "../sfx";
import { useCue, useSpread } from "../timing";
import { AppIcon, Breathe, Glass, Icon, IconTile, LogoLockup, Pill, Pop, Sheet, Words, clampX, toBn, useDraw, useSpringAt } from "../ui/primitives";

const Center: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", ...style }}>{children}</AbsoluteFill>
);

/* ───────── S01 · Hook — Kinetic Typography → book + page counter (cues 1–2) ───────── */
const Book: React.FC<{ w?: number; h?: number }> = ({ w = 380, h = 500 }) => (
  <div style={{ position: "relative", width: w + 30, height: h + 30 }}>
    {[24, 16, 8].map((o, i) => (
      <div key={o} style={{ position: "absolute", left: o, top: o, width: w, height: h, borderRadius: 22, background: i % 2 ? "#C9D8FF" : "#E8EEFF", opacity: 0.92 - i * 0.05 }} />
    ))}
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: 22, background: "linear-gradient(150deg, #4C8DFF 0%, #2F5FD0 100%)", boxShadow: theme.shadow.glow, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 44, background: "rgba(0,0,0,0.22)" }} />
      <div style={{ position: "absolute", left: 90, top: 110, width: 210, height: 22, borderRadius: 99, background: "rgba(255,255,255,0.85)" }} />
      <div style={{ position: "absolute", left: 90, top: 156, width: 150, height: 22, borderRadius: 99, background: "rgba(255,255,255,0.5)" }} />
      <div style={{ position: "absolute", left: 90, bottom: 90, width: 90, height: 90, borderRadius: 24, border: "4px solid rgba(255,255,255,0.7)" }} />
    </div>
  </div>
);

const Digit: React.FC<{ ch: string; size: number }> = ({ ch, size }) => (
  <span style={{ display: "inline-block", width: size * 0.5, textAlign: "center" }}>{ch}</span>
);

export const S01Hook: React.FC = () => {
  const a = useCue(1);
  const b = useCue(2);
  const frame = useCurrentFrame();
  const p = useSpringAt(b + 8, "smooth");
  const count = Math.round(interpolate(p, [0, 1], [0, 500], clampX));
  const digits = toBn(count).split("");
  return (
    <AbsoluteFill>
      <Sfx kind="whoosh" at={a} />
      <Sfx kind="thud" at={b} gain={0.9} />
      <Center>
        <Breathe amp={5}>
          <Words text="*ভাবুন* তো," at={a} per={6} size={210} until={b - 8} />
        </Breathe>
      </Center>
      {frame >= b - 2 && (
        <Center style={{ flexDirection: "row", gap: 150 }}>
          <Pop at={b} y={80} from={0.8} cfg="bouncy">
            <Breathe amp={8} phase={1}>
              <Book />
            </Breathe>
          </Pop>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
            <Pop at={b + 6} x={-30} y={20}>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 56, fontWeight: theme.weight.strong, color: theme.colors.textDim, letterSpacing: 0 }}>আপনার কাছে একটা বই</div>
            </Pop>
            <Pop at={b + 10} y={50}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 260, lineHeight: 1.05, letterSpacing: 0, display: "flex", background: theme.gradient.hero, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>
                {digits.map((d, i) => (
                  <Digit key={i} ch={d} size={260} />
                ))}
              </div>
            </Pop>
            <Pop at={b + 16} y={30}>
              <div style={{ fontFamily: theme.fonts.display, fontSize: 96, fontWeight: theme.weight.title, color: theme.colors.text, letterSpacing: 0 }}>পৃষ্ঠা</div>
            </Pop>
          </div>
        </Center>
      )}
    </AbsoluteFill>
  );
};

/* ───────── S02 · Time pressure — Line-draw clock ring (cue 3) ───────── */
export const S02Timer: React.FC = () => {
  const a = useCue(3);
  const frame = useCurrentFrame();
  const R = 230;
  const C = 2 * Math.PI * R;
  const drain = interpolate(frame, [a + 6, a + 90], [0, 0.86], { easing: theme.ease.inOut, ...clampX });
  const hand = interpolate(frame, [a, a + 100], [0, 720], { easing: theme.ease.inOut, ...clampX });
  const draw = useDraw(a, 26);
  return (
    <AbsoluteFill>
      <Sfx kind="pop" at={a} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}>
        <Pop at={a} cfg="bouncy" from={0.7}>
          <svg width={620} height={620} viewBox="-310 -310 620 620">
            <circle r={R + 36} fill="rgba(255,255,255,0.03)" stroke={theme.colors.border} strokeWidth={2} />
            {Array.from({ length: 60 }).map((_, i) => {
              const ang = (i / 60) * Math.PI * 2;
              const long = i % 5 === 0;
              return <line key={i} x1={Math.sin(ang) * (R + 4)} y1={-Math.cos(ang) * (R + 4)} x2={Math.sin(ang) * (R + (long ? 26 : 14))} y2={-Math.cos(ang) * (R + (long ? 26 : 14))} stroke={theme.colors.textDim} strokeOpacity={long ? 0.9 : 0.4} strokeWidth={long ? 4 : 2} strokeLinecap="round" />;
            })}
            <circle r={R} fill="none" stroke={theme.colors.surfaceStrong} strokeWidth={22} />
            <circle r={R} fill="none" stroke={theme.colors.primary} strokeWidth={22} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - draw + drain)} transform="rotate(-90)" style={{ filter: `drop-shadow(0 0 18px ${theme.colors.glow})` }} />
            <g transform={`rotate(${hand})`}>
              <line x1={0} y1={14} x2={0} y2={-R + 50} stroke={theme.colors.text} strokeWidth={9} strokeLinecap="round" />
            </g>
            <circle r={16} fill={theme.colors.text} />
          </svg>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 95, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <Words text="সামনে *পরীক্ষা*" at={a + 4} size={104} />
        <Words text="হাতে সময় খুব কম" at={useCue(3, 0.5)} size={64} color={theme.colors.textDim} weight={theme.weight.strong} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────── S03 · Choice — Before / After split (cues 4–5) ───────── */
export const S03Choice: React.FC = () => {
  const l = useCue(4);
  const mid = useCue(4, 0.36);
  const r = useCue(4, 0.46);
  const done = useCue(5, 0.15);
  const frame = useCurrentFrame();
  const crawl = interpolate(frame, [l + 20, r + 140], [0.02, 0.2], { easing: theme.ease.inOut, ...clampX });
  const fast = interpolate(frame, [r + 14, r + 46], [0, 1], { easing: theme.ease.out, ...clampX });
  const W = 740;
  return (
    <AbsoluteFill>
      <Sfx kind="pop" at={l} />
      <Sfx kind="pop" at={r} rate={1.07} />
      <Sfx kind="click" at={done} />
      <div style={{ position: "absolute", left: 120, top: 220 }}>
        <Pop at={l} x={-60} y={30}>
          <Glass w={W} h={640} pad={44} style={{ opacity: 0.88 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <IconTile name="book" size={104} />
              <Icon name="clock" size={60} color={theme.colors.textDim} />
            </div>
            <div style={{ marginTop: 40 }}>
              <Words text="পুরো বইটা *পড়বেন?*" at={l + 6} size={78} align="flex-start" color={theme.colors.textDim} />
            </div>
            <div style={{ marginTop: 56, height: 26, borderRadius: 99, background: theme.colors.surfaceStrong, overflow: "hidden" }}>
              <div style={{ width: `${crawl * 100}%`, height: "100%", borderRadius: 99, background: theme.colors.textDim, opacity: 0.8 }} />
            </div>
            <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
              {[100, 92, 97, 80, 94, 64].map((w, i) => (
                <div key={i} style={{ height: 18, width: `${w}%`, borderRadius: 99, background: theme.colors.textDim, opacity: 0.2 }} />
              ))}
            </div>
          </Glass>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 960 - 80, top: 490 }}>
        <Pop at={mid} cfg="bouncy" from={0.5}>
          <Pill size={44} filled style={{ width: 160, justifyContent: "center", boxShadow: theme.shadow.glow }}>নাকি</Pill>
        </Pop>
      </div>
      <div style={{ position: "absolute", right: 120, top: 220 }}>
        <Pop at={r} x={60} y={30}>
          <Glass w={W} h={640} pad={44} strong style={{ border: `2px solid ${theme.colors.primary}`, boxShadow: `${theme.shadow.card}, ${theme.shadow.glow}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <IconTile name="spark" size={104} hero />
            </div>
            <div style={{ marginTop: 40 }}>
              <Words text="*কয়েক মিনিটে* পুরো বইয়ের গুরুত্বপূর্ণ বিষয়" at={r + 6} size={66} align="flex-start" maxWidth={680} />
            </div>
            <div style={{ marginTop: 44, height: 26, borderRadius: 99, background: theme.colors.surfaceStrong, overflow: "hidden" }}>
              <div style={{ width: `${fast * 100}%`, height: "100%", borderRadius: 99, background: theme.gradient.hero }} />
            </div>
            <Pop at={done} cfg="bouncy" from={0.4} style={{ marginTop: 44 }}>
              <Pill size={44} filled>
                <Icon name="check" size={42} sw={2.6} /> বুঝিয়ে দেবে
              </Pill>
            </Pop>
          </Glass>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── S04 · Reveal — "right at hand" → logo (cues 6–7) ───────── */
export const S04Reveal: React.FC = () => {
  const a = useCue(6);
  const b = useCue(7);
  const frame = useCurrentFrame();
  const pulse = (d: number) => {
    const t = ((frame - a - d) % 60) / 60;
    return frame < a + d ? 0 : t;
  };
  const expand = useSpringAt(b - 4, "smooth");
  return (
    <AbsoluteFill>
      <Sfx kind="whoosh" at={a} />
      <Sfx kind="chime" at={b} />
      <Center>
        {[0, 20, 40].map((d) => {
          const t = frame >= b ? 0 : pulse(d);
          return <div key={d} style={{ position: "absolute", width: 340 + t * 700, height: 340 + t * 700, borderRadius: "50%", border: `3px solid ${theme.colors.primary}`, opacity: (1 - t) * 0.5 }} />;
        })}
        <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", background: `radial-gradient(circle, ${theme.colors.primary}55, transparent 62%)`, opacity: expand, transform: `scale(${0.4 + 0.6 * expand})` }} />
      </Center>
      <Center style={{ flexDirection: "column", gap: 4 }}>
        <Words text="এমন একজন" at={a} size={78} color={theme.colors.textDim} weight={theme.weight.strong} until={b - 8} />
        <Words text="*হাতের* *কাছেই*" at={a + 6} size={190} until={b - 8} />
      </Center>
      <Center>
        <Pop at={b} cfg="bouncy" from={0.5} y={60}>
          <Breathe amp={6}>
            <LogoLockup w={600} style={{ boxShadow: `${theme.shadow.card}, ${theme.shadow.glow}` }} />
          </Breathe>
        </Pop>
      </Center>
    </AbsoluteFill>
  );
};

/* ───────── S05 · Not just a chatbot — struck chip → assistant card (cues 8–9) ───────── */
export const S05NotChatbot: React.FC = () => {
  const a = useCue(8);
  const strikeAt = useCue(8, 0.62);
  const b = useCue(9);
  const strike = useDraw(strikeAt, 14);
  const dim = interpolate(strike, [0, 1], [1, 0.45]);
  return (
    <AbsoluteFill>
      <Sfx kind="whoosh" at={a} />
      <Sfx kind="pop" at={b} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 140, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <Words text="শুধু আরেকটি" at={a} size={64} color={theme.colors.textDim} weight={theme.weight.strong} />
        <Pop at={a + 8} cfg="bouncy" from={0.8}>
          <div style={{ position: "relative", opacity: dim }}>
            <Pill size={96} style={{ padding: "26px 70px" }}>
              <Icon name="chat" size={86} />
              AI chatbot
            </Pill>
            <div style={{ position: "absolute", left: -20, top: "50%", height: 9, width: `${strike * 108}%`, marginTop: -4, borderRadius: 99, background: theme.colors.primary, boxShadow: theme.shadow.glow }} />
          </div>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 520, display: "flex", justifyContent: "center" }}>
        <Pop at={b} y={70} from={0.88}>
          <Breathe amp={5}>
            <Glass w={1240} h={400} pad={52} strong style={{ border: `2px solid ${theme.colors.primary}`, boxShadow: `${theme.shadow.card}, ${theme.shadow.glow}`, display: "flex", alignItems: "center", gap: 56 }}>
              <AppIcon size={240} />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Words text="AI *research* assistant" at={b + 6} size={96} align="flex-start" maxWidth={760} />
                <Pop at={b + 22} y={16}>
                  <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.strong, fontSize: 52, color: theme.colors.textDim, letterSpacing: 0 }}>Google-এর তৈরি</div>
                </Pop>
              </div>
            </Glass>
          </Breathe>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};
