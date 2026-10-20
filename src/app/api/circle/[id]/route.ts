import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const runtime = "nodejs";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid contact id." }, { status: 400 });
  }

  try {
    await pool.query("DELETE FROM circle_members WHERE id = $1", [id]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete circle member:", error);
    return NextResponse.json(
      { error: "Could not remove contact." },
      { status: 500 }
    );
  }
}
