/**
 * Accessible empty-state component.
 */

import type { ReactNode } from "react";
import { ImageIcon } from "@/src/components/icons";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="feedback-state" role="status">
      <span className="feedback-state__index">00 / kosong</span>
      <ImageIcon size={36} className="feedback-state__icon" />
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
