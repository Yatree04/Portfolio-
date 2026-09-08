import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

/**
 * Visitors are anonymous, so everyone arrives already wearing a name —
 * "Small Meadowlark", "Amber Otter". They can overwrite it if they'd rather.
 */
export function generateName(): string {
  return uniqueNamesGenerator({
    dictionaries: [Math.random() < 0.5 ? adjectives : colors, animals],
    separator: " ",
    style: "capital",
    length: 2,
  });
}

/** The card only has so much room on the "From," line. */
export const NAME_MAX_LENGTH = 24;
