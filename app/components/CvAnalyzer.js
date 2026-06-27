"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  Loader2,
  Sparkles,
  AlertCircle,
  X,
  Wand2,
} from "lucide-react";

export default function CvAnalyzer() {
  const router = useRouter();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pick = (f) => {
    setError("");
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      return;
    }
    if (f.size > 8 * 1024 * 1024) {
      setError("File is too large (max 8 MB).");
      return;
    }
    setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    pick(e.dataTransfer.files?.[0]);
  };

  const analyze = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/cv-analyze", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      // hand the result to the result page
      sessionStorage.setItem(
        "prepResult",
        JSON.stringify({ plan: data.plan, fileName: file.name, at: Date.now() })
      );
      router.push("/prep");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cv-card">
      <div className="cv-head">
        <span className="cv-icon">
          <Wand2 size={20} />
        </span>
        <div>
          <h3 className="cv-title">AI Interview Prep from your CV</h3>
          <p className="cv-sub">
            Upload your resume (PDF). Grok reads it and builds a personalised prep
            roadmap — focus areas, timeline & tips.
          </p>
        </div>
        <span className="cv-badge">
          <Sparkles size={12} /> Grok AI
        </span>
      </div>

      {!file ? (
        <div
          className={`cv-drop ${drag ? "drag" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
        >
          <span className="cv-drop-icon">
            <Upload size={26} />
          </span>
          <div className="cv-drop-title">Drop your CV here or click to browse</div>
          <div className="cv-drop-hint">PDF only · up to 8 MB · stays private</div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => pick(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="cv-file">
          <span className="cv-file-icon">
            <FileText size={20} />
          </span>
          <div className="cv-file-meta">
            <div className="cv-file-name">{file.name}</div>
            <div className="cv-file-size">{(file.size / 1024).toFixed(0)} KB</div>
          </div>
          {!loading && (
            <button
              className="icon-button"
              onClick={() => setFile(null)}
              aria-label="Remove"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="ai-error" style={{ marginTop: 14 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <button
        className="button button-primary cv-analyze-btn"
        onClick={analyze}
        disabled={!file || loading}
      >
        {loading ? (
          <>
            <Loader2 size={17} className="animate-spin" /> Analysing your CV…
          </>
        ) : (
          <>
            <Sparkles size={17} /> Analyse &amp; build my prep plan
          </>
        )}
      </button>

      {loading && (
        <p className="cv-loading-hint">
          Reading your resume and planning your roadmap — this takes ~10-20 seconds.
        </p>
      )}
    </div>
  );
}
