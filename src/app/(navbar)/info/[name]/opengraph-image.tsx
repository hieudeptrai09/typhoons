import { TITLE_COMMON } from "@/lib/constants";
import { TAG_HEX, TAG_ICONS } from "@/lib/constants/tags";
import { getNameList } from "@/lib/db/api/getNameList";
import { getTyphoonNameByName } from "@/lib/db/api/getTyphoonNameByName";
import type { RetiredName, Storm, TyphoonName } from "@/lib/types";
import { BACKGROUND_BADGE, isExternalPosition, TEXT_COLOR_BADGE } from "@/lib/utils/colors";
import { loadOgFonts } from "@/lib/utils/ogFont";
import { condenseMeaning, meaningFontSize, nameFontSize } from "@/lib/utils/ogMeaning";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `Typhoon name details | ${TITLE_COMMON}`;

export async function generateStaticParams() {
  const result = await getNameList();
  if (!result?.data) return [];
  return result.data.map((name) => ({ name: name.toLowerCase() }));
}

const TEAL = "#0d9488";
const INK = "#0f172a";
const MUTED = "#64748b";
const HAIRLINE = "#e2e8f0";

const lastStorm = (storms: Storm[]): Storm | null => storms[storms.length - 1];

function statusOf(name: TyphoonName | RetiredName) {
  if (isExternalPosition(name.position)) {
    return { label: "External name", fg: "#475569", bg: "#f1f5f9" };
  }
  if (name.isLanguageProblem === 2) {
    return { label: "Misspelling", fg: "#d97706", bg: "#fef3c7" };
  }
  if (name.isRetired) {
    const year = "lastYear" in name && name.lastYear ? ` ${name.lastYear}` : "";
    return { label: `Retired${year}`, fg: "#dc2626", bg: "#fee2e2" };
  }
  return { label: "Active", fg: "#059669", bg: "#d1fae5" };
}

interface Props {
  params: Promise<{ name: string }>;
}

export default async function Image({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const [result, fonts] = await Promise.all([getTyphoonNameByName(decodedName), loadOgFonts()]);
  const detail = result?.data ?? null;
  const nameDetail = detail?.name ?? null;

  const displayName = (nameDetail?.name ?? decodedName).toUpperCase();
  const meaning = nameDetail?.meaning ? condenseMeaning(nameDetail.meaning) : "";
  const status = nameDetail ? statusOf(nameDetail) : null;
  const peak = detail?.storms.length ? lastStorm(detail.storms) : null;
  const tag = nameDetail?.tag ?? "";
  const TagIcon = TAG_ICONS[tag];
  const tagColor = TAG_HEX[tag] ?? MUTED;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#ffffff",
        fontFamily: "Inter",
      }}
    >
      {/* Oversized tag icon, bled off the right edge. Fills the space a photo will later occupy. */}
      {TagIcon && (
        <div
          style={{
            position: "absolute",
            right: -110,
            top: 130,
            display: "flex",
            opacity: 0.07,
          }}
        >
          <TagIcon size={520} color={tagColor} strokeWidth={1.25} />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 14,
          height: "100%",
          display: "flex",
          backgroundColor: peak ? BACKGROUND_BADGE[peak.intensity] : TEAL,
        }}
      />

      {/* Watermark. Small on purpose: Facebook already prints the site name and domain
            beneath the card, so a large title here would be the third copy. */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 44,
          display: "flex",
          alignItems: "center",
          fontSize: 22,
          fontWeight: 600,
          color: MUTED,
          letterSpacing: 0.5,
        }}
      >
        {TITLE_COMMON}
      </div>

      {/* Hero block, anchored to the vertical centre so a 1-line and a 4-line meaning both
            grow symmetrically and never push the meta row off the card. */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 0,
          width: 780,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {status && (
            <div
              style={{
                display: "flex",
                backgroundColor: status.bg,
                color: status.fg,
                fontSize: 24,
                fontWeight: 700,
                padding: "8px 22px",
                borderRadius: 999,
              }}
            >
              {status.label}
            </div>
          )}
          {peak && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 14,
                width: 52,
                height: 52,
                backgroundColor: BACKGROUND_BADGE[peak.intensity],
                color: TEXT_COLOR_BADGE[peak.intensity],
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {peak.intensity}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: nameFontSize(displayName.length),
            fontWeight: 800,
            color: INK,
            lineHeight: 1.05,
            letterSpacing: -4,
            marginTop: 12,
          }}
        >
          {displayName}
        </div>

        {meaning && (
          <div
            style={{
              display: "flex",
              fontSize: meaningFontSize(meaning.length),
              fontStyle: "italic",
              fontWeight: 600,
              color: TEAL,
              lineHeight: 1.3,
              marginTop: 14,
            }}
          >
            {meaning}
          </div>
        )}
      </div>

      {/* Meta row */}
      <div
        style={{
          position: "absolute",
          left: 64,
          bottom: 44,
          display: "flex",
          alignItems: "center",
          fontSize: 26,
          color: MUTED,
        }}
      >
        {nameDetail?.country && (
          <div style={{ display: "flex", alignItems: "center", fontWeight: 600 }}>
            {nameDetail.country}
          </div>
        )}
        {tag && (
          <>
            <div
              style={{
                display: "flex",
                width: 1,
                height: 26,
                backgroundColor: HAIRLINE,
                margin: "0 18px",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", color: tagColor }}>
              {TagIcon && <TagIcon size={28} color={tagColor} strokeWidth={2.25} />}
              <div style={{ display: "flex", marginLeft: 10, fontWeight: 600 }}>{tag}</div>
            </div>
          </>
        )}
      </div>
    </div>,
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
