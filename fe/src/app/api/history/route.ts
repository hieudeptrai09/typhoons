import { getStormHistory } from "@/lib/db/api/getStormHistory";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const positionParam = request.nextUrl.searchParams.get("position");
  if (positionParam === null) {
    return NextResponse.json({ error: "Missing required parameter: position" }, { status: 400 });
  }
  const result = await getStormHistory(parseInt(positionParam, 10));
  return NextResponse.json(result);
}
