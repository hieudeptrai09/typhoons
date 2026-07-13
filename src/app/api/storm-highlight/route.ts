import { getStormHighlight } from "@/lib/db/api/getStormHighlight";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getStormHighlight();
  return NextResponse.json(result);
}
