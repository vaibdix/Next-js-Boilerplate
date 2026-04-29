/**
 * Keyboard-only skip link that jumps focus to the main content area.
 * @returns A visually hidden anchor that appears on keyboard focus.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="fixed top-0 left-0 z-50 -translate-y-full rounded-br-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
