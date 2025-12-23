import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RegimeGuard | AI-Driven Risk-Adaptive Trading Engine",
  description: "An explainable AI-powered trading system for WEEX that prioritizes capital protection and risk-adjusted performance. AI controls risk, not greed.",
  keywords: [
    "AI trading",
    "risk management",
    "WEEX",
    "algorithmic trading",
    "regime classification",
    "crypto trading",
    "automated trading",
    "risk-adaptive",
    "trading bot",
  ],
  authors: [{ name: "RegimeGuard Team" }],
  creator: "RegimeGuard Team",
  publisher: "RegimeGuard",
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://regimeguard.com",
    title: "RegimeGuard | AI-Driven Risk-Adaptive Trading Engine",
    description:
      "AI controls risk, not greed. Explainable AI trading system for WEEX that prioritizes capital protection.",
    siteName: "RegimeGuard",
    images: [
      {
        url: "/banner.jpeg",
        width: 1200,
        height: 400,
        alt: "RegimeGuard - AI-Driven Risk-Adaptive Trading Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RegimeGuard | AI-Driven Risk-Adaptive Trading Engine",
    description:
      "AI controls risk, not greed. Explainable AI trading system for WEEX.",
    images: ["/banner.jpeg"],
    creator: "@regimeguard",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
