import { Youtube, Instagram, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h2 className="footer-title">
            <span className="accent">Interview</span>WithJangir
          </h2>
          <p className="footer-tagline">
            Your personal tech interview question bank — curated answers to help
            you prepare with confidence.
          </p>
        </div>

        <div className="footer-links">
          <a
            href="https://youtube.com/@codewithjangir"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Youtube size={15} /> CodeWithJangir on YouTube
          </a>
          <a
            href="https://instagram.com/codewithjangir"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={15} /> CodeWithJangir on Instagram
          </a>
          <a
            href="https://www.codewithjangir.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe size={15} /> codewithjangir.com
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} InterviewWithJangir · Powered by CodeWithJangir
      </div>
    </footer>
  );
}
