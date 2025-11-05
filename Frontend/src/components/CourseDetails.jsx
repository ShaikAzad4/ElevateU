import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./courseDetails.css";

function storageKey(courseId) {
  return `course-progress:${courseId}`;
}

export default function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Fetched questions (array of { id, type, prompt })
  const [questionsArray, setQuestionsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [answers, setAnswers] = useState({}); // { [questionId]: value }

  // Load saved progress
  useEffect(() => {
    if (!courseId) return;
    const saved = localStorage.getItem(storageKey(courseId));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
      } catch {
        // ignore parse errors
      }
    }
  }, [courseId]);

  // Save progress
  useEffect(() => {
    if (!courseId) return;
    const payload = JSON.stringify({ answers });
    localStorage.setItem(storageKey(courseId), payload);
  }, [courseId, answers]);

  // Fetch dynamic questions from Flask
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/questions"); // returns ["Q1", "Q2", ...]
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Bad payload: expected an array");
        if (!alive) return;

        // Map to UI shape with stable IDs
        const mapped = data.map((q, i) => ({
          id: `dyn-q${i + 1}`,
          type: "text",
          prompt: String(q),
        }));
        setQuestionsArray(mapped);
      } catch (e) {
        if (!alive) return;
        setError(String(e));
        setQuestionsArray([]); // NO fallback to static
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const clearProgress = () => {
    setAnswers({});
    if (courseId) localStorage.removeItem(storageKey(courseId));
  };

  // Use fetched questions ONLY
  const questionsToRender = questionsArray;

  return (
    <div className="cd-container">
      <header className="cd-header">
        <div className="cd-breadcrumbs">
          <Link to="/" className="cd-breadcrumb-link">Home</Link>
          <span className="cd-breadcrumb-sep">/</span>
          <span className="cd-breadcrumb-current">
            {courseId || "course"}
          </span>
        </div>

        <div className="cd-header-main">
          <div>
            <h1 className="cd-title">Questions</h1>
            <p className="cd-sub">
              {courseId ? `Course ID: ${courseId}` : "No course selected"}
            </p>
          </div>

          <div className="cd-actions">
            <button className="cd-btn ghost" onClick={clearProgress}>
              Clear Progress
            </button>
            <button className="cd-btn ghost" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </header>

      <main className="cd-content">
        <section className="cd-section">
          {loading && (
            <div className="cd-card" style={{ marginBottom: 16 }}>
              Loading questions…
            </div>
          )}

          {!loading && error && (
            <div className="cd-card" style={{ marginBottom: 16 }}>
              Couldn’t load dynamic questions.<br />{error}
            </div>
          )}

          {!loading && !error && questionsToRender.length === 0 && (
            <div className="cd-card" style={{ marginBottom: 16 }}>
              No questions available yet.
            </div>
          )}

          {questionsToRender.map((q, idx) => (
            <article key={q.id} className="cd-item">
              <div className="cd-item-head">
                <span className="cd-chip">Q{idx + 1}</span>
                <h3 className="cd-item-title">{q.prompt}</h3>
              </div>

              <textarea
                className="cd-textarea"
                placeholder="Type your short answer here…"
                value={answers[q.id] || ""}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                }
                rows={4}
              />
            </article>
          ))}

          <div className="cd-cta-row">
            <button
              className="cd-btn"
              onClick={() =>
                alert("Progress saved locally! (auto-saves as you type)")
              }
            >
              Save Progress
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
