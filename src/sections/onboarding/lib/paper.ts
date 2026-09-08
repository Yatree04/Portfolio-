/**
 * PAPER TEXTURE - 02, procedurally.
 *
 * The Figma file layers a raster paper photo over every card at 51% opacity.
 * That bitmap is not distributable with this repo, so the same crumple is
 * synthesised with SVG filters instead: fractal noise lit from the upper-left
 * gives the folds, a second high-frequency pass gives the fibre grain.
 *
 * It is baked once into a data URI and used as a plain CSS background-image
 * rather than a live `filter:` on each card — a live feTurbulence per card
 * would be re-evaluated for every card in the pile and drop frames. To use the
 * real bitmap instead, point PAPER_TEXTURE_URL at it; nothing else changes.
 */

/** Figma draws the texture at 693 x 461.887, offset -34 / -28 on the card. */
export const TEXTURE_W = 693;
export const TEXTURE_H = 462;
export const TEXTURE_OFFSET_X = -34;
export const TEXTURE_OFFSET_Y = -28;
/** The layer opacity Figma reports for PAPER TEXTURE - 02. */
export const TEXTURE_OPACITY = 0.51;

const TEXTURE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${TEXTURE_W}" height="${TEXTURE_H}" viewBox="0 0 ${TEXTURE_W} ${TEXTURE_H}">
<filter id="crumple" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.011 0.015" numOctaves="5" seed="7"/>
<feDiffuseLighting lighting-color="#ffffff" surfaceScale="4.4" diffuseConstant="1">
<feDistantLight azimuth="235" elevation="62"/>
</feDiffuseLighting>
<feComponentTransfer>
<feFuncR type="linear" slope="0.36" intercept="0.66"/>
<feFuncG type="linear" slope="0.36" intercept="0.66"/>
<feFuncB type="linear" slope="0.36" intercept="0.66"/>
</feComponentTransfer>
</filter>
<filter id="fibre" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" seed="19"/>
<feColorMatrix type="saturate" values="0"/>
<feComponentTransfer>
<feFuncR type="linear" slope="0.15" intercept="0.87"/>
<feFuncG type="linear" slope="0.15" intercept="0.87"/>
<feFuncB type="linear" slope="0.15" intercept="0.87"/>
</feComponentTransfer>
</filter>
<rect width="100%" height="100%" filter="url(#crumple)"/>
<rect width="100%" height="100%" filter="url(#fibre)"/>
</svg>`;

export const PAPER_TEXTURE_URL = `url("data:image/svg+xml,${encodeURIComponent(
  TEXTURE_SVG,
)}")`;
