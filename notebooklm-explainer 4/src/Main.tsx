import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { OVERLAP } from "./config";
import { PreviewAudio } from "./PreviewAudio";
import { Sfx } from "./sfx";
import { SCENES } from "./scenes";
import { SceneCtx, TOTAL_FRAMES, sceneStartFor } from "./timing";
import { theme } from "./theme";
import { BgMesh, Grade, Grain, Vignette } from "./ui/Layers";
import "./fonts";
import { fontFamily } from "./fonts";

/** Faster-than-entrance exit applied to the last OVERLAP frames of every scene. */
const SceneShell: React.FC<{ children: React.ReactNode; durationInFrames: number }> = ({ children, durationInFrames }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [durationInFrames - OVERLAP, durationInFrames], [0, 1], { easing: theme.ease.in, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: 1 - t, transform: `translateY(${-t * 36}px) scale(${1 + t * 0.03})`, filter: t > 0 ? `blur(${t * 4}px)` : undefined }}>
      {children}
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  const starts = SCENES.map((s, i) => sceneStartFor(s.firstCue, i === 0));
  return (
    <AbsoluteFill style={{ fontFamily: `${fontFamily}, ${theme.fonts.body}`, background: theme.colors.bg }}>
      {/* 1 · background mesh */}
      <BgMesh />
      {/* 2–3 · assets + graphics, one Sequence per scene */}
      {SCENES.map((s, i) => {
        const from = starts[i];
        const next = i + 1 < SCENES.length ? starts[i + 1] + OVERLAP : TOTAL_FRAMES;
        return (
          <Sequence key={s.id} from={from} durationInFrames={next - from} name={s.id}>
            <SceneCtx.Provider value={{ from }}>
              <SceneShell durationInFrames={next - from}>
                <s.Comp />
              </SceneShell>
            </SceneCtx.Provider>
          </Sequence>
        );
      })}
      {/* scene-transition swipes */}
      {starts.slice(1).map((st, i) => (
        <Sfx key={i} kind="swipe" at={st - 3} gain={0.85} />
      ))}
      {/* 4 · colour grade, 5 · grain + vignette */}
      <Grade />
      <Grain />
      <Vignette />
      <PreviewAudio />
    </AbsoluteFill>
  );
};
