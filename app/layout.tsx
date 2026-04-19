import type { Metadata } from "next";
import { Toaster } from "sonner";
import {
  Plus_Jakarta_Sans,
  Playfair_Display,
  Oswald,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";

// next/font for optimized subsets
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SpendSense - Premium Expense Tracker",
  description:
    "SpendSense is a premium dark expense tracker for managing transactions, categories, savings, and cashflow insights in one calm dashboard.",
  keywords:
    "expense tracker, personal finance dashboard, budget planner, finance analytics, cashflow tracker, Next.js expense app, Firebase finance app",
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "SpendSense - Premium Expense Tracker",
    description:
      "Track income, expenses, savings, and category performance in a polished finance dashboard built with Next.js and Firebase.",
    url: "https://evoclabs.com/",
    images: ["https://i.postimg.cc/3wWLDB2q/Instagram-story-16.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendSense - Premium Expense Tracker",
    description:
      "Premium dark expense tracking with live transaction sync, charts, and category insights.",
    images: ["https://i.postimg.cc/3wWLDB2q/Instagram-story-16.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth bg-background">
      <head>
        {/* Exact CDN links from index.md.html (exhaustive list) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,500;1,600;1,700;1,900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
        />

        {/* Global font override styles from index.md.html */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          :root {
            --font-geist: "Geist", sans-serif;
            --font-roboto: "Roboto", sans-serif;
            --font-montserrat: "Montserrat", sans-serif;
            --font-poppins: "Poppins", sans-serif;
            --font-playfair: "Playfair Display", serif;
            --font-instrument-serif: "Instrument Serif", serif;
            --font-merriweather: "Merriweather", serif;
            --font-bricolage: "Bricolage Grotesque", sans-serif;
            --font-jakarta: "Plus Jakarta Sans", sans-serif;
            --font-manrope: "Manrope", sans-serif;
            --font-space-grotesk: "Space Grotesk", sans-serif;
            --font-work-sans: "Work Sans", sans-serif;
            --font-pt-serif: "PT Serif", serif;
            --font-geist-mono: "Geist Mono", monospace;
            --font-space-mono: "Space Mono", monospace;
            --font-quicksand: "Quicksand", sans-serif;
            --font-nunito: "Nunito", sans-serif;
            --font-newsreader: "Newsreader", serif;
            --font-google-sans-flex: "Google Sans Flex", sans-serif;
            --font-oswald: "Oswald", sans-serif;
            --font-dm-sans: "DM Sans", sans-serif;
            --font-cormorant: "Cormorant Garamond", serif;
          }
          
          .font-playfair { font-family: "Playfair Display", serif !important; }
          .font-jakarta { font-family: "Plus Jakarta Sans", sans-serif !important; }
          .font-oswald { font-family: "Oswald", sans-serif !important; }
          .font-newsreader { font-family: "Newsreader", serif !important; }
          .font-instrument-serif { font-family: "Instrument Serif", serif !important; }
          
          body {
            font-family: "Plus Jakarta Sans", sans-serif;
          }
        `,
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${playfairDisplay.variable} ${oswald.variable} ${geistMono.variable} antialiased bg-background text-text-main font-sans selection:bg-white/10 selection:text-white`}
      >
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: { background: "#0f0e13", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" },
          }}
        />
      </body>
    </html>
  );
}
