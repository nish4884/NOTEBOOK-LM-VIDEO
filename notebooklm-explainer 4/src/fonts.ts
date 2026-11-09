// Hind Siliguri: reliable Bengali conjuncts (যুক্তাক্ষর). Loaded via @remotion/google-fonts.
import { loadFont } from "@remotion/google-fonts/HindSiliguri";

export const { fontFamily, waitUntilDone } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["bengali", "latin", "latin-ext"],
});
