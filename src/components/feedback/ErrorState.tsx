/**
 * Accessible error state component.
 */

import type { ReactNode } from "react";
import { WarningIcon } from "@/src/components/icons";

export function ErrorState({
  title = "Terjadi Kesalahan",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="feedback-state feedback-state--error" role="alert">
      <span className="feedback-state__index">ERR / status</span>
      <WarningIcon size={36} className="feedback-state__icon" />
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
