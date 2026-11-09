import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { FPS } from "./config";
import { theme } from "./theme";

export type SfxKind = "whoosh" | "pop" | "click" | "chime" | "swipe" | "thud";

// seconds, measured from the generated files (scripts/check-sfx.mjs)
const LEN: Record<SfxKind, number> = { whoosh: 0.58, pop: 0.22, click: 0.1, chime: 0.5, swipe: 0.42, thud: 0.36 };

/**
 * Plays a short SFX at local frame `at`. It starts 2 frames BEFORE the visual lands.
 * `rate` gives tiny pitch variation for repeated sounds. Volumes are in theme.sfxVolume (0.22–0.30),
 * well under the voiceover.
 */
export const Sfx: React.FC<{ kind: SfxKind; at: number; rate?: number; gain?: number }> = ({
  kind,
  at,
  rate = 1,
  gain = 1,
}) => {
  const from = Math.max(0, Math.round(at) - 2);
  return (
    <Sequence from={from} durationInFrames={Math.ceil((LEN[kind] * FPS) / rate) + 2} layout="none">
      <Audio
        src={staticFile(`sfx/${kind}.wav`)}
        volume={Math.min(0.35, theme.sfxVolume[kind] * gain)}
        playbackRate={rate}
      />
    </Sequence>
  );
};
