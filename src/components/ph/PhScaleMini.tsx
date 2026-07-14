import { cn } from "@/src/lib/cn";
import { TEMPORARY_REF_TABLE } from "@/src/features/ph-analysis/data/ref-table";
import { ELIGIBILITY_MIN_PH, ELIGIBILITY_MAX_PH } from "@/src/lib/constants";

export interface PhScaleMiniProps {
  /** Estimated pH value to mark. Optional. */
  marker?: number;
  /** Show the eligible-range band overlay. Default true. */
  showEligibleBand?: boolean;
  className?: string;
}

/**
 * PhScaleMini — compact horizontal gradient strip for use in cards, result
 * summaries, and landing previews.  Does not render per-point labels; shows
 * the eligible band plus an optional marker.
 *
 * Colours are PROVISIONAL — not yet scientifically validated.
 */
export function PhScaleMini({
  marker,
  showEligibleBand = true,
  className,
}: PhScaleMiniProps) {
  const references = [...TEMPORARY_REF_TABLE].sort((a, b) => a.ph - b.ph);

  const markerPct =
    marker !== undefined
      ? Math.min(100, Math.max(0, ((marker - 1) / 13) * 100))
      : null;

  const eligStartPct = ((ELIGIBILITY_MIN_PH - 1) / 13) * 100;
  const eligEndPct = ((ELIGIBILITY_MAX_PH - 1) / 13) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative h-3 w-full overflow-hidden border border-[var(--color-surface-border)]">
        <div className="flex h-full w-full">
          {references.map((point) => (
            <div
              key={point.ph}
              className="flex-1"
              style={{ backgroundColor: point.hexColor ?? "#888" }}
            />
          ))}
        </div>
        {showEligibleBand ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 h-full border-x-2 border-dashed border-[var(--aubergine)]/60 bg-[var(--aubergine)]/12"
            style={{
              left: `${eligStartPct}%`,
              width: `${eligEndPct - eligStartPct}%`,
            }}
          />
        ) : null}
        {markerPct !== null ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-[var(--ink)]"
            style={{ left: `${markerPct}%` }}
          />
        ) : null}
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-muted)] font-[var(--mono)] tabular-nums">
        <span>pH 1</span>
        <span>pH 7</span>
        <span>pH 14</span>
      </div>
    </div>
  );
}
