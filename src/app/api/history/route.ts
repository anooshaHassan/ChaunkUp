import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getOwnerIdFromRequest, ownerIdRequiredResponse } from "@/lib/ownerIdServer";

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

export async function GET(request: NextRequest) {
  const ownerId = getOwnerIdFromRequest(request);
  if (!ownerId) return ownerIdRequiredResponse();

  try {
    const { rows } = await pool.query<HistoryRow>(
      `SELECT id, created_at, input_type, input_text, verdict, confidence, scam_type
       FROM checks
       WHERE owner_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [ownerId]
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
