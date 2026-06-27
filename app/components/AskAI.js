"use client";

import { useState } from "react";
import { Sparkles, Loader2, Send, Check, AlertCircle, Bot } from "lucide-react";

export default function AskAI({ CATEGORIES, defaultCategory = "general" }) {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState(defaultCategory);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const askAI = async () => {
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setError("");
    setAnswer("");
    setSent(false);
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setAnswer(data.answer);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendToAdmin = async () => {
    if (sending || sent) return;
    setSending(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          answer,
          category,
          source: "ai",
        }),
      });
      if (res.ok) setSent(true);
    } catch {
      // ignore — keep button as-is
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ai-card">
      <div className="ai-head">
        <span className="ai-icon">
          <Bot size={18} />
        </span>
        <div>
          <h3 className="ai-title">Ask AI</h3>
          <p className="ai-sub">
            Can&apos;t find a question? Ask Grok and get an instant answer.
          </p>
        </div>
        <span className="ai-badge">
          <Sparkles size={12} /> Grok
        </span>
      </div>

      <div className="ai-input-row">
        <input
          className="input"
          placeholder="e.g. Explain the difference between debounce and throttle"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askAI()}
        />
        <button className="button button-primary" onClick={askAI} disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          Ask
        </button>
      </div>

      {CATEGORIES && (
        <div className="ai-cats">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`filter-button ${category === c.id ? "active" : ""}`}
              onClick={() => setCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="ai-error">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {answer && (
        <div className="ai-answer">
          <div className="answer-label">AI Answer</div>
          <div className="answer-body" dangerouslySetInnerHTML={{ __html: answer }} />

          <div className="ai-answer-foot">
            <span className="ai-disclaimer">AI-generated — may contain mistakes.</span>
            <button
              className={`button ${sent ? "button-ghost" : "button-primary"}`}
              onClick={sendToAdmin}
              disabled={sending || sent}
            >
              {sent ? (
                <>
                  <Check size={15} /> Sent to admin
                </>
              ) : sending ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Sending…
                </>
              ) : (
                <>
                  <Send size={15} /> Request admin to add this
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
