import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  title: "Kintsu Design System",
  description: "Code bundle for Kintsu Design System built with Next.js App Router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
