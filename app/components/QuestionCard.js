"use client";

import { Trash2, ChevronDown } from "lucide-react";
import CategoryBadge from "./CategoryBadge";

export default function QuestionCard({ item, onDelete, onExpand, isExpanded, isAdmin }) {
  const created =
    item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Just now";

  return (
    <div className="question-card">
      <div className="question-card-header" onClick={() => onExpand(item._id)}>
        <div className="flex-1">
          <div className="question-meta">
            <CategoryBadge categoryId={item.category} />
            <span className="question-date">{created}</span>
          </div>
          <h3 className="question-title">{item.question}</h3>
        </div>

        <div className="question-actions">
          {isAdmin && <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item._id);
            }}
            className="icon-button"
          >
            <Trash2 size={18} />
          </button>}

          <ChevronDown
            className={`chevron ${isExpanded ? "expanded" : ""}`}
            size={20}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="answer-panel">
          <div className="answer-label">Answer</div>
          <div className="answer-body">{item.answer}</div>
        </div>
      )}
    </div>
  );
}
