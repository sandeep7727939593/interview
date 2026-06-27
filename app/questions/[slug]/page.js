"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  BookOpen,
  Plus,
  Search,
  Loader2,
  Lock,
  X,
  ChevronLeft,
  ChevronRight,
  Bot,
  Inbox,
} from "lucide-react";
import QuestionCard from "../../components/QuestionCard";
import QuestionForm from "../../components/QuestionForm";
import SkeletonCard from "../../components/SkeletonCard";
import ThemeToggle from "../../components/ThemeToggle";
import AskAI from "../../components/AskAI";
import RequestsPanel from "../../components/RequestsPanel";
import { CATEGORIES } from "../../constants/categories";
import { useRouter, useParams } from "next/navigation";

export default function QuestionsPage() {
  const router = useRouter();
  const { slug } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [expandedId, setExpandedId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [search, setSearch] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageProperties, setPageProperties] = useState({
    totalPages: 1,
    currentPage: 1,
    documentCount: 0,
  });

  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "react",
  });

  const activeCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === slug),
    [slug]
  );

  // ✅ check admin cookie
  const checkAuth = async () => {
    try {
      const res = await fetch("/api/checkauth");
      const data = await res.json();
      setIsAdmin(data.auth);
      if (data.auth) loadPendingCount();
    } catch {
      setIsAdmin(false);
    }
  };

  const loadPendingCount = async () => {
    try {
      const res = await fetch("/api/requests");
      if (!res.ok) return;
      const data = await res.json();
      setPendingCount(data.pendingCount ?? 0);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // ✅ login
  const login = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput }),
    });

    if (res.ok) {
      setPasswordInput("");
      await checkAuth();
      setView("list");
    } else {
      alert("Wrong password");
    }
  };

  // ✅ logout
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    checkAuth();
    setView("list");
  };

  // ✅ fetch questions
  const fetchQuestions = async (category = "all", pg = 1) => {
    try {
      setLoading(true);
      const url =
        !category || category === "all"
          ? `/api/questions?page=${pg}`
          : `/api/questions/category/${category}?page=${pg}`;

      const res = await fetch(url);
      const data = await res.json();

      setQuestions(data.items ?? []);
      setPageProperties(
        data.pageProperties ?? { totalPages: 1, currentPage: 1, documentCount: 0 }
      );
    } catch (err) {
      console.error("Error fetching questions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setExpandedId(null);
    fetchQuestions(slug, page);
  }, [slug, page]);

  // reset to page 1 when category changes
  useEffect(() => {
    setPage(1);
  }, [slug]);

  // ✅ add / update question
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) return;

    setIsSaving(true);
    try {
      await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setFormData({ id: "", question: "", answer: "", category: "react" });
      setView("list");
      fetchQuestions(slug, page);
    } catch (err) {
      console.error("Error saving question", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ delete question
  const handleDelete = async (id) => {
    if (!confirm("Delete this question?")) return;
    try {
      await fetch(`/api/questions/${id}`, { method: "DELETE" });
      fetchQuestions(slug, page);
    } catch (err) {
      console.error("Error deleting question", err);
    }
  };

  const handleEdit = (item) => {
    setView("update");
    setFormData({
      id: item._id,
      question: item.question,
      answer: item.answer,
      category: item.category,
    });
  };

  const handlePageChange = (type) => {
    if (type === "next") {
      if (pageProperties.currentPage >= pageProperties.totalPages) return;
      setPage((p) => p + 1);
    } else {
      if (pageProperties.currentPage <= 1) return;
      setPage((p) => p - 1);
    }
  };

  // ✅ client-side search over the loaded page
  const visibleQuestions = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter(
      (item) =>
        item.question?.toLowerCase().includes(q) ||
        item.answer?.toLowerCase().includes(q)
    );
  }, [questions, search]);

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <button
            className="app-title"
            onClick={() => router.push("/questions/all")}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <span className="brand-mark">
              <Sparkles size={18} />
            </span>
            <h1>
              <span className="accent">Interview</span>WithJangir
            </h1>
          </button>

          <div className="header-actions">
            <ThemeToggle />

            {isAdmin ? (
              <>
                <button
                  onClick={() => {
                    setView("requests");
                    loadPendingCount();
                  }}
                  className={`header-toggle ${
                    view === "requests" ? "header-toggle-primary" : "header-toggle-muted"
                  }`}
                >
                  <Inbox size={16} /> Requests
                  {pendingCount > 0 && <span className="req-pill">{pendingCount}</span>}
                </button>
                <button
                  onClick={() => setView(view === "add" ? "list" : "add")}
                  className={`header-toggle ${
                    view === "add" ? "header-toggle-muted" : "header-toggle-primary"
                  }`}
                >
                  {view === "add" ? (
                    "Cancel"
                  ) : (
                    <>
                      <Plus size={16} /> Add
                    </>
                  )}
                </button>
                <button onClick={logout} className="header-toggle header-toggle-muted">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={() => setView("login")} className="header-toggle">
                <Lock size={16} /> Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* ✅ Login View */}
        {view === "login" && !isAdmin && (
          <div className="card form-card">
            <h2>Admin Login</h2>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              className="input"
              placeholder="Enter admin password"
              autoFocus
            />
            <div className="form-actions">
              <button onClick={() => setView("list")} className="button button-ghost">
                Cancel
              </button>
              <button onClick={login} className="button button-primary">
                Login
              </button>
            </div>
          </div>
        )}

        {/* ✅ Add / Update Question (admin only) */}
        {(view === "add" || view === "update") && isAdmin && (
          <QuestionForm
            CATEGORIES={CATEGORIES}
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            isSaving={isSaving}
            setView={setView}
          />
        )}

        {/* ✅ Requests View (admin only) */}
        {view === "requests" && isAdmin && (
          <RequestsPanel
            onApproved={() => {
              loadPendingCount();
              fetchQuestions(slug, page);
            }}
          />
        )}

        {/* ✅ List View */}
        {view === "list" && (
          <>
            <section className="hero">
              <span className="hero-eyebrow">
                <Sparkles size={13} /> Crack your next interview
              </span>
              <h2>
                {activeCategory ? (
                  <>
                    {activeCategory.name}{" "}
                    <span className="grad">Interview Questions</span>
                  </>
                ) : (
                  <>
                    Tech <span className="grad">Interview</span> Question Bank
                  </>
                )}
              </h2>
              <p>
                Hand-picked, real-world questions with clear answers across React,
                Node.js, JavaScript, AI and more — prepare smarter, not harder.
              </p>

              <div className="search-wrap">
                <Search size={18} className="search-icon" />
                <input
                  className="search-input"
                  placeholder="Search questions on this page…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button className="search-clear" onClick={() => setSearch("")}>
                    <X size={15} />
                  </button>
                )}
              </div>

              <button
                className={`ai-trigger ${showAI ? "active" : ""}`}
                onClick={() => setShowAI((v) => !v)}
              >
                <Bot size={16} /> {showAI ? "Hide AI search" : "Ask AI instead"}
              </button>
            </section>

            {showAI && (
              <AskAI
                CATEGORIES={CATEGORIES}
                defaultCategory={activeCategory ? activeCategory.id : CATEGORIES[0].id}
              />
            )}

            <div className="stats-bar">
              <div className="stats-inner">
                <div className="stats-count">
                  <BookOpen size={16} />
                  <span>
                    <b>{pageProperties.documentCount}+</b> questions
                    {activeCategory ? ` in ${activeCategory.name}` : " total"}
                  </span>
                </div>

                <div className="filter-chips">
                  <button
                    onClick={() => router.push("/questions/all")}
                    className={`filter-button ${slug === "all" ? "active" : ""}`}
                  >
                    All
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => router.push(`/questions/${cat.id}`)}
                      className={`filter-button ${slug === cat.id ? "active" : ""}`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="list-wrapper">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              ) : visibleQuestions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon-wrap">
                    <Search size={28} />
                  </div>
                  <div className="empty-title">
                    {search ? "No matches found" : "No questions yet"}
                  </div>
                  <div className="empty-text">
                    {search
                      ? "Try a different keyword or clear the search."
                      : "Questions for this topic will appear here soon."}
                  </div>
                </div>
              ) : (
                visibleQuestions.map((item) => (
                  <QuestionCard
                    key={item._id}
                    item={item}
                    isAdmin={isAdmin}
                    onDelete={isAdmin ? handleDelete : null}
                    onEdit={isAdmin ? handleEdit : null}
                    onExpand={(id) => setExpandedId(expandedId === id ? null : id)}
                    isExpanded={expandedId === item._id}
                  />
                ))
              )}
            </div>

            {!loading && pageProperties.totalPages > 1 && !search && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange("prev")}
                  className={`pagination-button ${
                    pageProperties.currentPage === 1 ? "disabled" : "active"
                  }`}
                  disabled={pageProperties.currentPage === 1}
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <span className="pagination-info">
                  Page {pageProperties.currentPage} of {pageProperties.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange("next")}
                  className={`pagination-button ${
                    pageProperties.currentPage === pageProperties.totalPages
                      ? "disabled"
                      : "active"
                  }`}
                  disabled={pageProperties.currentPage === pageProperties.totalPages}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
