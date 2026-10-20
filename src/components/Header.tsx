"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        background: "linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)",
        borderBottom: "1px solid #e9d5ff",
        padding: "16px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#3B2A4A",
            fontWeight: 800,
            fontSize: "1.35rem",
            letterSpacing: "-0.02em",
          }}
        >
          ChaunkUp
        </Link>
        <span
          style={{
            color: "#7c3aed",
            fontSize: "0.9rem",
            fontWeight: 500,
            textAlign: "right",
          }}
        >
          Chaunk up. Don&apos;t fall for it.
        </span>
      </div>
    </header>
  );
}
