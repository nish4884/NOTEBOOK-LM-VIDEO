// All timing is derived from the SRT (via cues.generated.ts). Nothing is placed by hand.
import { createContext, useContext } from "react";
import { CUES } from "./cues.generated";
import { FPS, LEAD, TAIL } from "./config";

const f = (ms: number) => Math.round((ms * FPS) / 1000);

/** Global frame at which cue n (1-based) starts / ends. */
export const cueStart = (n: number) => f(CUES[n - 1].startMs);
export const cueEnd = (n: number) => f(CUES[n - 1].endMs);
export const cueLen = (n: number) => cueEnd(n) - cueStart(n);

export const TOTAL_FRAMES = cueEnd(CUES.length) + TAIL;

/** Scene start in global frames: first cue start minus the visual lead (first scene starts at 0). */
export const sceneStartFor = (firstCue: number, isFirst: boolean) =>
  isFirst ? 0 : cueStart(firstCue) - LEAD;

export const SceneCtx = createContext<{ from: number }>({ from: 0 });

/** Local frame (inside the current scene) at which cue n's visual should begin (lead included). */
export const useCue = (n: number, frac = 0) => {
  const { from } = useContext(SceneCtx);
  return cueStart(n) + Math.round(cueLen(n) * frac) - LEAD - from;
};
/** Local frame of an exact cue time (no lead). */
export const useCueAt = (n: number, frac = 0) => {
  const { from } = useContext(SceneCtx);
  return cueStart(n) + Math.round(cueLen(n) * frac) - from;
};
/** Local frame at which the scene's last cue ends. */
export const useCueEndLocal = (n: number) => {
  const { from } = useContext(SceneCtx);
  return cueEnd(n) - from;
};
/** n items spread evenly over cue c; returns local start frame of item i (lead included). */
export const useSpread = (c: number, count: number) => {
  const { from } = useContext(SceneCtx);
  return (i: number) => cueStart(c) + Math.round((cueLen(c) * i) / count) - LEAD - from;
};
