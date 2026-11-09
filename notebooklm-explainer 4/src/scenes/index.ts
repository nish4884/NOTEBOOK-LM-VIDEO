import React from "react";
import { S01Hook, S02Timer, S03Choice, S04Reveal, S05NotChatbot } from "./groupA";
import { S06Hub, S07Student, S08Upload, S09Chat, S10Outputs } from "./groupB";
import { S11Citation, S12NotOver, S13Audio, S14Flow, S15Carousel } from "./groupC";
import { S16Organize, S17Caution, S18Price, S19Orbit, S20Search, S21Outro } from "./groupD";

export type SceneDef = { id: string; firstCue: number; Comp: React.FC };

/**
 * Scene boundaries are SRT cue boundaries: each scene starts at its first cue
 * (minus the visual lead) and runs until the next scene's first cue.
 */
export const SCENES: SceneDef[] = [
  { id: "01-hook", firstCue: 1, Comp: S01Hook },
  { id: "02-timer", firstCue: 3, Comp: S02Timer },
  { id: "03-choice", firstCue: 4, Comp: S03Choice },
  { id: "04-reveal", firstCue: 6, Comp: S04Reveal },
  { id: "05-not-chatbot", firstCue: 8, Comp: S05NotChatbot },
  { id: "06-sources-hub", firstCue: 10, Comp: S06Hub },
  { id: "07-student", firstCue: 12, Comp: S07Student },
  { id: "08-upload", firstCue: 16, Comp: S08Upload },
  { id: "09-chat", firstCue: 17, Comp: S09Chat },
  { id: "10-outputs", firstCue: 21, Comp: S10Outputs },
  { id: "11-citation", firstCue: 22, Comp: S11Citation },
  { id: "12-not-over", firstCue: 25, Comp: S12NotOver },
  { id: "13-audio-overview", firstCue: 27, Comp: S13Audio },
  { id: "14-flow", firstCue: 30, Comp: S14Flow },
  { id: "15-carousel", firstCue: 33, Comp: S15Carousel },
  { id: "16-organize", firstCue: 35, Comp: S16Organize },
  { id: "17-caution", firstCue: 36, Comp: S17Caution },
  { id: "18-price", firstCue: 39, Comp: S18Price },
  { id: "19-orbit", firstCue: 42, Comp: S19Orbit },
  { id: "20-search", firstCue: 44, Comp: S20Search },
  { id: "21-outro", firstCue: 46, Comp: S21Outro },
];
