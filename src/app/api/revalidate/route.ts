import { ALL_CACHE_TAGS, isCacheTag } from "@/lib/db/cacheTags";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Every cached query is `revalidate: false`, so the site only picks up DB changes when
// this route is called. Without it a data update would need a redeploy.
//   curl -X POST "https://typhoons.vercel.app/api/revalidate?secret=..."         -> everything
//   curl -X POST "https://typhoons.vercel.app/api/revalidate?secret=...&tag=names" -> one tag
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  // Fail closed: an unset secret would otherwise leave the route open to anyone.
  if (!secret) {
    return NextResponse.json({ error: "REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);

  if (searchParams.get("secret") !== secret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const requested = searchParams.get("tag");

  if (requested !== null && !isCacheTag(requested)) {
    return NextResponse.json(
      { error: `Unknown tag "${requested}"`, known: ALL_CACHE_TAGS },
      { status: 400 },
    );
  }

  const tags = requested === null ? ALL_CACHE_TAGS : [requested];
  // "max" matches the `revalidate: false` the cached queries are registered with.
  tags.forEach((tag) => revalidateTag(tag, "max"));

  return NextResponse.json({ revalidated: tags, now: Date.now() });
}
