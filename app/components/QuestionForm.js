import { Loader2, Save } from "lucide-react";

export default function QuestionForm({
  CATEGORIES,
  handleSubmit,
  formData,
  setFormData,
  isSaving,
  setView,
}) {
  const isEditing = Boolean(formData.id);

  return (
    <div className="card form-card">
      <h2>{isEditing ? "Edit Interview Question" : "New Interview Question"}</h2>

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
                onClick={() => setFormData({ ...formData, category: cat.id })}
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
            placeholder="e.g. What is the Virtual DOM and why does it matter?"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Answer <span style={{ color: "var(--text-faint)" }}>(HTML supported)</span>
          </label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
            className="textarea"
            placeholder="Write the answer. You can use <pre><code>…</code></pre> for code blocks."
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
            {isEditing ? "Update Question" : "Save Question"}
          </button>
        </div>
      </form>
    </div>
  );
}
