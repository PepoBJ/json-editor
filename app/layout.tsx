import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JSON | roberthc",
  description: "JSON Viewer, Editor, and Converter",
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
      </body>
    </html>
  );
}
