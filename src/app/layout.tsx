import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";

import { Toaster } from 'react-hot-toast';
import { SmoothScroll } from "@/providers/SmoothScroll";

import { Favicon, AppleTouchIcon, Logo192, Logo32, Logo512 } from "@zardo/ui-kit/logos"
import "./globals.css";
import "@zardo/ui-kit/styles.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: "zardo",
  description:
    "zardo turns ideas into cutting-edge digital solutions. We create unique experiences with top-tier technology.",
  keywords: [
    "zardo",
    "technology",
    "innovation",
    "web development",
    "digital solutions",
    "zardo",
    "AI agents",
    "AI automation",
    "machine learning",
    "artificial intelligence",
  ],
  authors: [{ name: "zardo", url: "https://zardo.dev" }],
  creator: "zardo",
  publisher: "zardo",
  openGraph: {
    title: "zardo",
    description:
      "zardo turns ideas into cutting-edge digital solutions. We create unique experiences with top-tier technology.",
    url: "https://zardo.dev",
    siteName: "zardo",
    images: [
      {
        url: "https://zardo.dev/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "zardo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: [
      { url: Favicon, sizes: 'any' },
      { url: Logo32, type: 'image/png', sizes: '32x32' },
      { url: Logo192, type: 'image/png', sizes: '192x192' },
      { url: Logo512, type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: AppleTouchIcon, sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [Favicon],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        className={`${poppins.variable} antialiased`}
      >
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <Toaster />
      </body>
    </html>
  );
}
