import { getNameList } from "@/lib/db/api/getNameList";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await getNameList();
  return NextResponse.json(result);
}
