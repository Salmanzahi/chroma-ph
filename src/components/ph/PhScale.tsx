import { cn } from "@/src/lib/cn";
import { TEMPORARY_REF_TABLE, getPhCategory } from "@/src/features/ph-analysis/data/ref-table";
import { ELIGIBILITY_MIN_PH, ELIGIBILITY_MAX_PH } from "@/src/lib/constants";

export interface PhScaleProps {
  /** Estimated pH value to mark (0–14, float allowed). Optional. */
  marker?: number;
  /** Show the eligible-range band overlay. Default true. */
  showEligibleBand?: boolean;
  /** Show numeric labels under each segment. Default true. */
  showLabels?: boolean;
  /** Show legend below the scale. Default true. */
  showLegend?: boolean;
  className?: string;
}

/**
 * PhScale — 14-point pH reference scale visualisation.
 *
 * Renders 14 coloured segments (pH 1–14) using the temporary calibration
 * reference table.  Supports an optional marker indicator and an eligible-range
 * band overlay.  Styled with the research-folio design system.
 *
 * Colours are PROVISIONAL — not yet scientifically validated.
 */
export function PhScale({
  marker,
  showEligibleBand = true,
  showLabels = true,
  showLegend = true,
  className,
}: PhScaleProps) {
  const references = [...TEMPORARY_REF_TABLE].sort((a, b) => a.ph - b.ph);

  // Marker position: pH 1 → 0%, pH 14 → 100%
  const markerPct =
    marker !== undefined
      ? Math.min(100, Math.max(0, ((marker - 1) / 13) * 100))
      : null;

  // Eligible band: pH 5.5–7
  const eligStartPct = ((ELIGIBILITY_MIN_PH - 1) / 13) * 100;
  const eligEndPct = ((ELIGIBILITY_MAX_PH - 1) / 13) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative"
        role="img"
        aria-label={
          marker !== undefined
            ? `Skala pH 1 sampai 14 dengan penanda pada pH ${marker}`
            : "Skala pH 1 sampai 14"
        }
      >
        {/* Scroll container for narrow screens */}
        <div className="overflow-x-auto pb-1">
          <div className="min-w-[640px] sm:min-w-0">
            {/* Colour bar */}
            <div className="flex h-14 w-full overflow-hidden border border-[var(--color-surface-border)]">
              {references.map((point, idx) => (
                <div
                  key={point.ph}
                  className="relative flex-1"
                  style={{ backgroundColor: point.hexColor ?? "#888" }}
                  title={`pH ${point.ph} — ${getPhCategory(point.ph)}`}
                >
                  {idx > 0 ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-full w-px bg-white/20"
                    />
                  ) : null}
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white/85">
                    {point.ph}
                  </span>
                </div>
              ))}
            </div>

            {/* Eligible band overlay */}
            {showEligibleBand ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 h-full border-2 border-dashed border-[var(--aubergine)]/60 bg-[var(--aubergine)]/8"
                style={{
                  left: `${eligStartPct}%`,
                  width: `${eligEndPct - eligStartPct}%`,
                }}
              />
            ) : null}

            {/* Marker */}
            {markerPct !== null ? (
              <div
                className="pointer-events-none absolute -top-1.5 z-10 -translate-x-1/2"
                style={{ left: `${markerPct}%` }}
              >
                <div className="flex flex-col items-center">
                  <div className="h-4 w-4 rotate-45 border-2 border-[var(--paper)] bg-[var(--ink)]" />
                </div>
              </div>
            ) : null}

            {/* Labels */}
            {showLabels ? (
              <div className="mt-2 flex min-w-[640px] justify-between sm:min-w-0">
                {references.map((point) => (
                  <span
                    key={point.ph}
                    className="flex-1 text-center font-[var(--mono)] text-[.62rem] text-[var(--color-text-muted)] font-medium tabular-nums"
                  >
                    {point.ph}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--color-text-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-4 border-2 border-dashed border-[var(--aubergine)]"
            />
            Rentang eligible (pH {ELIGIBILITY_MIN_PH}–{ELIGIBILITY_MAX_PH})
          </span>
          {marker !== undefined ? (
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-block h-2.5 w-2.5 rotate-45 border border-[var(--paper)] bg-[var(--ink)]"
              />
              Estimasi pH sampel: {marker}
            </span>
          ) : null}
          <span className="text-[var(--color-text-muted)]">
            Warna bersifat sementara — belum divalidasi laboratorium.
          </span>
        </div>
      ) : null}
    </div>
  );
}
