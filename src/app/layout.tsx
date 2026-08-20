import type { Metadata } from "next";
import "../styles/index.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kintsu.vercel.app"),
  title: "KINTSU | Instructor-Led Rehabilitation Platform for Prisons & NGOs",
  description: "An instructor-led teaching, presentation, and case management platform for group rehabilitation sessions inside correctional facilities. Features structured modules, roleplay scenarios, story libraries, and confidential case analytics.",
  keywords: [
    "Prison Rehabilitation",
    "Correctional Education",
    "Group Therapy Presentation",
    "Counselor Suite",
    "NGO Reintegration",
    "Kintsu Platform"
  ],
  authors: [{ name: "KINTSU Rehabilitation Platform" }],
  icons: {
    icon: "/kintsu-logo.png",
    shortcut: "/kintsu-logo.png",
    apple: "/kintsu-logo.png",
  },
  openGraph: {
    title: "KINTSU | Instructor-Led Rehabilitation Platform for Prisons & NGOs",
    description: "Empower counselors and officers to lead impactful group rehabilitation sessions without requiring individual inmate devices.",
    url: "https://kintsu.vercel.app",
    siteName: "KINTSU Rehabilitation Platform",
    images: [
      {
        url: "/kintsu-logo.png",
        width: 1200,
        height: 630,
        alt: "KINTSU Rehabilitation Platform Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KINTSU | Instructor-Led Rehabilitation Platform",
    description: "Classroom presentation system for group rehabilitation sessions inside correctional facilities.",
    images: ["/kintsu-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/kintsu-logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/kintsu-logo.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
