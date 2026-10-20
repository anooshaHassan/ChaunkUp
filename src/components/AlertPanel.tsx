"use client";

import { useEffect, useState } from "react";
import { buildShareLinks } from "@/lib/share";
import type { AnalysisResult } from "@/lib/schema";

type Contact = {
  id: number;
  name: string;
  contact: string;
};

type Props = {
  checkId: number;
  result: AnalysisResult;
};

export default function AlertPanel({ checkId, result }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [alertText, setAlertText] = useState<string>("");
  const [expanded, setExpanded] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingText, setLoadingText] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchContacts() {
    try {
      const res = await fetch("/api/circle");
      const data = await res.json();
      if (res.ok) {
        setContacts(data.contacts ?? []);
      }
    } catch {
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  async function openPanel() {
    setExpanded(true);
    setError(null);

    await fetchContacts();

    if (alertText) return;

    setLoadingText(true);
    try {
      const res = await fetch(`/api/alert/${checkId}`);
      const data = await res.json();
      if (res.ok && typeof data.text === "string") {
        setAlertText(data.text);
      } else {
        setError(data.error || "Could not build the alert message.");
      }
    } catch {
      setError("Could not build the alert message.");
    } finally {
      setLoadingText(false);
    }
  }

  if (result.verdict === "safe") {
    return null;
  }

  if (loadingContacts) {
    return <p style={{ marginTop: 16, color: "#666" }}>Loading contacts...</p>;
  }

  if (contacts.length === 0) {
    return (
      <p style={{ marginTop: 16, color: "#666" }}>
        Add contacts to My Circle to alert them.
      </p>
    );
  }

  if (!expanded) {
    return (
      <button
        onClick={openPanel}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          fontSize: 16,
          background: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: 12,
          cursor: "pointer",
          fontWeight: 600,
          width: "100%",
        }}
      >
        Alert my Circle
      </button>
    );
  }

  return (
    <div
      style={{
        marginTop: 16,
        padding: 16,
        borderRadius: 8,
        background: "#fef2f2",
        border: "1px solid #fecaca",
      }}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 16 }}>Alert my Circle</h3>

      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: 10,
            background: "#fee2e2",
            borderRadius: 6,
            color: "#991b1b",
          }}
        >
          {error}
        </div>
      )}

      {loadingText ? (
        <p style={{ margin: 0, color: "#666" }}>Building alert message...</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {contacts.map((c) => {
            const share = buildShareLinks(c.contact, alertText || "");
            return (
              <li
                key={c.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #fecaca",
                }}
              >
                <div>
                  <strong style={{ display: "block" }}>{c.name}</strong>
                  <span style={{ color: "#666", fontSize: 14 }}>{c.contact}</span>
                </div>
                <a
                  href={share.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "8px 14px",
                    fontSize: 14,
                    background: "#dc2626",
                    color: "#fff",
                    borderRadius: 4,
                    textDecoration: "none",
                    opacity: alertText ? 1 : 0.5,
                    pointerEvents: alertText ? "auto" : "none",
                  }}
                >
                  {share.label}
                </a>
              </li>
            );
          })}
        </ul>
      )}

      <button
        onClick={() => setExpanded(false)}
        style={{
          marginTop: 12,
          padding: "6px 12px",
          fontSize: 14,
          background: "transparent",
          border: "1px solid #d1d5db",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </div>
  );
}
