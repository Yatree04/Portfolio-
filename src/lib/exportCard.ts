import { toPng } from "html-to-image";

/**
 * html-to-image otherwise walks every stylesheet on the page to inline fonts,
 * which throws on the cross-origin Google Fonts sheet and is slow. The card
 * only ever uses the local handwriting face, so hand it exactly that, inlined.
 */
let handwritingCss: Promise<string> | null = null;

function embedHandwritingFont(): Promise<string> {
  handwritingCss ??= (async () => {
    try {
      const response = await fetch("/QEBradenHill.ttf");
      const buffer = await response.arrayBuffer();
      let binary = "";
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]!);
      }
      return `@font-face{font-family:"Handwriting";src:url(data:font/ttf;base64,${btoa(
        binary,
      )}) format("truetype");}`;
    } catch {
      return "";
    }
  })();
  return handwritingCss;
}

/**
 * Rasterise a rendered card to a PNG data URL.
 *
 * This is the hand-off point for a real gallery backend: the same data URL can
 * be POSTed instead of (or as well as) being downloaded. Failures are not
 * fatal — a note that could not be rasterised still drops into the pile.
 */
export async function exportCardPng(
  node: HTMLElement,
  pixelRatio = 2,
): Promise<string | null> {
  try {
    // The handwriting face must be resolved before the snapshot is taken or
    // the export falls back to a system font.
    if ("fonts" in document) await document.fonts.ready;
    return await toPng(node, {
      pixelRatio,
      cacheBust: true,
      fontEmbedCSS: await embedHandwritingFont(),
      backgroundColor: "#fff9c0",
    });
  } catch {
    return null;
  }
}

export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

/** "amber-fox-8-9-26.png" */
export function cardFilename(name: string, dateLabel: string): string {
  const slug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  return `${slug(name) || "note"}-${slug(dateLabel)}.png`;
}
