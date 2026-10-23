import { NextRequest, NextResponse } from "next/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidOwnerId(value: string): boolean {
  return UUID_REGEX.test(value.trim());
}

export function getOwnerIdFromRequest(request: NextRequest): string | null {
  const headerValue = request.headers.get("x-owner-id");
  const queryValue = request.nextUrl.searchParams.get("owner");

  const headerValid = headerValue && isValidOwnerId(headerValue);
  const queryValid = queryValue && isValidOwnerId(queryValue);

  const source = headerValid ? "header" : queryValid ? "query" : "none";
  console.log(`[owner] source=${source} matched=${source !== "none"}`);

  if (headerValid) return headerValue.trim();
  if (queryValid) return queryValue.trim();
  return null;
}

export function ownerIdRequiredResponse(): NextResponse {
  return NextResponse.json(
    { error: "Missing or invalid owner id." },
    { status: 400 }
  );
}
