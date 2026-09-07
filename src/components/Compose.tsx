import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Tilt from "react-parallax-tilt";
import { CARD_H, CARD_W } from "../lib/layout";
import { NAME_MAX_LENGTH, generateName } from "../lib/names";
import { formatCardDate } from "../lib/store";
import {
  DrawingLayer,
  type DrawTool,
  type DrawingHandle,
} from "./DrawingLayer";
import { NoteCard } from "./NoteCard";
import { PenToolbar } from "./PenToolbar";

/** Body text box, straight off the Figma card. */
const BODY_LEFT = 30;
const BODY_TOP = 73;
const BODY_WIDTH = 262;
/** Six 26px lines — the .hand-body box. Beyond that the card runs out of paper. */
const BODY_MAX_LENGTH = 180;

export interface ComposeSubmission {
  name: string;
  body: string;
  signature: string | null;
  /** Where the card is on screen right now, so it can fly from here. */
  rect: DOMRect;
  scale: number;
}

export interface ComposeProps {
  scale: number;
  onSubmit: (submission: ComposeSubmission) => void;
  /** True once the card has been handed off to the drop animation. */
  handedOff: boolean;
}

export function Compose({ scale, onSubmit, handedOff }: ComposeProps) {
  const [name, setName] = useState(generateName);
  const [body, setBody] = useState("");
  const [tool, setTool] = useState<DrawTool | null>(null);
  const [hasInk, setHasInk] = useState(false);

  const cardBoxRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const drawingRef = useRef<DrawingHandle | null>(null);

  const dateLabel = formatCardDate();
  const width = CARD_W * scale;
  const height = CARD_H * scale;
  const canSubmit = body.trim().length > 0 || hasInk;

  useEffect(() => {
    // Land the cursor in the card, not the name field — the note is the point.
    const id = window.setTimeout(() => bodyRef.current?.focus(), 620);
    return () => window.clearTimeout(id);
  }, []);

  const submit = useCallback(() => {
    const box = cardBoxRef.current;
    if (!box || !canSubmit || handedOff) return;
    onSubmit({
      name,
      body,
      signature: drawingRef.current?.toDataURL() ?? null,
      rect: box.getBoundingClientRect(),
      scale,
    });
  }, [body, canSubmit, handedOff, name, onSubmit, scale]);

  // Enter drops the card from anywhere on this screen — after drawing, focus
  // sits on a toolbar button rather than the textarea, and the invitation is
  // "press enter", not "press enter while the cursor happens to be in the card".
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || event.shiftKey) return;
      const target = event.target as HTMLElement | null;
      // The textarea and name field run their own Enter behaviour.
      if (target?.tagName === "TEXTAREA" || target?.tagName === "INPUT") return;
      event.preventDefault();
      submit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [submit]);

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-[50px] px-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.2, 0.9, 0.25, 1] }}
    >
      <motion.p
        animate={{ opacity: handedOff ? 0 : 1 }}
        transition={{ duration: 0.28 }}
        className="text-center text-[12px] text-black"
      >
        Leave me Something to ponder about....
      </motion.p>

      <motion.div
        animate={{ opacity: handedOff ? 0 : 1 }}
        transition={{ duration: 0.28 }}
        className="flex items-center gap-[7px]"
      >
        <label htmlFor="visitor-name" className="text-[12px] text-black">
          Name:
        </label>
        <div className="relative">
          <input
            id="visitor-name"
            value={name}
            maxLength={NAME_MAX_LENGTH}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                bodyRef.current?.focus();
              }
            }}
            className="h-[31px] w-[min(306px,70vw)] rounded-[8px] bg-[#d9d9d9]/60 px-[13px] text-[12px] text-ink outline-none transition-colors focus:bg-[#d9d9d9]/85"
          />
          <button
            type="button"
            onClick={() => setName(generateName())}
            title="Give me another name"
            className="absolute right-[10px] top-1/2 -translate-y-1/2 cursor-pointer text-[11px] text-black/40 transition-colors hover:text-black"
          >
            ↻
          </button>
        </div>
      </motion.div>

      <div
        ref={cardBoxRef}
        className="relative"
        style={{ width, height, opacity: handedOff ? 0 : 1 }}
      >
        <Tilt
          tiltEnable={tool === null}
          tiltMaxAngleX={5}
          tiltMaxAngleY={5}
          perspective={1600}
          scale={1}
          transitionSpeed={350}
          glareEnable
          glareMaxOpacity={0.16}
          glareColor="#ffffff"
          glarePosition="all"
          glareBorderRadius="10px"
        >
          <div className="relative" style={{ width, height }}>
            <NoteCard
              dateLabel={dateLabel}
              body=""
              name={name || "…"}
              seed="draft"
              scale={scale}
            >
              <textarea
                ref={bodyRef}
                value={body}
                maxLength={BODY_MAX_LENGTH}
                spellCheck={false}
                placeholder="what should I be thinking about?"
                disabled={tool !== null}
                onChange={(event) => setBody(event.target.value)}
                onKeyDown={(event) => {
                  // Enter drops the card in the pile; Shift+Enter is a newline.
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    submit();
                  }
                }}
                className="hand hand-body absolute resize-none border-none bg-transparent p-0 outline-none placeholder:text-ink/25"
                style={{
                  left: BODY_LEFT,
                  top: BODY_TOP,
                  width: BODY_WIDTH,
                  caretColor: "#080808",
                }}
              />
            </NoteCard>

            <DrawingLayer
              width={width}
              height={height}
              tool={tool}
              handleRef={drawingRef}
              onStrokeEnd={(empty) => setHasInk(!empty)}
            />
          </div>
        </Tilt>
      </div>

      <motion.div
        animate={{ opacity: handedOff ? 0 : 1 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col items-center gap-4"
      >
        <PenToolbar
          tool={tool}
          onChange={setTool}
          canClear={hasInk}
          onClear={() => {
            drawingRef.current?.clear();
            setHasInk(false);
          }}
        />

        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="cursor-pointer text-[11px] text-black/45 transition-opacity hover:text-black disabled:cursor-default disabled:opacity-35"
        >
          press <kbd className="key">enter</kbd> to drop it in the pile
        </button>
      </motion.div>
    </motion.div>
  );
}
