"use client";

import { useEffect, useState } from "react";
import {
  Bot,
  BookOpen,
  Plus,
  Search,
  Loader2,
  Save,
  Lock,
  LogOut
} from "lucide-react";
import QuestionCard from "./../components/QuestionCard";
import { CATEGORIES } from "./../constants/categories";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [expandedId, setExpandedId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  // ✅ check admin cookie
  const checkAuth = async () => {
    const res = await fetch("/api/checkauth");
    const data = await res.json();
    setIsAdmin(data.auth);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // ✅ login
  const login = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwordInput })
    });

    if (res.ok) {
      setPasswordInput("");
      checkAuth();
    } else {
      alert("Wrong password");
    }
  };

  // ✅ logout
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    checkAuth();
  };

  // ✅ form data
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "react"
  });

  // ✅ fetch questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("Error fetching questions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  // ✅ add question
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) return;

    setIsSaving(true);
    try {
      await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setFormData({ question: "", answer: "", category: "react" });
      setView("list");
      fetchQuestions();
    } catch (err) {
      console.error("Error saving question", err);
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ delete question
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/questions/${id}`, {
        method: "DELETE"
      });
      fetchQuestions();
    } catch (err) {
      console.error("Error deleting question", err);
    }
  };

  const filteredQuestions =
    filterCategory === "all"
      ? questions
      : questions.filter((q) => q.category === filterCategory);

  if (loading && questions.length === 0) {
    return (
      <div className="loading-screen">
        <Loader2 className="animate-spin" /> &nbsp; Loading Interview Questions...
      </div>
    );
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-title">
            <Bot size={26} />
            <h1>
              <span className="accent">Interview</span>WithJangir
            </h1>
          </div>

          {/* ✅ Admin controls */}
          {isAdmin ? (
            <div style={{ display: "flex", gap: "2px", padding:"10px" }}>
              <button
                onClick={() => setView(view === "list" ? "add" : "list")}
                className={`header-toggle ${
                  view === "list"
                    ? "header-toggle-primary"
                    : "header-toggle-muted"
                }`}
              >
                {view === "list" ? (
                  <>
                    <Plus size={16} /> Add
                  </>
                ) : (
                  "Cancel"
                )}
              </button>

              <button onClick={logout} className="header-toggle">
                {/* <LogOut size={16} />  */}Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setView("login")}
              className="header-toggle"
            >
              <Lock size={16} /> Login
            </button>
          )}
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
              className="input"
              placeholder="Enter admin password"
            />
            <div className="form-actions" style={{ marginTop: "12px" }}>
              <button onClick={login} className="button button-primary">
                Login
              </button>
              <button
                onClick={() => setView("list")}
                className="button button-ghost"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ✅ Add Question (admin only) */}
        {view === "add" && isAdmin && (
          <div className="card form-card">
            <h2>New Interview Question</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Topic</label>
                <div className="category-grid">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`category-button ${
                        formData.category === cat.id ? "active" : ""
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, category: cat.id })
                      }
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Question</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="input"
                  placeholder="e.g. What is Virtual DOM?"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Answer</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  className="textarea"
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="button button-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Question
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ✅ List View */}
        {view === "list" && (
          <div>
            <div className="stats-bar">
              <div className="stats-inner">
                <div className="stats-count">
                  <BookOpen size={16} /> {questions.length} Questions Saved
                </div>

                <div className="filter-chips">
                  <button
                    onClick={() => setFilterCategory("all")}
                    className={`filter-button ${
                      filterCategory === "all" ? "active" : ""
                    }`}
                  >
                    All
                  </button>

                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFilterCategory(cat.id)}
                      className={`filter-button ${
                        filterCategory === cat.id ? "active" : ""
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="list-wrapper">
              {filteredQuestions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon-wrap">
                    <Search size={30} className="text-indigo-300" />
                  </div>
                  <div className="empty-title">No questions found</div>
                  <div className="empty-text">
                    Add your first interview question!
                  </div>
                </div>
              ) : (
                filteredQuestions.map((item) => (
                  <QuestionCard
                    key={item._id}
                    item={item}
                    isAdmin={isAdmin}
                    onDelete={isAdmin ? handleDelete : null}
                    onExpand={(id) =>
                      setExpandedId(expandedId === id ? null : id)
                    }
                    isExpanded={expandedId === item._id}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
