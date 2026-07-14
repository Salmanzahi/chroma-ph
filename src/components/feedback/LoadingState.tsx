/** Accessible loading state component. */

import { cn } from "@/src/lib/cn";

export function LoadingState({
  message = "Memuat…",
  inverted = false,
}: {
  message?: string;
  inverted?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16"
      role="status"
      aria-live="polite"
    >
      <div
        aria-hidden="true"
        className={cn(
          "h-10 w-10 animate-spin rounded-full border-4",
          inverted
            ? "border-white/30 border-t-white"
            : "border-accent-200 border-t-accent-600"
        )}
      />
      <p className={cn("text-sm", inverted ? "text-white" : "text-text-secondary")}>
        {message}
      </p>
    </div>
  );
}
