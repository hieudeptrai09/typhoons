// Satori has no access to the browser's fonts and cannot parse woff2, so the OG card fetches real TTFs at build time. Google serves TTF only to legacy user agents; a modern UA gets woff2.
const LEGACY_UA = "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko";

type FontStyle = "normal" | "italic";

interface FaceSpec {
  weight: 400 | 600 | 800;
  style: FontStyle;
  axis: string;
}

const FACES: FaceSpec[] = [
  { weight: 600, style: "normal", axis: "wght@600" },
  { weight: 800, style: "normal", axis: "wght@800" },
  { weight: 600, style: "italic", axis: "ital,wght@1,600" },
];

export interface LoadedFont {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 600 | 800;
  style: FontStyle;
}

async function loadFace(spec: FaceSpec): Promise<LoadedFont | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Inter:${spec.axis}`, {
      headers: { "User-Agent": LEGACY_UA },
    }).then((res) => res.text());

    // Satori parses ttf/otf/woff but not woff2, which is all a modern UA is offered.
    const url = css.match(/src: url\((https:[^)]+)\) format\('(?:truetype|opentype|woff)'\)/)?.[1];
    if (!url) return null;

    const data = await fetch(url).then((res) => res.arrayBuffer());
    return { name: "Inter", data, weight: spec.weight, style: spec.style };
  } catch (error) {
    console.warn(`[og] Inter ${spec.axis} unavailable, falling back to default font:`, error);
    return null;
  }
}

// One fetch shared across all 221 statically generated cards.
let cached: Promise<LoadedFont[]> | null = null;

// Returns [] if Google is unreachable; ImageResponse then falls back to its bundled font, which yields an ugly card rather than a failed build.
export function loadOgFonts(): Promise<LoadedFont[]> {
  cached ??= Promise.all(FACES.map(loadFace)).then((faces) =>
    faces.filter((face): face is LoadedFont => face !== null),
  );
  return cached;
}
