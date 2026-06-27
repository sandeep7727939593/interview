import "./globals.css";
import Footer from "./components/Footer";
import type { ReactNode } from "react";

export const metadata = {
  title: "InterviewWithJangir — Tech Interview Question Bank",
  description:
    "Curated tech interview questions and clear answers across React, Node.js, JavaScript, TypeScript, AI, AWS and more. Prepare smarter and crack your next interview with confidence.",
  keywords: [
    "interview questions",
    "react interview",
    "javascript interview",
    "node.js interview",
    "frontend interview prep",
  ],
  authors: [{ name: "Jangir" }],
  openGraph: {
    title: "InterviewWithJangir — Tech Interview Question Bank",
    description:
      "Curated tech interview questions with clear answers. Prepare smarter, not harder.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#ED1703",
};

// Apply saved theme before paint to avoid a flash of the wrong theme.
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
`;

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
