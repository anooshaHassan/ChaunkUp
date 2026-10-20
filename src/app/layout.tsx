import Header from "@/components/Header";

export const metadata = {
  title: "ChaunkUp",
  description: "Chaunk up. Don't fall for it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: "linear-gradient(180deg, #faf5ff 0%, #fdf2f8 100%)",
          minHeight: "100vh",
          color: "#1f2937",
        }}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
