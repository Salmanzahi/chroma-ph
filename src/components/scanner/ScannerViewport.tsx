"use client";

import { type ReactNode } from "react";
import { cn } from "@/src/lib/cn";

export interface ScannerViewportProps {
  /** Whether the scanning line animation is active. */
  active?: boolean;
  /** Show the centered sampling rectangle overlay. */
  showSamplingRect?: boolean;
  className?: string;
  /** Extra overlays (capture button, status pill, controls). */
  children?: ReactNode;
}

/**
 * ScannerViewport — dark viewfinder shell used on the scanner page.
 *
 * Renders the camera / preview area with an optional animated scanning line
 * (suggesting live capture) and a centered sampling-rectangle overlay showing
 * where the indicator film colour will be read.
 *
 * Styled to match the research-folio design system: zero-radius, aubergine
 * accent, and `prefers-reduced-motion` aware.
 */
export function ScannerViewport({
  active = false,
  showSamplingRect = false,
  className,
  children,
}: ScannerViewportProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-[var(--ink)] bg-[oklch(.16_.02_305)]",
        "min-h-[300px] sm:min-h-[400px]",
        "shadow-[12px_12px_0_var(--color-surface-strong)]",
        className
      )}
    >
      {/* Dark viewfinder background */}
      <div className="absolute inset-0 flex items-end justify-center p-8">
        <p className="max-w-[30ch] text-[.82rem] leading-relaxed text-[oklch(.72_.025_275)] text-center">
          Pratinjau kamera — arahkan ke film indikator bioplastik
        </p>
      </div>

      {/* Animated scanning line */}
      {active ? <ScanningLine /> : null}

      {/* Sampling rectangle overlay */}
      {showSamplingRect ? <SamplingRect /> : null}

      {/* Corner brackets for viewfinder feel */}
      <ViewfinderBrackets />

      {children}
    </div>
  );
}

/**
 * Thin horizontal line that sweeps top → bottom to suggest live capture.
 * Respects prefers-reduced-motion via the global CSS override.
 */
function ScanningLine() {
  return (
    <>
      <style>{`
        @keyframes bp-scanmove {
          0%   { top: 0%;    opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { top: 100%;  opacity: 0; }
        }
      `}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          className="absolute left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, oklch(0.55 0.15 326 / 0.95), transparent)",
            boxShadow: "0 0 14px 2px oklch(0.55 0.15 326 / 0.45)",
            animation: "bp-scanmove 2.6s cubic-bezier(0.45,0,0.55,1) infinite",
          }}
        />
      </div>
    </>
  );
}

/**
 * Centered dashed rectangle showing the exact sampling region where
 * the indicator film's colour will be read. Purely visual.
 */
function SamplingRect() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 sm:p-8"
    >
      <div className="h-[42%] w-[52%] border-2 border-dashed border-white/45" />
    </div>
  );
}

/**
 * Subtle corner brackets reinforcing the viewfinder / instrument aesthetic.
 */
function ViewfinderBrackets() {
  return (
    <>
      {/* Top-left */}
      <span className="pointer-events-none absolute left-4 top-4 h-8 w-8 border-l border-t border-white/30" />
      {/* Top-right */}
      <span className="pointer-events-none absolute right-4 top-4 h-8 w-8 border-r border-t border-white/30" />
      {/* Bottom-left */}
      <span className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 border-b border-l border-white/30" />
      {/* Bottom-right */}
      <span className="pointer-events-none absolute bottom-4 right-4 h-8 w-8 border-b border-r border-white/30" />
    </>
  );
}
