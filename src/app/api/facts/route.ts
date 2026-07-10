import { getRandomFact } from "@/lib/db/api/getRandomFact";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getRandomFact();
  return NextResponse.json(result);
}
