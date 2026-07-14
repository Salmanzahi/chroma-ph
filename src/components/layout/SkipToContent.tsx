/**
 * Skip-to-content link for keyboard accessibility.
 * Visible only on focus.
 */

export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent-700 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:no-underline"
    >
      Lewati ke konten utama
    </a>
  );
}
