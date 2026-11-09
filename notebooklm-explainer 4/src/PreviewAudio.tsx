import React, { useMemo } from "react";
import { Audio, getRemotionEnvironment, getStaticFiles, staticFile } from "remotion";
import { VOICEOVER_IN_RENDER, VOICEOVER_IN_STUDIO } from "./config";

/**
 * Plays public/voiceover.mp3 for sync-checking.
 * Studio: on if the file exists (skipped silently if not). Render: off unless VOICEOVER_IN_RENDER = true.
 */
export const PreviewAudio: React.FC = () => {
  const env = getRemotionEnvironment();
  const enabled = env.isStudio ? VOICEOVER_IN_STUDIO : VOICEOVER_IN_RENDER;
  const exists = useMemo(() => {
    if (!env.isStudio) return true; // render: the flag is the user's explicit choice
    try {
      return getStaticFiles().some((f) => f.name === "voiceover.mp3");
    } catch {
      return false;
    }
  }, [env.isStudio]);
  if (!enabled || !exists) return null;
  return <Audio src={staticFile("voiceover.mp3")} volume={1} />;
};
