import { getActiveOnThisDay } from "@/lib/db/api/getActiveOnThisDay";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const now = new Date();
  const dayParam = request.nextUrl.searchParams.get("day");
  const monthParam = request.nextUrl.searchParams.get("month");
  const day = dayParam !== null ? parseInt(dayParam, 10) : now.getDate();
  const month = monthParam !== null ? parseInt(monthParam, 10) : now.getMonth() + 1;
  const result = await getActiveOnThisDay(day, month);
  return NextResponse.json(result);
}
