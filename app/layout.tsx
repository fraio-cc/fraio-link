import type { Metadata } from "next";
import "./globals.css";
import '../lib/config';
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Fraio Link - Free URL Shortener",
  description: "Shorten, share, and track your links with Fraio Link. Free, fast, and secure URL shortening service.",
  keywords: ["url shortener", "link shortener", "short url", "qr code", "link analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-stone-950 text-stone-200">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-amber-600 selection:text-stone-950">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
