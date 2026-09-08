import { toPng } from "html-to-image";

/** Where the handwriting face is served from in a normal build. */
const FONT_URL = "/QEBradenHill.ttf";

/**
 * html-to-image otherwise walks every stylesheet on the page to inline fonts,
 * which throws on the cross-origin Google Fonts sheet and is slow. The card
 * only ever uses the local handwriting face, so hand it exactly that, inlined.
 */
let handwritingCss: Promise<string> | null = null;

/** Pull the @font-face this page already declares, if it carries the bytes. */
function fontFaceFromStyleSheets(): string | null {
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      // Cross-origin sheet (Google Fonts) — not ours to read, and not needed.
      continue;
    }
    for (const rule of Array.from(rules)) {
      const text = rule.cssText;
      // cssText may serialise the src as url(data:…) or url("data:…").
      if (
        text.startsWith("@font-face") &&
        text.includes("Handwriting") &&
        /url\(["']?data:/.test(text)
      ) {
        return text;
      }
    }
  }
  return null;
}

function embedHandwritingFont(): Promise<string> {
  handwritingCss ??= (async () => {
    // A single-file build already inlines the face as a data: URI, and there
    // is no /QEBradenHill.ttf to fetch. Prefer whatever the page declares.
    const declared = fontFaceFromStyleSheets();
    if (declared) return declared;

    try {
      const response = await fetch(FONT_URL);
      if (!response.ok) return "";
      const bytes = new Uint8Array(await response.arrayBuffer());
      let binary = "";
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
