import { CACHE_TAGS, isCacheTag } from "@/lib/db/cacheTags";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Every cached query is `revalidate: false`, so the site only picks up DB changes when
// this route is called. Without it a data update would need a redeploy.
//   curl -X POST "https://typhoons.vercel.app/api/revalidate/?secret=..."                    -> everything
//   curl -X POST "https://typhoons.vercel.app/api/revalidate/?secret=...&tag=name:nolo"      -> one tag
//   curl -X POST "https://typhoons.vercel.app/api/revalidate/?secret=..." -d '{"tags":[...]}' -> several
// The Supabase webhooks send the JSON body form, one request per statement.
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

  // A missing or non-JSON body just means the tags, if any, came in the query string.
  const body: unknown = await request.json().catch(() => null);
  const bodyTags = body !== null && typeof body === "object" && "tags" in body ? body.tags : [];

  if (!Array.isArray(bodyTags) || !bodyTags.every((tag) => typeof tag === "string")) {
    return NextResponse.json({ error: '"tags" must be an array of strings' }, { status: 400 });
  }

  const requested = [...new Set([...searchParams.getAll("tag"), ...bodyTags])];
  const unknown = requested.filter((tag) => !isCacheTag(tag));

  if (unknown.length > 0) {
    return NextResponse.json({ error: "Unknown tags", unknown }, { status: 400 });
  }

  const tags = requested.length === 0 ? [CACHE_TAGS.all] : requested;
  // "max" matches the `revalidate: false` the cached queries are registered with.
  tags.forEach((tag) => revalidateTag(tag, "max"));

  return NextResponse.json({ revalidated: tags, now: Date.now() });
}
