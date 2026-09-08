export interface BackButtonProps {
  onClick: () => void;
  /** What you are going back to, e.g. "the door". */
  label?: string;
}

/**
 * Standing convention: every screen a visitor can reach carries one of these,
 * top-left, so nothing on this site is a one-way trip. Only the very first
 * screen and momentary transitions are exempt.
 */
export function BackButton({ onClick, label = "back" }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto absolute left-6 top-6 z-[150] cursor-pointer rounded-full border border-black/20 bg-white/75 px-4 py-1.5 text-[12px] text-black/70 backdrop-blur-sm transition-colors hover:border-black/45 hover:text-black sm:left-8 sm:top-7"
    >
      <span aria-hidden>&larr;</span> {label}
    </button>
  );
}
