"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  Code,
  Database,
  Cpu,
  Target,
  Zap,
  Search,
  CheckCircle2,
  Rocket,
  ChevronDown,
} from "lucide-react";
import ThemeToggle from "./components/ThemeToggle";
import CvAnalyzer from "./components/CvAnalyzer";

const ROTATING = ["React", "Node.js", "JavaScript", "TypeScript", "AI / ML", "AWS"];
const TECH_TAGS = [
  "React", "Node.js", "JavaScript", "TypeScript", "Python",
  "Next.js", "NestJS", "AI / ML", "AWS", "GraphQL", "MongoDB", "REST APIs", "System Design",
];
const STEPS = [
  { title: "Pick a topic", text: "Choose from 9 focused tracks — frontend, backend, cloud or AI." },
  { title: "Read & revise", text: "Concise, code-backed answers you can absorb in minutes." },
  { title: "Ace the interview", text: "Walk in prepared and answer with real confidence." },
];
const FAQS = [
  { q: "Is it really free?", a: "Yes — 100% free and open. No paywalls, no hidden tiers. Just open it and start revising." },
  { q: "Do I need to sign up or log in?", a: "No account needed to browse. Login exists only for the admin to add or edit questions." },
  { q: "Which topics are covered?", a: "React, JavaScript, Node.js, NestJS, TypeScript, Python, Next.js, AI/ML and AWS — 500+ questions in total." },
  { q: "Does it work on mobile?", a: "Absolutely. The whole site is fully responsive and works great on phones, tablets and desktops." },
];

// Cycles a word in the headline with a flip-in animation
function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % ROTATING.length), 2200);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="rotator">
      <span className="rotator-word" key={i}>
        {ROTATING[i]}
      </span>
    </span>
  );
}

// One FAQ row
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <button className="faq-q" onClick={() => setOpen((o) => !o)}>
        {q}
        <ChevronDown className="chev" size={20} />
      </button>
      <div className="faq-a-wrap">
        <div className="faq-a-inner">
          <p className="faq-a">{a}</p>
        </div>
      </div>
    </div>
  );
}

type Cat = {
  id: string;
  name: string;
  desc: string;
  count: number;
  Icon: React.ComponentType<{ size?: number }>;
};

const CATS: Cat[] = [
  { id: "react", name: "React", desc: "Components, hooks, rendering & performance.", count: 60, Icon: Code },
  { id: "javascript", name: "JavaScript", desc: "Closures, async, prototypes & the event loop.", count: 60, Icon: Code },
  { id: "nodejs", name: "Node.js", desc: "Streams, the event loop, APIs & scaling.", count: 60, Icon: Database },
  { id: "nestjs", name: "NestJS", desc: "Modules, DI, guards & microservices.", count: 60, Icon: Layers },
  { id: "typescript", name: "TypeScript", desc: "Types, generics & utility types.", count: 55, Icon: Code },
  { id: "python", name: "Python", desc: "OOP, generators, async & the GIL.", count: 55, Icon: Code },
  { id: "nextjs", name: "Next.js", desc: "App Router, SSR/SSG & server actions.", count: 50, Icon: Rocket },
  { id: "ai", name: "AI / ML", desc: "ML, LLMs, RAG & transformers.", count: 50, Icon: Cpu },
  { id: "aws", name: "AWS", desc: "EC2, S3, Lambda, IAM & VPC.", count: 50, Icon: Cpu },
];

const FEATURES = [
  {
    Icon: Target,
    title: "Curated, not random",
    text: "Every question is hand-picked from real interviews with a clear, concise answer — no fluff, no filler.",
  },
  {
    Icon: Search,
    title: "Find answers fast",
    text: "Filter by topic and search instantly. Jump straight to the concept you need to revise before the interview.",
  },
  {
    Icon: Zap,
    title: "Learn by topic",
    text: "9 focused tracks across frontend, backend, cloud and AI so you can prep depth-first or breadth-first.",
  },
  {
    Icon: CheckCircle2,
    title: "Answers that stick",
    text: "Short explanations with code examples designed to be re-read in minutes and remembered in interviews.",
  },
];

// Animated count-up number
function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const duration = 1100;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(end * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end]);

  return (
    <div className="num" ref={ref}>
      {val}
      {suffix}
    </div>
  );
}

