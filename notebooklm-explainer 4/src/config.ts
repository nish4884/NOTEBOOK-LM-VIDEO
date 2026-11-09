// Project switches.
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const FPS = 30;

/** Visual lead: visuals enter this many frames before the related narration (4–6). */
export const LEAD = 5;
/** Frames the previous scene lingers (exit animation) while the next one starts. */
export const OVERLAP = 10;
/** Frames of calm after the last cue ends. */
export const TAIL = 30;

/**
 * Voiceover preview. Put your MP3 at public/voiceover.mp3.
 *  - Remotion Studio: plays automatically if the file exists (silently skipped if not).
 *  - Render: OFF by default. Set to true to bake the voiceover into the MP4.
 */
export const VOICEOVER_IN_RENDER = false;
export const VOICEOVER_IN_STUDIO = true;
