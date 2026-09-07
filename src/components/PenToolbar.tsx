import type { DrawTool } from "./DrawingLayer";

/**
 * The 76 x 31 pill under the card (Figma node 232:5281): a pen nib and an
 * eraser, with a rounded highlight sliding behind whichever is active.
 * Clicking the active tool puts you back into typing.
 */
export interface PenToolbarProps {
  tool: DrawTool | null;
  onChange: (tool: DrawTool | null) => void;
  onClear: () => void;
  canClear: boolean;
}

export function PenToolbar({
  tool,
  onChange,
  onClear,
  canClear,
}: PenToolbarProps) {
  const toggle = (next: DrawTool) => onChange(tool === next ? null : next);

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-[31px] w-[76px] items-center rounded-full bg-[#ececec]">
        <span
          aria-hidden
          className="pointer-events-none absolute top-[4px] h-[23px] w-[33px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,.14)] transition-all duration-300"
          style={{
            left: tool === "eraser" ? 39 : 4,
            opacity: tool ? 1 : 0,
          }}
        />
        <ToolButton
          label="Draw on the card"
          active={tool === "pen"}
          onClick={() => toggle("pen")}
        >
          <PenNibIcon />
        </ToolButton>
        <ToolButton
          label="Erase your drawing"
          active={tool === "eraser"}
          onClick={() => toggle("eraser")}
        >
          <EraserIcon />
        </ToolButton>
      </div>

      <button
        type="button"
        onClick={onClear}
        disabled={!canClear}
        className="text-[11px] text-black/45 underline-offset-2 transition-opacity hover:underline disabled:pointer-events-none disabled:opacity-0"
      >
        clear ink
      </button>
    </div>
  );
}

function ToolButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className="relative z-10 flex h-[31px] flex-1 items-center justify-center text-ink transition-opacity"
      style={{ opacity: active ? 1 : 0.55 }}
    >
      {children}
    </button>
  );
}

function PenNibIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14.4 3.6 20.4 9.6 9.9 20.1 3 21l.9-6.9L14.4 3.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m12.3 5.7 6 6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8.4 15.6a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EraserIcon() {
  return (
    <svg width="15" height="14" viewBox="0 0 24 22" fill="none" aria-hidden>
      <path
        d="M9.8 19.5H21M2.9 14.2l5.7 5.3 12-11.2-5.7-5.3-12 11.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m8.1 9 5.7 5.3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
