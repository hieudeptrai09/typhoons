import { timingSafeEqual } from "node:crypto";
import { drainOutbox, isPushConfigured } from "@/lib/push/deliver";
import { NextResponse } from "next/server";

// web-push signs VAPID headers with node crypto, so this cannot run on the edge.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const isAuthorized = (request: Request): boolean => {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  // Vercel Cron sends the secret as a bearer token; any external scheduler can do the same.
  const header = request.headers.get("authorization") ?? "";
  const given = Buffer.from(header);
  const want = Buffer.from(`Bearer ${secret}`);

  return given.length === want.length && timingSafeEqual(given, want);
};

async function handle(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isPushConfigured()) {
    return NextResponse.json({ error: "Web push is not configured" }, { status: 503 });
  }

  const result = await drainOutbox();
  return NextResponse.json(result);
}

// Vercel Cron issues GET; POST is here so an external scheduler or a curl can use either.
export const GET = handle;
export const POST = handle;
