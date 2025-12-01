import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "next-themes";
import { structuredData } from "./metadata";
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
  title: "JSON | roberthc",
  description: "Free online JSON viewer, editor, formatter, and converter. Format, validate, compare JSON. Convert to YAML, XML, CSV, Spark. 100% local processing.",
  keywords: ["json", "json viewer", "json editor", "json formatter", "json validator", "json to yaml", "json to xml", "json compare", "json diff"],
  authors: [{ name: "Robert Huaman Caceres", url: "https://roberthc.dev" }],
  creator: "Robert Huaman Caceres",
  publisher: "Robert Huaman Caceres",
  metadataBase: new URL("https://json.roberthc.dev"),
  alternates: {
    canonical: "https://json.roberthc.dev",
  },
  openGraph: {
    title: "JSON Tool - Free JSON Viewer & Editor",
    description: "Free online JSON viewer, editor, formatter, and converter. Format, validate, compare JSON. Convert to YAML, XML, CSV, Spark.",
    url: "https://json.roberthc.dev",
    siteName: "JSON Tool",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JSON Tool - Free JSON Viewer & Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JSON Tool - Free JSON Viewer & Editor",
    description: "Free online JSON viewer, editor, formatter, and converter",
    creator: "@roberthc",
    images: ["/og-image.png"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="aGAIkbibWPNVkByUuWU0XuHrP0eKce_F29GOsJuSWFc" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
