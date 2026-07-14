/**
 * Semantic status badge for eligibility indication.
 */

import { cn } from "@/src/lib/cn";
import { CheckIcon, WarningIcon, InfoIcon } from "@/src/components/icons";
import type { EligibilityStatus } from "@/src/types/common";

const STATUS_CONFIG: Record<
  EligibilityStatus,
  { label: string; icon: typeof CheckIcon; className: string }
> = {
  eligible: {
    label: "Dalam rentang parameter penelitian",
    icon: CheckIcon,
    className: "bg-semantic-green-bg text-semantic-green border-semantic-green/20",
  },
  "outside-range": {
    label: "Di luar rentang parameter penelitian",
    icon: WarningIcon,
    className: "bg-semantic-red-bg text-semantic-red border-semantic-red/20",
  },
  unknown: {
    label: "Status tidak dapat ditentukan",
    icon: InfoIcon,
    className: "bg-surface-muted text-text-secondary border-surface-border",
  },
};

export function StatusBadge({
  status,
}: {
  status: EligibilityStatus;
}) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-semibold",
        config.className
      )}
      role="status"
    >
      <Icon size={18} />
      <span>{config.label}</span>
    </div>
  );
}

/** Return the human-readable label for a given eligibility status. */
export function getStatusLabel(status: EligibilityStatus): string {
  return STATUS_CONFIG[status].label;
}
