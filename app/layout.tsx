import "./globals.css";
import Footer from './components/Footer';
import type { ReactNode } from "react";
export const metadata = {
  title: "InterviewWithJangir",
  description: "Crack Your Interview with Confidence"
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children  }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
        </body>
    </html>
  );
}
