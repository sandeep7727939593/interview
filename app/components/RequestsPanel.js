"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X, Trash2, Inbox, Sparkles, User } from "lucide-react";

export default function RequestsPanel({ onApproved }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (id, action) => {
    setBusyId(id);
    try {
      await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (action === "approve") onApproved?.();
      await load();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id) => {
    setBusyId(id);
    try {
      await fetch(`/api/requests/${id}`, { method: "DELETE" });
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader2 className="animate-spin" size={18} /> &nbsp; Loading requests…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrap">
          <Inbox size={26} />
        </div>
        <div className="empty-title">No requests yet</div>
        <div className="empty-text">User-submitted question requests will show up here.</div>
      </div>
    );
  }

  return (
    <div className="list-wrapper">
      {items.map((it) => (
        <div key={it._id} className={`req-card status-${it.status}`}>
          <div className="req-top">
            <span className={`req-source ${it.source}`}>
              {it.source === "ai" ? <Sparkles size={12} /> : <User size={12} />}
              {it.source === "ai" ? "AI" : "User"}
            </span>
            <span className="category-badge">{it.category}</span>
            <span className={`req-status req-${it.status}`}>{it.status}</span>
          </div>

          <h3 className="req-question">{it.question}</h3>

          {it.answer && (
            <details className="req-answer">
              <summary>View answer</summary>
              <div className="answer-body" dangerouslySetInnerHTML={{ __html: it.answer }} />
            </details>
          )}

          {it.status === "pending" && (
            <div className="req-actions">
              <button
                className="button button-primary"
                onClick={() => act(it._id, "approve")}
                disabled={busyId === it._id || !it.answer}
                title={!it.answer ? "No answer to approve" : "Add to question bank"}
              >
                {busyId === it._id ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                Approve
              </button>
              <button
                className="button button-ghost"
                onClick={() => act(it._id, "reject")}
                disabled={busyId === it._id}
              >
                <X size={15} /> Reject
              </button>
              <button
                className="icon-button danger"
                onClick={() => remove(it._id)}
                disabled={busyId === it._id}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}

          {it.status !== "pending" && (
            <div className="req-actions">
              <button
                className="icon-button danger"
                onClick={() => remove(it._id)}
                disabled={busyId === it._id}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
