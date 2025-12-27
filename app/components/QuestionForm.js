
import {
  Loader2,
  Save,
} from "lucide-react";

export default function QuestionForm({ CATEGORIES, handleSubmit, formData, setFormData, isSaving, setView }) {

    return (
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
                                className={`category-button ${formData.category === cat.id ? "active" : ""
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
                {formData.id && (
                    <div className="form-group">
                        <label className="form-label">Question ID</label>
                        <input
                            name="id"
                            type="text"
                            value={formData.id}
                            className="input"
                            disabled
                        />
                    </div>
                )}
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
                        name="answer"
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
        </div>);
}         