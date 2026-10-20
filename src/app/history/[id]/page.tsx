"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import type { AnalysisResult } from "@/lib/schema";

type Check = {
  id: number;
  created_at: string;
  input_type: string;
  input_text: string;
  result: AnalysisResult;
};

export default function HistoryDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [check, setCheck] = useState<Check | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/history/${id}`);
        const data = await res.json();
        if (res.ok) {
          setCheck(data.check);
        } else {
          setError(data.error || "Could not load this check.");
        }
      } catch {
        setError("Could not load this check.");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

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
          Check result
        </h1>
        <Link
          href="/history"
          style={{
            color: "#7c3aed",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 15,
            whiteSpace: "nowrap",
          }}
        >
          ← Back to history
        </Link>
      </div>

      {loading && <p style={{ color: "#6b21a8" }}>Loading check...</p>}

      {error && (
        <div
          style={{
            padding: 16,
            background: "#fef3c7",
            borderRadius: 12,
            color: "#92400e",
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {check && (
        <ResultCard
          result={check.result}
          originalText={check.input_type !== "image" ? check.input_text : undefined}
          checkId={check.id}
        />
      )}
    </main>
  );
}
