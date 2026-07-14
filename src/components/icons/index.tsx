/**
 * Reusable SVG icon component.
 * Renders a viewBox-based inline SVG with currentColor, configurable size, and className.
 * aria-hidden="true" by default — add aria-label on the interactive control wrapping the icon.
 */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function createIcon(
  displayName: string,
  path: React.ReactNode
) {
  function Icon({ size = 24, className, ...props }: IconProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className}
        {...props}
      >
        {path}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

export const ArrowLeftIcon = createIcon(
  "ArrowLeftIcon",
  <path d="M19 12H5M12 19l-7-7 7-7" />
);

export const ArrowRightIcon = createIcon(
  "ArrowRightIcon",
  <path d="M5 12h14M12 5l7 7-7 7" />
);

export const CameraIcon = createIcon(
  "CameraIcon",
  <>
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </>
);

export const UploadIcon = createIcon(
  "UploadIcon",
  <>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </>
);

export const RefreshIcon = createIcon(
  "RefreshIcon",
  <>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </>
);

export const CheckIcon = createIcon(
  "CheckIcon",
  <polyline points="20 6 9 17 4 12" />
);

export const WarningIcon = createIcon(
  "WarningIcon",
  <>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </>
);

export const MenuIcon = createIcon(
  "MenuIcon",
  <>
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </>
);

export const CloseIcon = createIcon(
  "CloseIcon",
  <>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </>
);

export const ImageIcon = createIcon(
  "ImageIcon",
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </>
);

export const FlaskIcon = createIcon(
  "FlaskIcon",
  <>
    <path d="M9 3h6M10 3v5.47L5.64 17.1A2 2 0 007.37 20h9.26a2 2 0 001.73-2.9L14 8.47V3" />
    <line x1="6" y1="14" x2="18" y2="14" />
  </>
);

export const LeafIcon = createIcon(
  "LeafIcon",
  <>
    <path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </>
);

export const InfoIcon = createIcon(
  "InfoIcon",
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </>
);
