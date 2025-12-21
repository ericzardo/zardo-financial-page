import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";

import { AppProvider } from "@/providers";

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
  themeColor: '#300075',
};

export const metadata: Metadata = {
  title: "finza.",
  description:
    "Assuma o controle total das suas finanças pessoais e empresariais. Organize contas em workspaces, planeje com caixinhas e alcance sua liberdade financeira com o Finza.",
  applicationName: "finza.",
  keywords: [
    "finanças pessoais",
    "gestão financeira",
    "controle de gastos",
    "controle financeiro",
    "investimentos",
    "organização financeira",
    "workspaces",
    "caixinhas",
    "fintech brasil",
    "zardo.dev"
  ],
  authors: [{ name: "zardo", url: "https://zardo.dev" }],
  creator: "zardo.dev",
  publisher: "zardo.dev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "finza.",
    description:
      "Gestão financeira simplificada e poderosa. Múltiplos workspaces, caixinhas de propósito e privacidade total.",
    url: "https://finza.zardo.dev",
    siteName: "finza.",
    images: [
      {
        url: "https://zardo.dev/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "zardo",
      },
    ],
    locale: "pt_BR",
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
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
