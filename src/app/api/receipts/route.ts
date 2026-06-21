import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
}

export interface ParsedReceipt {
  items: ReceiptItem[];
  subtotal: number;
  serviceFeePct: number;
  total: number;
}

const SYSTEM_PROMPT = `You are a receipt parser. Extract the line items, subtotal, service fee percentage, and total from the receipt image.

Return ONLY valid JSON matching this exact schema:
{
  "items": [{ "name": string, "qty": number, "price": number }],
  "subtotal": number,
  "serviceFeePct": number,
  "total": number
}

Rules:
- "price" is the total price for that line (qty × unit price)
- "serviceFeePct" is the service/gratuity/tip percentage shown on the receipt (0 if none)
- All monetary values are in the receipt's currency as plain numbers (no symbols)
- If a field cannot be determined, use 0`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("receipt");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing receipt file" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mediaType = file.type as "image/jpeg" | "image/png" | "image/gif" | "image/webp";

  const stream = await client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          { type: "text", text: "Parse this receipt and return the JSON." },
        ],
      },
    ],
  });

  const message = await stream.finalMessage();
  const text = message.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    return NextResponse.json({ error: "No text response from AI" }, { status: 502 });
  }

  const jsonMatch = text.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Could not parse AI response as JSON" }, { status: 502 });
  }

  let parsed: ParsedReceipt;
  try {
    parsed = JSON.parse(jsonMatch[0]) as ParsedReceipt;
  } catch {
    return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 502 });
  }

  return NextResponse.json(parsed);
}
