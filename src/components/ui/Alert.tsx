/**
 * Reusable alert component for status messages.
 */

import type { ReactNode } from "react";
import { cn } from "@/src/lib/cn";
import { InfoIcon, WarningIcon } from "@/src/components/icons";

type AlertVariant = "info" | "warning" | "error" | "success";

const VARIANT_STYLES: Record<AlertVariant, string> = {
  info: "bg-accent-50 border-accent-200 text-accent-700",
  warning: "bg-semantic-amber-bg border-semantic-amber/20 text-semantic-amber",
  error: "bg-semantic-red-bg border-semantic-red/20 text-semantic-red",
  success: "bg-semantic-green-bg border-semantic-green/20 text-semantic-green",
};

export function Alert({
  variant = "info",
  children,
  className,
}: {
  variant?: AlertVariant;
  children: ReactNode;
  className?: string;
}) {
  const Icon = variant === "error" || variant === "warning" ? WarningIcon : InfoIcon;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-sm border p-4 text-sm",
        VARIANT_STYLES[variant],
        className
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
