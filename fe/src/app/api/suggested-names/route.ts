import { getSuggestedNames } from "@/lib/db/api/getSuggestedNames";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const nameIdParam = request.nextUrl.searchParams.get("nameId");
  const nameId = nameIdParam !== null ? parseInt(nameIdParam, 10) : null;
  const result = await getSuggestedNames(nameId);
  return NextResponse.json(result);
}
