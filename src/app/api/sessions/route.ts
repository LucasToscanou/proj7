import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createSession } from "@/lib/sessions";
import type { ParsedReceipt } from "@/app/api/receipts/route";

export async function POST(req: NextRequest) {
  let body: { receipt: ParsedReceipt };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.receipt || !Array.isArray(body.receipt.items)) {
    return NextResponse.json({ error: "Invalid receipt" }, { status: 400 });
  }

  const sessionId = uuidv4();
  createSession(sessionId, body.receipt);

  const origin = new URL(req.url).origin;
  const joinUrl = `${origin}/s/${sessionId}`;

  return NextResponse.json({ sessionId, joinUrl });
}
