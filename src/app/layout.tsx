import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Brew & Bean | Premium Artisan Coffee",
  description: "Experience the art of coffee with our handcrafted blends, sourced directly from fair-trade farms and roasted to perfection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}{/* impeccable-live-start */}
<script src="http://localhost:8401/live.js?token=c0cd5096-94f2-47a2-b8cf-63c9d4b519fc"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}