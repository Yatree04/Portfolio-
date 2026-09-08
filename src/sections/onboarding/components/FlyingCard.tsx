import { motion } from "framer-motion";
import { CARD_H, CARD_W } from "../lib/layout";
import type { Note } from "../types";
import { NoteCard } from "./NoteCard";

export interface Flight {
  from: { x: number; y: number; scale: number };
  to: { x: number; y: number; scale: number; rotate: number };
}

export interface FlyingCardProps {
  note: Note;
  flight: Flight;
  onArrived: () => void;
}

/** Card box is translated from the top-left origin, so shift by half its size. */
const HALF_W = CARD_W / 2;
const HALF_H = CARD_H / 2;

/**
 * The toss. The finished card lifts off the composer, arcs up, tumbles, and
 * settles into the exact slot the pile has already reserved for it.
 */
export function FlyingCard({ note, flight, onArrived }: FlyingCardProps) {
  const { from, to } = flight;
  const fromX = from.x - HALF_W;
  const fromY = from.y - HALF_H;
  const toX = to.x - HALF_W;
  const toY = to.y - HALF_H;
  const apexY = Math.min(fromY, toY) - 120;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ width: CARD_W, height: CARD_H, transformOrigin: "center" }}
      initial={{ x: fromX, y: fromY, scale: from.scale, rotate: 0 }}
      animate={{
        x: [fromX, fromX + (toX - fromX) * 0.5, toX],
        y: [fromY, apexY, toY],
        scale: [from.scale, from.scale * 1.06, to.scale],
        rotate: [0, to.rotate * 2.4, to.rotate * 0.82, to.rotate],
      }}
      transition={{
        duration: 1.15,
        times: [0, 0.45, 1],
        ease: [0.2, 0.85, 0.25, 1],
        rotate: { duration: 1.15, times: [0, 0.4, 0.78, 1], ease: "easeOut" },
      }}
      onAnimationComplete={onArrived}
    >
      <NoteCard
        dateLabel={note.dateLabel}
        body={note.body}
        name={note.name}
        signature={note.signature}
        seed={note.id}
      />
    </motion.div>
  );
}
