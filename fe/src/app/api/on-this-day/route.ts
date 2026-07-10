import { getOnThisDay } from "@/lib/db/api/getOnThisDay";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const now = new Date();
  const dayParam = request.nextUrl.searchParams.get("day");
  const monthParam = request.nextUrl.searchParams.get("month");
  const day = dayParam !== null ? parseInt(dayParam, 10) : now.getDate();
  const month = monthParam !== null ? parseInt(monthParam, 10) : now.getMonth() + 1;
  const result = await getOnThisDay(day, month);
  return NextResponse.json(result);
}
