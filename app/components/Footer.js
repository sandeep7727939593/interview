export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-inner">
                <div className="app-title">
                    <h1>
                        <span className="accent">Interview</span>WithJangir
                    </h1>

                </div>
                <p className="footer-tagline">
                    Your personal tech interview question bank.
                </p>
                <div className="footer-links">
                    <a
                        href="https://youtube.com/@codewithjangir"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        CodeWithJangir YouTube
                    </a>

                    <a
                        href="https://instagram.com/codewithjangir"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        CodeWithJangir Instagram
                    </a>

                    <a
                        href="https://www.codewithjangir.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        CodeWithJangir Website
                    </a>
                </div>

            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} InterviewWithJangir · Powered by CodeWithJangir
            </div>
        </footer>
    );
}
