import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { Sfx } from "../sfx";
import { useCue, useSpread } from "../timing";
import { AppIcon, Breathe, Glass, Icon, IconName, IconTile, Pill, Pop, Sheet, TypedWords, Words, clampX, useDraw, useSpringAt } from "../ui/primitives";

/* ───────── S06 · Sources — Hub and Spoke (cues 10–11) ───────── */
const CX = 960;
const CY = 505;
const NODES: { label: string; icon: IconName }[] = [
  { label: "PDF", icon: "doc" },
  { label: "বই", icon: "book" },
  { label: "Documents", icon: "note" },
  { label: "Website", icon: "web" },
  { label: "অন্যান্য source", icon: "link" },
];
const nodePos = (i: number) => {
  const ang = ((-90 + 72 * i) * Math.PI) / 180;
  return { x: CX + Math.cos(ang) * 640, y: CY + Math.sin(ang) * 325 };
};

export const S06Hub: React.FC = () => {
  const hub = useCue(10, 0);
  const spread = useSpread(10, NODES.length);
  const chatAt = useCue(11);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Sfx kind="chime" at={hub} />
      <Sfx kind="pop" at={chatAt} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {NODES.map((n, i) => {
          const p = nodePos(i);
          const at = spread(i) + 6;
          const d = useDraw(at, 20);
          const x = p.x + (CX - p.x) * d;
          const y = p.y + (CY - p.y) * d;
          const flow = frame >= chatAt ? ((frame - chatAt + i * 9) % 40) / 40 : -1;
          return (
            <g key={i}>
              <line x1={p.x} y1={p.y} x2={x} y2={y} stroke={theme.colors.primary} strokeOpacity={0.55} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 14" />
              {flow >= 0 && <circle cx={p.x + (CX - p.x) * flow} cy={p.y + (CY - p.y) * flow} r={9} fill={theme.colors.accent} opacity={1 - Math.abs(flow - 0.5) * 0.6} />}
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: CX - 150, top: CY - 150 }}>
        <Pop at={hub} cfg="bouncy" from={0.4}>
          <Breathe amp={4}>
            <div style={{ position: "relative", width: 300, height: 300 }}>
              <div style={{ position: "absolute", inset: -50, borderRadius: "50%", background: `radial-gradient(circle, ${theme.colors.primary}66, transparent 65%)` }} />
              <AppIcon size={300} style={{ position: "absolute", inset: 0, boxShadow: theme.shadow.glow }} />
            </div>
          </Breathe>
        </Pop>
      </div>
      {NODES.map((n, i) => {
        const p = nodePos(i);
        return (
          <div key={i} style={{ position: "absolute", left: p.x - 100, top: p.y - 70, width: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <Pop at={spread(i)} cfg="bouncy" from={0.5} y={24}>
              <Breathe amp={5} phase={i * 1.3}>
                <IconTile name={n.icon} size={124} />
              </Breathe>
            </Pop>
            <Pop at={spread(i) + 5} y={14}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.strong, fontSize: 42, color: theme.colors.text, letterSpacing: 0, whiteSpace: "nowrap" }}>{n.label}</div>
            </Pop>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: CX - 270, top: CY + 190 }}>
        <Pop at={chatAt} y={30}>
          <Glass w={540} pad={22} radius={999} strong style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Icon name="chat" size={44} color={theme.colors.accent} />
            <span style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.strong, fontSize: 40, color: theme.colors.text, letterSpacing: 0 }}>AI-এর সঙ্গে কথোপকথন</span>
          </Glass>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── S07 · University — cap statement → document pile (cues 12–15) ───────── */
export const S07Student: React.FC = () => {
  const a = useCue(12);
  const b = useCue(13);
  const c = useCue(15);
  const spread = useSpread(15, 3);
  const items = [
    { label: "PDF", x: 330, y: 360, tilt: -7 },
    { label: "Lecture sheet", x: 800, y: 330, tilt: 3 },
    { label: "বই", x: 1280, y: 365, tilt: 8 },
  ];
  return (
    <AbsoluteFill>
      <Sfx kind="pop" at={b} />
      <Sfx kind="pop" at={c} rate={1.06} />
      {/* Phase A */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <Pop at={b} until={c - 8} cfg="bouncy" from={0.5}>
          <Breathe amp={6}>
            <IconTile name="cap" size={260} hero />
          </Breathe>
        </Pop>
        <Words text="ধরুন," at={a} size={70} color={theme.colors.textDim} until={c - 8} />
        <Words text="আপনি এখন *বিশ্ববিদ্যালয়ে* পড়ছেন" at={b} size={104} until={c - 8} maxWidth={1500} />
      </div>
      {/* Phase B */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center", alignItems: "center", gap: 36 }}>
        <Pop at={c} y={-30}>
          <IconTile name="cap" size={110} />
        </Pop>
        <Words text="*একগাদা* PDF, lecture sheet আর বই" at={c} size={72} maxWidth={1300} align="flex-start" />
      </div>
      {items.map((it, i) => (
        <div key={i} style={{ position: "absolute", left: it.x, top: it.y + 80 }}>
          <Pop at={spread(i)} y={-260} from={0.85} cfg="bouncy">
            <Breathe amp={7} phase={i * 2}>
              <Sheet w={330} h={430} lines={8} label={it.label} tilt={it.tilt} hi={i === 1 ? 3 : undefined} />
            </Breathe>
          </Pop>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/* ───────── S08 · Upload — Glossy UI mockup (cue 16) ───────── */
export const S08Upload: React.FC = () => {
  const a = useCue(16);
  const frame = useCurrentFrame();
  const rows = [
    { label: "PDF", icon: "doc" as IconName },
    { label: "Lecture sheet", icon: "note" as IconName },
    { label: "বই", icon: "book" as IconName },
  ];
  const lastDone = a + 12 + 2 * 8 + 38;
  return (
    <AbsoluteFill>
      <Sfx kind="whoosh" at={a} />
      <Sfx kind="click" at={lastDone} />
      <div style={{ position: "absolute", left: 110, top: 170 }}>
        <Pop at={a} x={-80} y={20} from={0.94}>
          <Glass w={1100} h={740} pad={0} radius={32} strong style={{ overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "22px 30px", borderBottom: `1.5px solid ${theme.colors.border}` }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: theme.colors.textDim, opacity: 0.55 }} />
              ))}
              <span style={{ marginLeft: 20, fontFamily: theme.fonts.body, fontSize: 32, fontWeight: theme.weight.strong, color: theme.colors.textDim, letterSpacing: 0 }}>NotebookLM · Sources</span>
            </div>
            <div style={{ padding: 40 }}>
              <Pop at={a + 6} y={20}>
                <div style={{ height: 150, borderRadius: 24, border: `3px dashed ${theme.colors.primary}`, background: `${theme.colors.primary}14`, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
                  <Icon name="upload" size={64} color={theme.colors.primary} />
                  <span style={{ fontFamily: theme.fonts.body, fontWeight: theme.weight.strong, fontSize: 42, color: theme.colors.text, letterSpacing: 0 }}>Upload sources</span>
                </div>
              </Pop>
              <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 22 }}>
                {rows.map((r, i) => {
                  const at = a + 12 + i * 8;
                  const prog = interpolate(frame, [at + 6, at + 38], [0, 1], { easing: theme.ease.out, ...clampX });
                  const done = useSpringAt(at + 38, "bouncy");
                  return (
                    <Pop key={i} at={at} x={-40} y={0}>
                      <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "18px 26px", borderRadius: 22, background: theme.colors.surface, border: `1.5px solid ${theme.colors.border}` }}>
                        <Icon name={r.icon} size={54} color={theme.colors.text} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: theme.fonts.body, fontWeight: theme.weight.strong, fontSize: 38, color: theme.colors.text, letterSpacing: 0, marginBottom: 10 }}>{r.label}</div>
                          <div style={{ height: 12, borderRadius: 99, background: theme.colors.surfaceStrong, overflow: "hidden" }}>
                            <div style={{ width: `${prog * 100}%`, height: "100%", background: theme.gradient.hero, borderRadius: 99 }} />
                          </div>
                        </div>
                        <div style={{ width: 56, height: 56, borderRadius: "50%", background: theme.colors.accent, color: theme.colors.ink, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${Math.max(0, done)})`, opacity: Math.min(1, done) }}>
                          <Icon name="check" size={34} sw={3} />
                        </div>
                      </div>
                    </Pop>
                  );
                })}
              </div>
            </div>
          </Glass>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 1280, top: 340, width: 560 }}>
        <Words text="সবগুলো *upload* করে দিন" at={a + 10} size={80} align="flex-start" maxWidth={560} />
      </div>
    </AbsoluteFill>
  );
};

/* ───────── S09 · Ask — chat UI (cues 17–20) ───────── */
const QS = [
  { cue: 18, text: "কোন topicগুলো গুরুত্বপূর্ণ?", kind: "chips" },
  { cue: 19, text: "এই অধ্যায়ের সহজ সারাংশ কী?", kind: "lines" },
  { cue: 20, text: "কঠিন বিষয়গুলো সহজ ভাষায় বুঝিয়ে দাও।", kind: "lines2" },
] as const;
const PAIR = 330;

const Answer: React.FC<{ at: number; kind: string }> = ({ at, kind }) => {
  const frame = useCurrentFrame();
  const dots = frame < at + 14;
  const grow = interpolate(frame, [at + 14, at + 40], [0, 1], { easing: theme.ease.out, ...clampX });
  return (
    <Pop at={at - 4} y={24} style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
      <div style={{ width: 66, height: 66, borderRadius: "50%", background: theme.gradient.hero, display: "flex", alignItems: "center", justifyContent: "center", color: theme.colors.ink, flex: "none" }}>
        <Icon name="spark" size={38} sw={2.2} />
      </div>
      <div style={{ flex: 1, padding: "20px 28px", borderRadius: 26, background: theme.colors.surface, border: `1.5px solid ${theme.colors.border}`, minHeight: 80, maxWidth: 1000 }}>
        {dots ? (
          <div style={{ display: "flex", gap: 10, height: 40, alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: theme.colors.textDim, transform: `translateY(${Math.sin((frame - i * 4) / 4) * 5}px)` }} />
            ))}
          </div>
        ) : kind === "chips" ? (
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[220, 300, 180, 260].map((w, i) => (
              <div key={i} style={{ width: w * grow, height: 46, borderRadius: 99, background: i === 1 ? theme.gradient.hero : theme.colors.surfaceStrong, opacity: i === 1 ? 1 : 0.85 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(kind === "lines" ? [100, 92, 66] : [96, 100, 78, 52]).map((w, i) => (
              <div key={i} style={{ height: 16, width: `${w * grow}%`, borderRadius: 99, background: i === 1 && kind === "lines2" ? theme.colors.accent : theme.colors.textDim, opacity: i === 1 && kind === "lines2" ? 0.9 : 0.4 }} />
            ))}
          </div>
        )}
      </div>
    </Pop>
  );
};

export const S09Chat: React.FC = () => {
  const open = useCue(17);
  const q = QS.map((x) => useCue(x.cue));
  const typedFrames = QS.map((x) => x.text.split(" ").length * 5 + 8);
  const send = q.map((s, i) => s + typedFrames[i]);
  const frame = useCurrentFrame();
  const s1 = useSpringAt(send[1], "smooth");
  const s2 = useSpringAt(send[2], "smooth");
  const scroll = 150 * s1 + 180 * s2;
  const typingIdx = QS.findIndex((_, i) => frame >= q[i] && frame < send[i]);
  return (
    <AbsoluteFill>
      <Sfx kind="whoosh" at={open} />
      {send.map((s, i) => (
        <Sfx key={i} kind="click" at={s} rate={1 + i * 0.07} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}>
        <Words text="এবার *প্রশ্ন* করুন" at={open} size={86} />
      </div>
      <div style={{ position: "absolute", left: 210, top: 215 }}>
        <Pop at={open + 4} y={60} from={0.95}>
          <Glass w={1500} h={800} pad={0} radius={36} strong style={{ overflow: "hidden", position: "relative" }}>
            <div style={{ padding: "26px 40px", borderBottom: `1.5px solid ${theme.colors.border}`, display: "flex", alignItems: "center", gap: 16 }}>
              <Icon name="chat" size={44} color={theme.colors.accent} />
              <span style={{ fontFamily: theme.fonts.body, fontWeight: theme.weight.strong, fontSize: 34, color: theme.colors.textDim, letterSpacing: 0 }}>Chat</span>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 96, height: 560, overflow: "hidden", WebkitMaskImage: "linear-gradient(180deg, transparent 0, #000 40px, #000 100%)", maskImage: "linear-gradient(180deg, transparent 0, #000 40px, #000 100%)" }}>
              <div style={{ position: "absolute", left: 40, right: 40, top: 30 - scroll }}>
                {QS.map((x, i) => (
                  <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * PAIR }}>
                    {frame >= send[i] - 2 && (
                      <Pop at={send[i]} y={18} style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div style={{ padding: "20px 34px", borderRadius: 30, background: theme.colors.primary, color: theme.colors.ink, fontFamily: theme.fonts.body, fontWeight: theme.weight.strong, fontSize: 40, letterSpacing: 0, maxWidth: 900 }}>{x.text}</div>
                      </Pop>
                    )}
                    {frame >= send[i] && (
                      <div style={{ marginTop: 26 }}>
                        <Answer at={send[i] + 8} kind={x.kind} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: "absolute", left: 40, right: 40, bottom: 34, height: 92, borderRadius: 999, background: theme.colors.surface, border: `1.5px solid ${theme.colors.border}`, display: "flex", alignItems: "center", padding: "0 38px", gap: 20 }}>
              <div style={{ flex: 1, minHeight: 50 }}>
                {typingIdx >= 0 ? (
                  <TypedWords text={QS[typingIdx].text} at={q[typingIdx]} perWord={5} size={40} />
                ) : (
                  <span style={{ fontFamily: theme.fonts.body, fontSize: 40, color: theme.colors.textDim, opacity: 0.7, letterSpacing: 0 }}>Ask about your sources…</span>
                )}
              </div>
              <div style={{ width: 62, height: 62, borderRadius: "50%", background: theme.gradient.hero, display: "flex", alignItems: "center", justifyContent: "center", color: theme.colors.ink }}>
                <Icon name="play" size={30} sw={2.2} />
              </div>
            </div>
          </Glass>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};

/* ───────── S10 · Outputs — Bento Grid (cue 21) ───────── */
export const S10Outputs: React.FC = () => {
  const spread = useSpread(21, 3);
  const Row: React.FC<{ w: number }> = ({ w }) => <div style={{ height: 18, width: `${w}%`, borderRadius: 99, background: theme.colors.textDim, opacity: 0.35 }} />;
  return (
    <AbsoluteFill>
      <Sfx kind="pop" at={spread(0)} />
      <Sfx kind="pop" at={spread(1)} rate={1.06} />
      <Sfx kind="pop" at={spread(2)} rate={1.12} />
      <div style={{ position: "absolute", left: 250, top: 190 }}>
        <Pop at={spread(0)} x={-50} y={40}>
          <Breathe amp={5}>
            <Glass w={760} h={700} pad={48} strong style={{ border: `2px solid ${theme.colors.primary}`, boxShadow: `${theme.shadow.card}, ${theme.shadow.glow}` }}>
              <IconTile name="quiz" size={120} hero />
              <div style={{ marginTop: 34, fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 84, lineHeight: 1.2, color: theme.colors.text, letterSpacing: 0 }}>
                গুরুত্বপূর্ণ <span style={{ background: theme.gradient.hero, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>প্রশ্ন</span>
              </div>
              <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 24 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", border: `3px solid ${theme.colors.textDim}`, flex: "none" }} />
                    <Row w={[92, 78, 86][i]} />
                  </div>
                ))}
              </div>
            </Glass>
          </Breathe>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 1050, top: 190 }}>
        <Pop at={spread(1)} x={50} y={30}>
          <Breathe amp={5} phase={1}>
            <Glass w={620} h={330} pad={40}>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <IconTile name="book" size={96} />
                <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 60, color: theme.colors.text, letterSpacing: 0 }}>Study guide</div>
              </div>
              <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 20 }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <Icon name="check" size={34} color={theme.colors.accent} sw={3} />
                    <Row w={[90, 72, 82][i]} />
                  </div>
                ))}
              </div>
            </Glass>
          </Breathe>
        </Pop>
      </div>
      <div style={{ position: "absolute", left: 1050, top: 560 }}>
        <Pop at={spread(2)} x={50} y={40}>
          <Breathe amp={5} phase={2}>
            <Glass w={620} h={330} pad={40}>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <IconTile name="note" size={96} />
                <div style={{ fontFamily: theme.fonts.display, fontWeight: theme.weight.title, fontSize: 60, color: theme.colors.text, letterSpacing: 0 }}>Note</div>
              </div>
              <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 20 }}>
                <Row w={94} />
                <Row w={80} />
                <Row w={58} />
              </div>
            </Glass>
          </Breathe>
        </Pop>
      </div>
    </AbsoluteFill>
  );
};
