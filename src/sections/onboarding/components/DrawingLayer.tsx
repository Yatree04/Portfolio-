import SignaturePad from "signature_pad";
import {
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type Ref,
} from "react";

export type DrawTool = "pen" | "eraser";

export interface DrawingHandle {
  /** Transparent PNG of the ink, or null if nothing was drawn. */
  toDataURL(): string | null;
  isEmpty(): boolean;
  clear(): void;
  /** Drops the last stroke. */
  undo(): void;
}

export interface DrawingLayerProps {
  /** On-screen size of the card this sits over, in CSS pixels. */
  width: number;
  height: number;
  /** null lets pointer events fall through to whatever is underneath. */
  tool: DrawTool | null;
  onStrokeEnd?: (isEmpty: boolean) => void;
  handleRef?: Ref<DrawingHandle>;
  style?: CSSProperties;
}

const INK = "#080808";

/**
 * A transparent ink surface laid over the card.
 *
 * It is deliberately a sibling of the card rather than a child of it: the card
 * is CSS-scaled, and signature_pad maps pointer coordinates through
 * getBoundingClientRect(), so drawing inside a scaled element would compress
 * every stroke towards its top-left corner. Sitting outside, the canvas is
 * always drawn at 1:1 with the screen and only the exported PNG is scaled back
 * onto the card.
 */
export function DrawingLayer({
  width,
  height,
  tool,
  onStrokeEnd,
  handleRef,
  style,
}: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const strokeEndRef = useRef(onStrokeEnd);
  strokeEndRef.current = onStrokeEnd;

  // Create the pad once, and re-scale the backing store when the card resizes.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const existing = padRef.current;
    const previous = existing && !existing.isEmpty() ? existing.toData() : null;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);

    const pad =
      padRef.current ??
      new SignaturePad(canvas, {
        backgroundColor: "rgba(0,0,0,0)",
        penColor: INK,
        minWidth: 0.7,
        maxWidth: 2.1,
        velocityFilterWeight: 0.75,
        minDistance: 1,
      });
    padRef.current = pad;

    if (previous) pad.fromData(previous);

    const handleEnd = () => strokeEndRef.current?.(pad.isEmpty());
    pad.addEventListener("endStroke", handleEnd);
    return () => pad.removeEventListener("endStroke", handleEnd);
  }, [width, height]);

  useEffect(() => () => padRef.current?.off(), []);

  // The eraser is the same brush punching holes in the alpha channel.
  useEffect(() => {
    const pad = padRef.current;
    if (!pad) return;
    if (tool === "eraser") {
      pad.compositeOperation = "destination-out";
      pad.minWidth = 8;
      pad.maxWidth = 14;
    } else {
      pad.compositeOperation = "source-over";
      pad.minWidth = 0.7;
      pad.maxWidth = 2.1;
    }
    if (tool) pad.on();
    else pad.off();
  }, [tool]);

  useImperativeHandle(
    handleRef,
    (): DrawingHandle => ({
      toDataURL: () => {
        const pad = padRef.current;
        if (!pad || pad.isEmpty()) return null;
        return pad.toDataURL("image/png");
      },
      isEmpty: () => padRef.current?.isEmpty() ?? true,
      clear: () => padRef.current?.clear(),
      undo: () => {
        const pad = padRef.current;
        if (!pad) return;
        const data = pad.toData();
        data.pop();
        pad.clear();
        if (data.length > 0) pad.fromData(data);
      },
    }),
    [],
  );

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width, height, touchAction: tool ? "none" : "auto", ...style }}
      className={
        "absolute left-0 top-0 z-20 " +
        (tool ? "cursor-crosshair" : "pointer-events-none")
      }
    />
  );
}
