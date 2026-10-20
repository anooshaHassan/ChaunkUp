"use client";

import { useState } from "react";
import { highlightRedFlags, type RedFlag } from "@/lib/highlight";
import AlertPanel from "@/components/AlertPanel";
import type { AnalysisResult } from "@/lib/schema";

type Verdict = "scam" | "suspicious" | "safe";
type Language = "en" | "ur" | "roman";

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

const languageLabels: Record<Language, string> = {
  en: "English",
  ur: "اردو",
  roman: "Roman Urdu",
};

const explanationField: Record<
  Language,
  "explanation_en" | "explanation_ur" | "explanation_roman"
> = {
  en: "explanation_en",
  ur: "explanation_ur",
  roman: "explanation_roman",
};

type Props = {
  result: AnalysisResult;
  originalText?: string;
  imageUrl?: string | null;
  checkId?: number | null;
};

export default function ResultCard({ result, originalText, imageUrl, checkId }: Props) {
  const [language, setLanguage] = useState<Language>("en");

  const highlightedSegments = originalText
    ? highlightRedFlags(originalText, result.red_flags as RedFlag[])
    : [];

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 16,
        border: `3px solid ${verdictColors[result.verdict]}`,
        background: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: verdictColors[result.verdict],
            color: "#fff",
            padding: "6px 14px",
            borderRadius: 20,
            fontWeight: "bold",
          }}
        >
          {verdictLabels[result.verdict]}
        </span>
        <span style={{ color: "#555" }}>Confidence: {result.confidence}%</span>
      </div>

      <p style={{ margin: "0 0 12px", fontWeight: 600, color: "#3B2A4A" }}>
        {result.scam_type}
      </p>

      {originalText && (
        <>
          <h3 style={{ margin: "16px 0 8px", fontSize: 16, color: "#3B2A4A" }}>
            Original message
          </h3>
          <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {highlightedSegments.map((segment, i) =>
              segment.highlighted ? (
                <mark
                  key={i}
                  style={{
                    background: "#fde047",
                    color: "#1f2937",
                    borderRadius: 4,
                    padding: "0 3px",
                  }}
                >
                  {segment.text}
                </mark>
              ) : (
                <span key={i}>{segment.text}</span>
              )
            )}
          </p>
        </>
      )}

      {imageUrl && (
        <>
          <h3 style={{ margin: "16px 0 8px", fontSize: 16, color: "#3B2A4A" }}>
            Screenshot
          </h3>
          <img
            src={imageUrl}
            alt="Analyzed screenshot"
            style={{
              maxWidth: "100%",
              maxHeight: 320,
              borderRadius: 12,
              border: "1px solid #e5e7eb",
            }}
          />
        </>
      )}

      <h3 style={{ margin: "16px 0 8px", fontSize: 16, color: "#3B2A4A" }}>
        Red flags
      </h3>
      {result.red_flags.length > 0 ? (
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          {result.red_flags.map((flag, i) => (
            <li key={i} style={{ marginBottom: 8 }}>
              <strong>&ldquo;{flag.phrase}&rdquo;</strong> — {flag.reason}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ margin: 0, color: "#555" }}>No red flags found.</p>
      )}

      <div style={{ margin: "16px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(Object.keys(languageLabels) as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "1px solid #d1d5db",
              background: language === lang ? "#3B2A4A" : "#fff",
              color: language === lang ? "#fff" : "#374151",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            {languageLabels[lang]}
          </button>
        ))}
      </div>

      <h3 style={{ margin: "16px 0 8px", fontSize: 16, color: "#3B2A4A" }}>
        Explanation
      </h3>
      <p
        lang={language === "ur" ? "ur" : "en"}
        dir={language === "ur" ? "rtl" : "ltr"}
        style={{ margin: 0, lineHeight: 1.6 }}
      >
        {result[explanationField[language]]}
      </p>

      <h3 style={{ margin: "16px 0 8px", fontSize: 16, color: "#3B2A4A" }}>
        What to do next
      </h3>
      <ul style={{ paddingLeft: 18, margin: 0 }}>
        {result.recommended_actions.map((action, i) => (
          <li key={i} style={{ marginBottom: 6 }}>
            {action}
          </li>
        ))}
      </ul>

      {typeof checkId === "number" && result.verdict !== "safe" && (
        <AlertPanel checkId={checkId} result={result} />
      )}
    </div>
  );
}
