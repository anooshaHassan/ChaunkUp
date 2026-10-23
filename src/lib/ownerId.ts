"use client";

export const OWNER_ID_KEY = "chaunkup_owner";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidOwnerId(value: string): boolean {
  return UUID_REGEX.test(value.trim());
}

export function generateOwnerId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getOwnerId(): string {
  if (typeof window === "undefined") {
    return generateOwnerId();
  }

  try {
    let id = window.localStorage.getItem(OWNER_ID_KEY);
    if (!id || !isValidOwnerId(id)) {
      id = generateOwnerId();
      window.localStorage.setItem(OWNER_ID_KEY, id);
    }
    return id;
  } catch {
    return generateOwnerId();
  }
}

export function getOwnerHeaders(): Record<string, string> {
  return { "x-owner-id": getOwnerId() };
}

function inputToUrlString(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const ownerId = getOwnerId();
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost";
  const url = new URL(inputToUrlString(input), base);
  url.searchParams.set("owner", ownerId);

  const headers = new Headers(init.headers);
  headers.set("x-owner-id", ownerId);

  return fetch(url.toString(), { ...init, headers });
}
