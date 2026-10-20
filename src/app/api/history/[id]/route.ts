import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import type { AnalysisResult } from "@/lib/schema";

export const runtime = "nodejs";

type CheckRow = {
  id: number;
  created_at: string;
  input_type: string;
  input_text: string;
  verdict: "scam" | "suspicious" | "safe";
  confidence: number;
  scam_type: string;
  red_flags: { phrase: string; reason: string }[];
  explanation_en: string;
  explanation_ur: string;
  explanation_roman: string;
  recommended_actions: string[];
};

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
      `SELECT id, created_at, input_type, input_text, verdict, confidence, scam_type,
              red_flags, explanation_en, explanation_ur, explanation_roman, recommended_actions
       FROM checks WHERE id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Check not found." }, { status: 404 });
    }

    const row = rows[0];
    const result: AnalysisResult = {
      verdict: row.verdict,
      confidence: row.confidence,
      scam_type: row.scam_type,
      red_flags: row.red_flags,
      explanation_en: row.explanation_en,
      explanation_ur: row.explanation_ur,
      explanation_roman: row.explanation_roman,
      recommended_actions: row.recommended_actions,
    };

    return NextResponse.json({
      check: {
        id: row.id,
        created_at: row.created_at,
        input_type: row.input_type,
        input_text: row.input_text,
        result,
      },
    });
  } catch (error) {
    console.error("Failed to fetch check:", error);
    return NextResponse.json(
      { error: "Could not load the check." },
      { status: 500 }
    );
  }
}
