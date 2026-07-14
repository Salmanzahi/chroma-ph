/** Type definitions for the results feature. */

import type { PhAnalysisResult } from "@/src/features/ph-analysis/types";

export interface ResultPageState {
  status: "loading" | "ready" | "empty" | "error";
  result: PhAnalysisResult | null;
  previewUrl: string | null;
  error: string | null;
}
