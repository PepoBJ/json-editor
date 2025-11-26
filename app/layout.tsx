import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='70' font-size='60' text-anchor='middle' fill='%2310b981' font-family='monospace' font-weight='bold'>{ }</text></svg>" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "JSON Tool",
              "description": "Free online JSON viewer, editor, formatter, and converter",
              "url": "https://json.roberthc.dev",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Robert Huaman Caceres",
                "url": "https://roberthc.dev"
              }
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-mono">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
