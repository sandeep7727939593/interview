"use client";

import { useState } from "react";
import { Trash2, Pencil, ChevronDown, Copy, Check } from "lucide-react";
import CategoryBadge from "./CategoryBadge";

export default function QuestionCard({
  item,
  onDelete,
  onEdit,
  onExpand,
  isExpanded,
  isAdmin,
}) {
  const [copied, setCopied] = useState(false);

  const created = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "New";

  const handleCopy = (e) => {
    e.stopPropagation();
    const tmp = document.createElement("div");
    tmp.innerHTML = item.answer || "";
    const text = tmp.textContent || tmp.innerText || "";
    navigator.clipboard?.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`question-card ${isExpanded ? "expanded" : ""}`}
      onClick={() => onExpand(item._id)}
    >
      <div className="question-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="question-meta">
            <CategoryBadge categoryId={item.category} />
            <span className="question-date">{created}</span>
          </div>

          <div className="question-title-row">
            <h3 className="question-title">{item.question}</h3>

            <div className="question-card-actions">
              {isAdmin && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(item);
                    }}
                    className="icon-button"
                    aria-label="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item._id);
                    }}
                    className="icon-button danger"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              )}
              <ChevronDown
                className={`chevron ${isExpanded ? "expanded" : ""}`}
                size={20}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`answer-panel ${isExpanded ? "open" : ""}`}>
        <div className="answer-inner">
          <div className="answer-head">
            <span className="answer-label">Answer</span>
            <button
              className={`copy-button ${copied ? "copied" : ""}`}
              onClick={handleCopy}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div
            className="answer-body"
            dangerouslySetInnerHTML={{ __html: item.answer }}
          />
        </div>
      </div>
    </div>
  );
}
