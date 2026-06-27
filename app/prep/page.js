"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Clock,
  CalendarClock,
  Target,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  BookMarked,
  Route,
  FileText,
  Briefcase,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

function priClass(p = "") {
  const v = p.toLowerCase();
  if (v.startsWith("high")) return "pri-high";
  if (v.startsWith("med")) return "pri-med";
  return "pri-low";
}

export default function PrepPage() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("prepResult");
      if (raw) setData(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, []);

  // Reveal-on-scroll — runs AFTER the plan content has rendered.
  useEffect(() => {
    if (!data?.plan) return;
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data]);

  const Header = (
    <header className="app-header">
      <div className="app-header-inner">
        <Link href="/" className="app-title" style={{ textDecoration: "none" }}>
          <span className="brand-mark">
            <Sparkles size={18} />
          </span>
          <h1>
            <span className="accent">Interview</span>WithJangir
          </h1>
        </Link>
        <div className="header-actions">
          <ThemeToggle />
          <Link href="/questions/all" className="header-toggle header-toggle-primary">
            Browse <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );

  if (!loaded) return <div className="loading-screen">Loading…</div>;

  if (!data?.plan) {
    return (
      <div className="landing">
        {Header}
        <main className="app-main">
          <div className="empty-state" style={{ marginTop: 40 }}>
            <div className="empty-icon-wrap">
              <FileText size={26} />
            </div>
            <div className="empty-title">No prep plan yet</div>
            <div className="empty-text">
              Upload your CV on the home page to generate a personalised plan.
            </div>
            <Link
              href="/"
              className="button button-primary"
              style={{ marginTop: 16, display: "inline-flex" }}
            >
              <ArrowLeft size={16} /> Go to home
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const p = data.plan;
  const list = (x) => (Array.isArray(x) ? x : []);

  return (
    <div className="landing">
      {Header}

      <main className="app-main" style={{ maxWidth: 920 }}>
        <Link href="/" className="prep-back">
          <ArrowLeft size={15} /> Analyse another CV
        </Link>

        {/* Summary hero */}
        <section className="prep-hero reveal">
          <span className="lp-badge" style={{ marginBottom: 14 }}>
            <Sparkles size={13} /> Your personalised plan
          </span>
          <h1 className="prep-h1">
            {p.name ? `${p.name}, here's your roadmap` : "Your interview prep roadmap"}
          </h1>
          {p.summary && <p className="prep-summary">{p.summary}</p>}

          <div className="prep-quick">
            {p.experienceLevel && (
              <span className="prep-chip">
                <Briefcase size={14} /> {p.experienceLevel}
              </span>
            )}
            {p.estimatedTime && (
              <span className="prep-chip">
                <CalendarClock size={14} /> {p.estimatedTime}
              </span>
            )}
            {p.weeklyHours && (
              <span className="prep-chip">
                <Clock size={14} /> {p.weeklyHours}
              </span>
            )}
          </div>

          {list(p.targetRoles).length > 0 && (
            <div className="prep-roles">
              <span className="prep-roles-label">Target roles:</span>
              {list(p.targetRoles).map((r) => (
                <span key={r} className="role-tag">
                  {r}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Detected skills */}
        {list(p.detectedSkills).length > 0 && (
          <section className="prep-section reveal">
            <h2 className="prep-sec-title">
              <Sparkles size={18} /> Skills detected
            </h2>
            <div className="skill-cloud">
              {list(p.detectedSkills).map((s) => (
                <span key={s} className="skill-chip">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Strengths + Gaps */}
        {(list(p.strengths).length > 0 || list(p.gaps).length > 0) && (
          <section className="prep-section reveal">
            <div className="prep-two-col">
              {list(p.strengths).length > 0 && (
                <div className="prep-box good">
                  <h3>
                    <TrendingUp size={17} /> Strengths
                  </h3>
                  <ul>
                    {list(p.strengths).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {list(p.gaps).length > 0 && (
                <div className="prep-box warn">
                  <h3>
                    <AlertTriangle size={17} /> Gaps to close
                  </h3>
                  <ul>
                    {list(p.gaps).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Focus areas */}
        {list(p.focusAreas).length > 0 && (
          <section className="prep-section reveal">
            <h2 className="prep-sec-title">
              <Target size={18} /> What to focus on
            </h2>
            <div className="focus-grid">
              {list(p.focusAreas).map((f, i) => (
                <div className="focus-card" key={i}>
                  <div className="focus-top">
                    <span className="focus-area">{f.area}</span>
                    <span className={`pri-badge ${priClass(f.priority)}`}>
                      {f.priority}
                    </span>
                  </div>
                  {f.why && <p className="focus-why">{f.why}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Roadmap timeline */}
        {list(p.roadmap).length > 0 && (
          <section className="prep-section reveal">
            <h2 className="prep-sec-title">
              <Route size={18} /> Your roadmap
            </h2>
            <div className="timeline">
              {list(p.roadmap).map((phase, i) => (
                <div className="tl-item" key={i}>
                  <div className="tl-dot">{i + 1}</div>
                  <div className="tl-body">
                    <div className="tl-head">
                      <h3>{phase.phase}</h3>
                      {phase.duration && (
                        <span className="tl-dur">
                          <Clock size={13} /> {phase.duration}
                        </span>
                      )}
                    </div>
                    {phase.goal && <p className="tl-goal">{phase.goal}</p>}
                    {list(phase.topics).length > 0 && (
                      <div className="tl-topics">
                        {list(phase.topics).map((t, j) => (
                          <span key={j} className="tl-topic">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tips */}
        {list(p.tips).length > 0 && (
          <section className="prep-section reveal">
            <h2 className="prep-sec-title">
              <Lightbulb size={18} /> Interview tips
            </h2>
            <ul className="tips-list">
              {list(p.tips).map((t, i) => (
                <li key={i}>
                  <Lightbulb size={15} /> <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Resources */}
        {list(p.resources).length > 0 && (
          <section className="prep-section reveal">
            <h2 className="prep-sec-title">
              <BookMarked size={18} /> Recommended resources
            </h2>
            <div className="res-grid">
              {list(p.resources).map((r, i) => (
                <div className="res-card" key={i}>
                  <span className="res-type">{r.type}</span>
                  <span className="res-title">{r.title}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="lp-cta-band reveal" style={{ margin: "10px auto 60px" }}>
          <h2>Start practicing now</h2>
          <p>Put your plan into action with 500+ real interview questions.</p>
          <Link href="/questions/all" className="lp-btn lp-btn-white">
            Browse questions <ArrowRight size={17} />
          </Link>
        </section>
      </main>
    </div>
  );
}