export default function HomePage() {
  // Scroll reveal for sections
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="landing">
      {/* Header */}
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

      {/* Hero */}
      <section className="lp-hero">
        <span className="lp-grid-bg" />
        <span className="lp-orb o1" />
        <span className="lp-orb o2" />
        <span className="lp-orb o3" />

        <div className="lp-hero-inner">
          <span className="lp-badge">
            <span className="dot" /> 500+ real interview questions
          </span>
          <h1>
            Crack your next <br />
            <RotatingWord /> <span style={{ whiteSpace: "nowrap" }}>interview</span>
          </h1>
          <p className="lp-sub">
            A curated question bank with clear, code-backed answers across React,
            Node.js, JavaScript, TypeScript, AI and more. Prepare smarter — not harder.
          </p>

          <div className="lp-cta">
            <Link href="/questions/all" className="lp-btn lp-btn-primary">
              <BookOpen size={18} /> Start practicing
            </Link>
            <Link href="/questions/react" className="lp-btn lp-btn-ghost">
              Explore React Q&amp;A <ArrowRight size={16} />
            </Link>
          </div>

          <div className="lp-stats">
            <div className="lp-stat">
              <CountUp end={500} suffix="+" />
              <div className="lbl">Questions</div>
            </div>
            <div className="lp-stat">
              <CountUp end={9} />
              <div className="lbl">Topics</div>
            </div>
            <div className="lp-stat">
              <CountUp end={100} suffix="%" />
              <div className="lbl">Free &amp; open</div>
            </div>
          </div>
        </div>
      </section>

      {/* Widget: infinite tech marquee */}
      <div className="lp-marquee" aria-hidden="true">
        <div className="lp-marquee-track">
          {[...TECH_TAGS, ...TECH_TAGS].map((tag, idx) => (
            <span className="lp-tag" key={idx}>
              <span className="d" /> {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Widget: AI CV analyzer */}
      <section className="lp-section">
        <div className="lp-section-head reveal">
          <span className="eyebrow">AI-powered</span>
          <h2>Get a prep plan from your CV</h2>
          <p>
            Upload your resume and let AI map out exactly what to study, in what order,
            and how long it&apos;ll take — tailored to your experience.
          </p>
        </div>
        <div className="reveal" style={{ maxWidth: 680, margin: "0 auto" }}>
          <CvAnalyzer />
        </div>
      </section>

      {/* Category widgets */}
      <section className="lp-section">
        <div className="lp-section-head reveal">
          <span className="eyebrow">Pick a track</span>
          <h2>Browse by topic</h2>
          <p>Nine focused tracks across frontend, backend, cloud and AI. Tap a card to dive into its questions.</p>
        </div>

        <div className="lp-grid reveal">
          {CATS.map(({ id, name, desc, count, Icon }) => (
            <Link key={id} href={`/questions/${id}`} className="lp-cat-card">
              <div className="lp-cat-top">
                <span className="lp-cat-icon">
                  <Icon size={22} />
                </span>
                <span className="lp-cat-count">{count} Qs</span>
              </div>
              <h3 className="lp-cat-name">{name}</h3>
              <p className="lp-cat-desc">{desc}</p>
              <span className="lp-cat-go">
                Start <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Vision / how it helps */}
      <section className="lp-section">
        <div className="lp-section-head reveal">
          <span className="eyebrow">The vision</span>
          <h2>How this helps you</h2>
          <p>
            Interview prep is noisy. This question bank exists to give you one calm,
            reliable place to revise — built to turn scattered studying into confident answers.
          </p>
        </div>

        <div className="lp-features reveal">
          {FEATURES.map(({ Icon, title, text }) => (
            <div key={title} className="lp-feature">
              <div className="lp-feature-icon">
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Widget: how it works */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-section-head reveal">
          <span className="eyebrow">Simple by design</span>
          <h2>How it works</h2>
          <p>Three steps between you and a confident interview.</p>
        </div>
        <div className="lp-steps reveal">
          {STEPS.map((s, i) => (
            <div className="lp-step" key={s.title}>
              <div className="lp-step-num">{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Widget: FAQ */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-section-head reveal">
          <span className="eyebrow">Good to know</span>
          <h2>Frequently asked</h2>
          <p>Quick answers to the things people ask most.</p>
        </div>
        <div className="lp-faq reveal">
          {FAQS.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-cta-band reveal">
          <h2>Ready to ace it?</h2>
          <p>Jump into 500+ questions and start closing your knowledge gaps today.</p>
          <Link href="/questions/all" className="lp-btn lp-btn-white">
            <Rocket size={18} /> Browse all questions
          </Link>
        </div>
      </section>
    </div>
  );
}
