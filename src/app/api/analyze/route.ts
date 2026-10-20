import { NextRequest, NextResponse } from "next/server";
import { analyzeMessage, analyzeImage } from "@/lib/gemini";
import { pool } from "@/lib/db";

export const runtime = "nodejs";

const FALLBACK_TEXT = "Could not analyse this message, treat it with caution.";
const FALLBACK_IMAGE = "Could not analyse this screenshot, treat it with caution.";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_BYTES = 1 * 1024 * 1024;
const MAX_TEXT_LENGTH = 4000;

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") ?? "";
  let inputType: "text" | "image" = "text";
  let text = "";
  let image: { mimeType: string; data: string } | null = null;

  if (contentType.startsWith("multipart/form-data")) {
    inputType = "image";

    let file: File | null = null;
    try {
      const form = await request.formData();
      const maybeFile = form.get("image");
      if (maybeFile instanceof File) {
        file = maybeFile;
      }
    } catch (e) {
      console.error("Failed to parse upload:", e);
      return NextResponse.json({ error: FALLBACK_IMAGE }, { status: 400 });
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "Please choose an image to check." },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP or GIF images are supported." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image must be smaller than 1 MB." },
        { status: 400 }
      );
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      image = { mimeType: file.type, data: buffer.toString("base64") };
    } catch (e) {
      console.error("Failed to read image:", e);
      return NextResponse.json({ error: FALLBACK_IMAGE }, { status: 400 });
    }
  } else {
    try {
      const body = await request.json();
      text = typeof body.text === "string" ? body.text.trim() : "";
    } catch {
      return NextResponse.json({ error: FALLBACK_TEXT }, { status: 400 });
    }

    if (text.length === 0) {
      return NextResponse.json({ error: FALLBACK_TEXT }, { status: 400 });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }
  }

  let analysis;
  try {
    analysis = image ? await analyzeImage(image) : await analyzeMessage(text);
  } catch (aiError) {
    console.error("AI analysis failed:", aiError);
    return NextResponse.json(
      { error: image ? FALLBACK_IMAGE : FALLBACK_TEXT },
      { status: 502 }
    );
  }

  if (!analysis) {
    return NextResponse.json(
      { error: image ? FALLBACK_IMAGE : FALLBACK_TEXT },
      { status: 502 }
    );
  }

  try {
    await pool.query(
      `INSERT INTO checks (
        input_type, input_text, verdict, confidence, scam_type,
        red_flags, explanation_en, explanation_ur, explanation_roman, recommended_actions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        inputType,
        text,
        analysis.verdict,
        analysis.confidence,
        analysis.scam_type,
        analysis.red_flags,
        analysis.explanation_en,
        analysis.explanation_ur,
        analysis.explanation_roman,
        analysis.recommended_actions,
      ]
    );
  } catch (dbError) {
    console.error("Failed to save check:", dbError);
  }

  return NextResponse.json({ result: analysis });
}
