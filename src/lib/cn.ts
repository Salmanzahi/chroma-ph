/**
 * Minimal class-name merger.
 * Concatenates truthy string arguments with a space separator.
 * Suitable for Tailwind projects that do not need conflict resolution
 * (Tailwind 4's native cascade handles most conflicts).
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
