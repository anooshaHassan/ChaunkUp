"use client";

import { useState, useRef } from "react";
import { highlightRedFlags, type RedFlag } from "@/lib/highlight";
import CircleManager from "@/components/CircleManager";
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

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_BYTES = 1 * 1024 * 1024;

export default function Home() {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [checkId, setCheckId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("en");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, WebP or GIF images are supported.");
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image must be smaller than 1 MB.");
      setImageFile(null);
      setPreviewUrl(null);
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function clearImage() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setCheckId(null);
    setError(null);

    let res: Response;

    try {
      if (imageFile) {
        const form = new FormData();
        form.append("image", imageFile);
        res = await fetch("/api/analyze", {
          method: "POST",
          body: form,
        });
      } else {
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || "Could not analyse this, treat it with caution.");
      } else {
        setResult(data.result);
        setCheckId(typeof data.checkId === "number" ? data.checkId : null);
      }
    } catch {
      setError("Could not analyse this, treat it with caution.");
    } finally {
      setLoading(false);
    }
  }

  const highlightedSegments = result && !imageFile
    ? highlightRedFlags(text, result.red_flags as RedFlag[])
    : [];

  const hasInput = text.trim().length > 0 || imageFile !== null;

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>ChaunkUp</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Paste a suspicious message or upload a screenshot to check it.
      </p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the message here, or upload a screenshot below..."
          rows={6}
          style={{ width: "100%", padding: 12, fontSize: 16, boxSizing: "border-box" }}
        />

        <div style={{ marginTop: 16 }}>
          <label
            htmlFor="image"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              border: "1px solid #d1d5db",
              borderRadius: 4,
              cursor: "pointer",
              background: "#fff",
            }}
          >
            {imageFile ? "Change screenshot" : "Upload screenshot"}
          </label>
          <input
            id="image"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />

          {imageFile && (
            <button
              type="button"
              onClick={clearImage}
              style={{
                marginLeft: 8,
                padding: "10px 16px",
                border: "1px solid #d1d5db",
                borderRadius: 4,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          )}

          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#666" }}>
            Hide OTPs, PINs and card numbers before uploading. Images are not stored.
          </p>

          {previewUrl && (
            <div style={{ marginTop: 12 }}>
              <img
                src={previewUrl}
                alt="Screenshot preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: 320,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !hasInput}
          style={{
            marginTop: 16,
            padding: "12px 24px",
            fontSize: 16,
            background: "#3B2A4A",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: loading || !hasInput ? "not-allowed" : "pointer",
            opacity: loading || !hasInput ? 0.7 : 1,
          }}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: 24, padding: 16, background: "#fef3c7", borderRadius: 8 }}>
          {error}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 8,
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
                padding: "6px 12px",
                borderRadius: 16,
                fontWeight: "bold",
              }}
            >
              {verdictLabels[result.verdict]}
            </span>
            <span style={{ color: "#555" }}>Confidence: {result.confidence}%</span>
          </div>

          <p style={{ margin: "0 0 12px", fontWeight: 500 }}>{result.scam_type}</p>

          {!imageFile && (
            <>
              <h3 style={{ margin: "16px 0 8px", fontSize: 16 }}>Original message</h3>
              <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {highlightedSegments.map((segment, i) =>
                  segment.highlighted ? (
                    <mark
                      key={i}
                      style={{
                        background: "#fde047",
                        color: "#1f2937",
                        borderRadius: 2,
                        padding: "0 2px",
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

          {imageFile && previewUrl && (
            <>
              <h3 style={{ margin: "16px 0 8px", fontSize: 16 }}>Screenshot</h3>
              <img
                src={previewUrl}
                alt="Analyzed screenshot"
                style={{
                  maxWidth: "100%",
                  maxHeight: 320,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              />
            </>
          )}

          <h3 style={{ margin: "16px 0 8px", fontSize: 16 }}>Red flags</h3>
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
                  padding: "6px 12px",
                  borderRadius: 16,
                  border: "1px solid #d1d5db",
                  background: language === lang ? "#3B2A4A" : "#fff",
                  color: language === lang ? "#fff" : "#374151",
                  cursor: "pointer",
                }}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>

          <h3 style={{ margin: "16px 0 8px", fontSize: 16 }}>Explanation</h3>
          <p
            lang={language === "ur" ? "ur" : "en"}
            dir={language === "ur" ? "rtl" : "ltr"}
            style={{ margin: 0, lineHeight: 1.6 }}
          >
            {result[explanationField[language]]}
          </p>

          <h3 style={{ margin: "16px 0 8px", fontSize: 16 }}>What to do next</h3>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {result.recommended_actions.map((action, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {action}
              </li>
            ))}
          </ul>

          {checkId !== null && result.verdict !== "safe" && (
            <AlertPanel checkId={checkId} result={result} />
          )}
        </div>
      )}

      <CircleManager />
    </main>
  );
}
