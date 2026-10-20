import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

type RedFlagRow = { phrase: string; reason: string };

type CheckRow = {
  input_text: string;
  verdict: "scam" | "suspicious" | "safe";
  confidence: number;
  scam_type: string;
  red_flags: RedFlagRow[];
  explanation_en: string;
};

function buildAlertText(row: CheckRow): string {
  const verdictLabel =
    row.verdict === "scam"
      ? "Scam"
      : row.verdict === "suspicious"
      ? "Suspicious"
      : "Looks Safe";

  let text = `ChaunkUp alert`;
  text += `\n\nResult: ${verdictLabel} (${row.confidence}% confidence)`;
  text += `\nType: ${row.scam_type}`;

  if (row.input_text) {
    text += `\n\nOriginal message:\n${row.input_text}`;
  }

  const flags = (row.red_flags ?? []).slice(0, 3);
  if (flags.length > 0) {
    text += "\n\nRed flags:";
    for (const flag of flags) {
      text += `\n- "${flag.phrase}": ${flag.reason}`;
    }
  }

  text += `\n\nAdvice: ${row.explanation_en}`;
  text += `\n\nStay safe — ChaunkUp`;
  return text;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid check id." }, { status: 400 });
  }

  try {
    const { rows } = await pool.query<CheckRow>(
      "SELECT input_text, verdict, confidence, scam_type, red_flags, explanation_en FROM checks WHERE id = $1",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Check not found." }, { status: 404 });
    }

    return NextResponse.json({ text: buildAlertText(rows[0]) });
  } catch (error) {
    console.error("Failed to build alert:", error);
    return NextResponse.json(
      { error: "Could not build alert." },
      { status: 500 }
    );
  }
}
