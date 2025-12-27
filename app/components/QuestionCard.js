"use client";

import { Trash2, Pencil, ChevronDown } from "lucide-react";
import CategoryBadge from "./CategoryBadge";

export default function QuestionCard({
  item,
  onDelete,
  onEdit,
  onExpand,
  isExpanded,
  isAdmin
}) {
  const created =
    item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Just now";

  return (
    <div
      className={`question-card ${isExpanded ? "expanded" : ""}`}
      onClick={() => onExpand(item._id)}
    >
      <div className="question-card-header">
        <div className="flex-1">
          <div className="question-meta">
            <CategoryBadge categoryId={item.category} />
            <span className="question-date">{created}</span>
          </div>

          <div className="question-title-row">
            <h3 className="question-title">{item.question}</h3>
            <div className="question-card-actions">
            {isAdmin && (<>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="icon-button"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item._id);
                }}
                className="icon-button "
              >
                <Trash2 size={18} />
              </button>
              </>
            )}

            <ChevronDown
              className={`chevron ${isExpanded ? "expanded" : ""}`}
              size={20}
              onClick={(e) => {
                e.stopPropagation();
                onExpand(item._id);
              }}
            />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`answer-panel ${isExpanded ? "open" : ""}`}
      >
        {isExpanded && (
          <>
            <div className="answer-label">Answer</div>
            <div
              className="answer-body"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </>
        )}
      </div>
    </div>
  );
}
