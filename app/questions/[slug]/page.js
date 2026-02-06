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
import QuestionCard from "../../components/QuestionCard";
import QuestionForm from "../../components/QuestionForm";
import { CATEGORIES } from "../../constants/categories";
import { useRouter, useParams } from "next/navigation";

export default function QuestionsPage() {
  const router = useRouter();
  const { slug } = useParams();
  console.log("Slug:", slug);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list");
  const [expandedId, setExpandedId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [page, setPage] = useState(1);
  const [pageProperties, setPageProperties] = useState({
    totalPages: 1,
    currentPage: 1,
    documentCount: 0
  });
 

  // ✅ check admin cookie
  const checkAuth = async () => {
    const res = await fetch("/api/checkauth");
    const data = await res.json();
    setIsAdmin(data.auth);
    fetchQuestions(slug);
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
  const fetchQuestions = async (category = "all", page = 1) => {
    try {
      setLoading(true);

      const url =
        category === "all"
          ? `/api/questions?page=${page}`
          : `/api/questions/category/${category}?page=${page}`;

      const res = await fetch(url);
      const data = await res.json();

      setQuestions(data.items ?? []);
      setPageProperties(data.pageProperties ?? { totalPages: 1, currentPage: 1, documentCount: 0 });
    } catch (err) {
      console.error("Error fetching questions", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchQuestions(slug, page);
  }, [slug, page]);

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
      setFormData({ id: "", question: "", answer: "", category: "react" });
      setView("list");
      fetchQuestions(slug);
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
  const handleEdit = (item) => {
    setView("update");
    setEditQuestion(item);
    setFormData({
      id: item._id,
      question: item.question,
      answer: item.answer,
      category: item.category
    });
  };

  if (loading && questions.length === 0) {
    return (
      <div className="loading-screen">
        <Loader2 className="animate-spin" /> &nbsp; Loading Interview Questions...
      </div>
    );
  }

  const handlePageChange = (type) => {
    if (type == 'next') {
      if (pageProperties.currentPage === pageProperties.totalPages) return;
      setPage(page + 1);
    } else {
      if (pageProperties.currentPage === 1) return;
      setPage(page - 1);
    }
  };
  console.log("from", formData)
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
            <div style={{ display: "flex", gap: "2px", padding: "10px" }}>
              <button
                onClick={() => setView(view === "list" ? "add" : "list")}
                className={`header-toggle ${view === "list"
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
          <QuestionForm
            CATEGORIES={CATEGORIES}
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            isSaving={isSaving}
            setView={setView}
          />)}

        {/* ✅ Update Question (admin only) */}
        {view === "update" && isAdmin &&
          <QuestionForm
            CATEGORIES={CATEGORIES}
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            isSaving={isSaving}
            setView={setView}
          />
        }

        {/* ✅ List View */}
        {view === "list" && (
          <div>
            <div className="stats-bar">
              <div className="stats-inner">
                <div className="stats-count">
                  <BookOpen size={16} /> {questions.length} Questions out of {pageProperties.documentCount}+
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
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="list-wrapper">
              {questions.length === 0 ? (
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
                questions.map((item) => (
                  <QuestionCard
                    key={item._id}
                    item={item}
                    isAdmin={isAdmin}
                    onDelete={isAdmin ? handleDelete : null}
                    onEdit={isAdmin ? handleEdit : null}
                    onExpand={(id) =>
                      setExpandedId(expandedId === id ? null : id)
                    }
                    isExpanded={expandedId === item._id}
                  />
                ))
              )}
            </div>
            <div>
              {
                pageProperties.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange('prev')}
                      className={`pagination-button ${pageProperties.currentPage === 1 ? 'disabled' : 'active'}`}
                      disabled={pageProperties.currentPage === 1}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange('next')}
                      className={`pagination-button ${pageProperties.currentPage === pageProperties.totalPages ? 'disabled' : 'active'}`}
                      disabled={pageProperties.currentPage === pageProperties.totalPages}
                    >
                      Next
                    </button>
                  </div>
                )
              }
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
