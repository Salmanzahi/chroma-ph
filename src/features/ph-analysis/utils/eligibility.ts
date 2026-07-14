/**
 * Eligibility determination based on the confirmed pH range.
 *
 * Confirmed rule (per PROJECT_SCOPE.md §7.1):
 *   pH 5.5 through pH 7 inclusive → eligible
 *   Below pH 5.5 → outside-range
 *   Above pH 7 → outside-range
 *   Invalid/unavailable → unknown
 */

import { ELIGIBILITY_MIN_PH, ELIGIBILITY_MAX_PH } from "@/src/lib/constants";
import type { EligibilityStatus } from "@/src/types/common";

/**
 * Determine eligibility status for a given pH value.
 * Pure function — no side effects, no UI dependency.
 */
export function getEligibilityStatus(ph: number): EligibilityStatus {
  if (isNaN(ph) || !isFinite(ph)) {
    return "unknown";
  }

  if (ph >= ELIGIBILITY_MIN_PH && ph <= ELIGIBILITY_MAX_PH) {
    return "eligible";
  }

  return "outside-range";
}
