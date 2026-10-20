"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Verdict = "scam" | "suspicious" | "safe";

type Check = {
  id: number;
  created_at: string;
  input_type: string;
  input_text: string;
  verdict: Verdict;
  confidence: number;
  scam_type: string;
};

const verdictColors: Record<Verdict, string> = {
  scam: "#ef4444",
  suspicious: "#eab308",
  safe: "#22c55e",
};

const verdictLabels: Record<Verdict, string> = {
  scam: "Scam",
  suspicious: "Suspicious",
  safe: "Looks Safe",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function snippet(text: string, max = 90): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max) + "…" : t;
}

export default function HistoryPage() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        if (res.ok) {
          setChecks(data.checks ?? []);
        } else {
          setError(data.error || "Could not load history.");
        }
      } catch {
        setError("Could not load history.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px 48px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#3B2A4A" }}>
          History
        </h1>
        <Link
          href="/"
          style={{
            color: "#7c3aed",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 15,
            whiteSpace: "nowrap",
          }}
        >
          ← New check
        </Link>
      </div>

      {loading && <p style={{ color: "#6b21a8" }}>Loading past checks...</p>}

      {error && (
        <div
          style={{
            padding: 16,
            background: "#fef3c7",
            borderRadius: 12,
            color: "#92400e",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && checks.length === 0 && (
        <p style={{ color: "#6b21a8" }}>
          No checks yet.{" "}
          <Link href="/" style={{ color: "#7c3aed", fontWeight: 600 }}>
            Run your first check.
          </Link>
        </p>
      )}

      {!loading && checks.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {checks.map((check) => (
            <li key={check.id} style={{ marginBottom: 12 }}>
              <Link
                href={`/history/${check.id}`}
                style={{
                  display: "block",
                  padding: 16,
                  background: "#fff",
                  borderRadius: 14,
                  border: "1px solid #e9d5ff",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      background: verdictColors[check.verdict],
                      color: "#fff",
                      padding: "4px 10px",
                      borderRadius: 12,
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    {verdictLabels[check.verdict]}
                  </span>
                  <span style={{ color: "#7c3aed", fontSize: 13 }}>
                    {formatDate(check.created_at)}
                  </span>
                </div>
                <p
                  style={{
                    margin: "0 0 6px",
                    fontWeight: 600,
                    color: "#3B2A4A",
                    fontSize: 15,
                  }}
                >
                  {check.scam_type}
                </p>
                <p
                  style={{
                    margin: 0,
                    color: "#6b7280",
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  {check.input_type === "image"
                    ? "Screenshot"
                    : snippet(check.input_text)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
