import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getOwnerIdFromRequest, ownerIdRequiredResponse } from "@/lib/ownerIdServer";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ownerId = getOwnerIdFromRequest(request);
  if (!ownerId) return ownerIdRequiredResponse();

  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid contact id." },
      { status: 400 }
    );
  }

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM circle_members WHERE id = $1 AND owner_id = $2",
      [id, ownerId]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { error: "Contact not found." },
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete circle member:", error);
    return NextResponse.json(
      { error: "Could not remove contact." },
      { status: 500 }
    );
  }
}
