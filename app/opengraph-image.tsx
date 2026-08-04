import { ImageResponse } from "next/og";

export const alt = "Caleb Bolden — AI systems, process consulting, and writing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const WORDMARK = "CALEB BOLDEN";
const TAGLINE = "I automate the work you shouldn't be doing.";
const ANNOTATION = "AI SYSTEMS FOR SMALL BUSINESSES · CALEBBOLDEN.COM";
const STICKY_LABEL = "AUTOMATE THIS";

const INK = "#111A1E";
const INK_MUTED = "#424F56";
const BLUE = "#006C7D";
const HAIRLINE = "rgba(17, 26, 30, 0.14)";
const GRID_LINE = "rgba(0, 108, 125, 0.09)";
const STICKY = "#FAD27B";
const STICKY_EDGE = "#E3AD4B";

// Google Fonts' css2 endpoint serves a legacy TrueType resource (rather than
// woff2) when the request carries no browser User-Agent, which is what a
// server-side fetch() sends by default. Satori (ImageResponse's renderer)
// needs ttf/otf, so this is the standard way to pull a Google font into it.
async function loadArchivo(weight: 500 | 700, text: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=Archivo:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`Archivo ${weight}: no ttf resource in css2 response`);
  const fontRes = await fetch(match[1]);
  if (fontRes.status !== 200) throw new Error(`Archivo ${weight}: font fetch failed (${fontRes.status})`);
  return fontRes.arrayBuffer();
}

export default async function Image() {
  const allText = `${WORDMARK}${TAGLINE}${ANNOTATION}${STICKY_LABEL}`;

  let fonts: { name: string; data: ArrayBuffer; weight: 500 | 700; style: "normal" }[] = [];
  try {
    const [bold, medium] = await Promise.all([
      loadArchivo(700, allText),
      loadArchivo(500, allText),
    ]);
    fonts = [
      { name: "Archivo", data: bold, weight: 700, style: "normal" },
      { name: "Archivo", data: medium, weight: 500, style: "normal" },
    ];
  } catch {
    // Font load failed (network hiccup at build time, API shape change,
    // etc). Fall back to Satori's default sans rather than fail the build;
    // layout and weight carry the design more than the exact face.
    fonts = [];
  }

  const fontFamily = fonts.length ? "Archivo" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FFFFFF",
          backgroundImage: `linear-gradient(to right, ${GRID_LINE} 1px, transparent 1px), linear-gradient(to bottom, ${GRID_LINE} 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          padding: "64px 88px",
          position: "relative",
          fontFamily,
        }}
      >
        {/* Mat-board frame, hairline inset from the canvas edge */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            right: "24px",
            bottom: "24px",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: "2px",
            display: "flex",
          }}
        />

        {/* One amber sticky note, top right, per the working-wall rule of max one per section */}
        <div
          style={{
            position: "absolute",
            top: "64px",
            right: "96px",
            width: "116px",
            height: "116px",
            backgroundColor: STICKY,
            border: `1px solid ${STICKY_EDGE}`,
            borderRadius: "2px",
            transform: "rotate(3deg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "10px",
            color: INK,
            fontSize: "16px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          {STICKY_LABEL}
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "48px" }}>
          <div
            style={{
              display: "flex",
              fontSize: "104px",
              fontWeight: 700,
              color: INK,
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            {WORDMARK}
          </div>
          <div
            style={{
              display: "flex",
              width: "220px",
              height: "3px",
              backgroundColor: BLUE,
              marginTop: "32px",
              marginBottom: "32px",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: "38px",
              fontWeight: 500,
              color: INK_MUTED,
              maxWidth: "820px",
            }}
          >
            {TAGLINE}
          </div>
        </div>

        {/* Bottom annotation row */}
        <div
          style={{
            display: "flex",
            fontSize: "22px",
            fontWeight: 500,
            color: BLUE,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {ANNOTATION}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}
