"use client";

import { useEffect, useState } from "react";

type Contact = {
  id: number;
  name: string;
  contact: string;
};

export default function CircleManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchContacts() {
    try {
      const res = await fetch("/api/circle");
      const data = await res.json();
      if (res.ok) {
        setContacts(data.contacts ?? []);
      } else {
        setError(data.error || "Could not load contacts.");
      }
    } catch {
      setError("Could not load contacts.");
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedContact = contact.trim();

    if (trimmedName.length === 0 || trimmedContact.length === 0) {
      setError("Please enter a name and a contact.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/circle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, contact: trimmedContact }),
      });
      const data = await res.json();
      if (res.ok && data.contact) {
        setContacts((prev) => [data.contact, ...prev]);
        setName("");
        setContact("");
      } else {
        setError(data.error || "Could not add contact.");
      }
    } catch {
      setError("Could not add contact.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id: number) {
    setError(null);
    try {
      const res = await fetch(`/api/circle/${id}`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setContacts((prev) => prev.filter((c) => c.id !== id));
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not remove contact.");
      }
    } catch {
      setError("Could not remove contact.");
    }
  }

  return (
    <section style={{ marginTop: 32 }}>
      <h2 style={{ fontSize: 20, marginBottom: 12 }}>My Circle</h2>
      <p style={{ color: "#666", marginBottom: 16 }}>
        Save trusted family contacts to alert them with one tap.
      </p>

      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (e.g. Ammi)"
            maxLength={100}
            style={{ flex: 1, minWidth: 120, padding: 10, fontSize: 16 }}
          />
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="WhatsApp number or email"
            maxLength={255}
            style={{ flex: 2, minWidth: 180, padding: 10, fontSize: 16 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 18px",
              fontSize: 16,
              background: "#3B2A4A",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </form>

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            background: "#fef3c7",
            borderRadius: 8,
            color: "#92400e",
          }}
        >
          {error}
        </div>
      )}

      {contacts.length === 0 ? (
        <p style={{ color: "#666" }}>No contacts saved yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {contacts.map((c) => (
            <li
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                marginBottom: 8,
                background: "#fff",
              }}
            >
              <div>
                <strong style={{ display: "block" }}>{c.name}</strong>
                <span style={{ color: "#666", fontSize: 14 }}>{c.contact}</span>
              </div>
              <button
                onClick={() => handleRemove(c.id)}
                style={{
                  padding: "6px 12px",
                  fontSize: 14,
                  background: "#fff",
                  color: "#dc2626",
                  border: "1px solid #fecaca",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
