import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { validateContact, normalizePhone } from "@/lib/share";

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

  if (name.length === 0) {
    return NextResponse.json(
      { error: "Name is required." },
      { status: 400 }
    );
  }

  if (name.length > 100) {
    return NextResponse.json(
      { error: "Name must be 100 characters or fewer." },
      { status: 400 }
    );
  }

  const contactCheck = validateContact(contact);
  if (!contactCheck.valid) {
    return NextResponse.json(
      { error: contactCheck.error },
      { status: 400 }
    );
  }

  if (contact.length > 255) {
    return NextResponse.json(
      { error: "Contact must be 255 characters or fewer." },
      { status: 400 }
    );
  }

  try {
    if (contact.includes("@")) {
      const { rows } = await pool.query(
        "SELECT id FROM circle_members WHERE LOWER(contact) = LOWER($1)",
        [contact]
      );
      if (rows.length > 0) {
        return NextResponse.json(
          { error: "This email is already saved." },
          { status: 409 }
        );
      }
    } else {
      const digits = normalizePhone(contact);
      const { rows } = await pool.query(
        "SELECT id FROM circle_members WHERE regexp_replace(contact, '[^0-9]', '', 'g') = $1",
        [digits]
      );
      if (rows.length > 0) {
        return NextResponse.json(
          { error: "This phone number is already saved." },
          { status: 409 }
        );
      }
    }

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
