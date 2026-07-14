import { type ReactNode } from "react";
import { cn } from "@/src/lib/cn";

export interface SectionHeadingProps {
  /** Index/eyebrow text (e.g. "01", "Tentang"). Rendered as editorial-kicker. */
  eyebrow?: string;
  /** Main heading. */
  children: ReactNode;
  /** Optional supporting prose paragraph. */
  description?: string;
  className?: string;
}

/**
 * SectionHeading — reusable editorial section header.
 *
 * Matches the research-folio pattern used across the landing, about, and data
 * pages: an editorial kicker (mono, uppercase, aubergine) followed by a
 * display-serif section title, with an optional prose description.
 */
export function SectionHeading({
  eyebrow,
  children,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <header className={cn("indexed-section__head", className)}>
      {eyebrow ? (
        <p className="editorial-kicker section-index">{eyebrow}</p>
      ) : (
        <div />
      )}
      <div>
        <h2 className="section-title">{children}</h2>
        {description ? (
          <p className="prose-copy">{description}</p>
        ) : null}
      </div>
    </header>
  );
}
