"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import ResultCard from "@/components/ResultCard";
import CircleManager from "@/components/CircleManager";
import type { AnalysisResult } from "@/lib/schema";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export default function Home() {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [checkId, setCheckId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
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
      setError("Image must be smaller than 5 MB.");
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

  const hasInput = text.trim().length > 0 || imageFile !== null;

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
        <p style={{ margin: 0, color: "#6b21a8", fontWeight: 500 }}>
          Paste a suspicious message or upload a screenshot to check it.
        </p>
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
          History →
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the message here, or upload a screenshot below..."
          rows={6}
          style={{
            width: "100%",
            padding: 14,
            fontSize: 16,
            boxSizing: "border-box",
            borderRadius: 12,
            border: "1px solid #e9d5ff",
            background: "#fff",
            resize: "vertical",
          }}
        />

        <div style={{ marginTop: 16 }}>
          <label
            htmlFor="image"
            style={{
              display: "inline-block",
              padding: "10px 16px",
              border: "1px solid #d8b4fe",
              borderRadius: 10,
              cursor: "pointer",
              background: "#fff",
              color: "#7c3aed",
              fontWeight: 500,
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
                border: "1px solid #d8b4fe",
                borderRadius: 10,
                background: "#fff",
                cursor: "pointer",
                color: "#7c3aed",
              }}
            >
              Remove
            </button>
          )}

          <p style={{ margin: "10px 0 0", fontSize: 13, color: "#7c3aed" }}>
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
                  borderRadius: 12,
                  border: "1px solid #e9d5ff",
                }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !hasInput}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "14px 24px",
            fontSize: 17,
            background: "#3B2A4A",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            cursor: loading || !hasInput ? "not-allowed" : "pointer",
            opacity: loading || !hasInput ? 0.7 : 1,
            fontWeight: 600,
          }}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            background: "#fef3c7",
            borderRadius: 12,
            color: "#92400e",
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 28 }}>
          <ResultCard
            result={result}
            originalText={!imageFile ? text : undefined}
            imageUrl={imageFile ? previewUrl : null}
            checkId={checkId}
          />
        </div>
      )}

      <CircleManager />
    </main>
  );
}
