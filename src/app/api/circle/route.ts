import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, contact FROM circle_members ORDER BY created_at DESC"
    );
    return NextResponse.json({ contacts: rows });
  } catch (error) {
    console.error("Failed to list circle members:", error);
    return NextResponse.json(
      { error: "Could not load contacts." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: { name?: unknown; contact?: unknown } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const contact = typeof body.contact === "string" ? body.contact.trim() : "";

  if (name.length === 0 || contact.length === 0) {
    return NextResponse.json(
      { error: "Name and contact are required." },
      { status: 400 }
    );
  }

  if (name.length > 100 || contact.length > 255) {
    return NextResponse.json(
      { error: "Name or contact is too long." },
      { status: 400 }
    );
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO circle_members (name, contact)
       VALUES ($1, $2)
       RETURNING id, name, contact`,
      [name, contact]
    );
    return NextResponse.json({ contact: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Failed to add circle member:", error);
    return NextResponse.json(
      { error: "Could not save contact." },
      { status: 500 }
    );
  }
}
