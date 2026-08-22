import type { Metadata, Viewport } from "next";
import { Fraunces, Noto_Sans, Noto_Sans_Tamil, Noto_Sans_Mono } from "next/font/google";
import "./globals.css";
import OfflineReady from "@/components/OfflineReady";
import TabBar from "@/components/TabBar";

// Display face. Used large and sparingly.
// Italic 500 is used for her quoted speech and for tip callouts, so the italic
// axis has to be loaded, not synthesised.
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// The multilingual requirement dictates the body face. Four scripts, one family.
const notoSans = Noto_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Noto Sans SC is NOT self-hosted via next/font: Google Fonts serves CJK through
// dynamic unicode-range subsetting, and next/font can only declare latin/cyrillic/
// vietnamese for this family — self-hosting it would ship a file with no Chinese
// glyphs at all. It comes from the stylesheet link below, with the platform CJK
// faces behind it in the stack so 中文 still renders with the network off.

const notoSansTamil = Noto_Sans_Tamil({
  variable: "--font-tamil",
  subsets: ["latin", "tamil"],
  display: "swap",
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Heirloom",
  description:
    "Your grandmother's story, in her voice, as something her grandchildren will actually do.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Heirloom" },
  icons: { icon: "/icon-192.png", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#FBF7EE",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- next/font
            cannot self-host this family's CJK ranges; see the note above. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600&display=swap"
        />
      </head>
      <body
        className={`${fraunces.variable} ${notoSans.variable} ${notoSansTamil.variable} ${notoSansMono.variable} antialiased`}
      >
        <OfflineReady />
        {children}
        <TabBar />
      </body>
    </html>
  );
}
