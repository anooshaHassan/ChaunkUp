import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const runtime = "nodejs";

type HistoryRow = {
  id: number;
  created_at: string;
  input_type: string;
  input_text: string;
  verdict: "scam" | "suspicious" | "safe";
  confidence: number;
  scam_type: string;
};

export async function GET() {
  try {
    const { rows } = await pool.query<HistoryRow>(
      `SELECT id, created_at, input_type, input_text, verdict, confidence, scam_type
       FROM checks
       ORDER BY created_at DESC
       LIMIT 100`
    );
    return NextResponse.json({ checks: rows });
  } catch (error) {
    console.error("Failed to list history:", error);
    return NextResponse.json(
      { error: "Could not load history." },
      { status: 500 }
    );
  }
}
