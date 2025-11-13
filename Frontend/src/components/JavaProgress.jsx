import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function JavaProgress() {
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [topics, setTopics] = useState([]);
  const [percent, setPercent] = useState(0);

  async function fetchTopics(signal) {
    if (!user?.id) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch(`/progress/java/topics?clerk_id=${encodeURIComponent(user.id)}`, { signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTopics(Array.isArray(data.topics) ? data.topics : []);
      setPercent(data.percent ?? 0);
    } catch (e) {
      if (e?.name === 'AbortError') return;
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  async function markComplete(key) {
    if (!user?.id || !key) return;
    try {
      const res = await fetch(`/progress/java/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerk_id: user.id, topic_key: key }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPercent(data.percent ?? percent);
      await fetchTopics();
    } catch (e) {
      alert(`Failed to update: ${String(e.message || e)}`);
    }
  }

  async function resetAll() {
    if (!user?.id) return;
    try {
      const res = await fetch(`/progress/java/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerk_id: user.id }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPercent(data.percent ?? 0);
      await fetchTopics();
    } catch (e) {
      alert(`Failed to reset: ${String(e.message || e)}`);
    }
  }

  useEffect(() => {
    const ctrl = new AbortController();
    if (isSignedIn) fetchTopics(ctrl.signal);
    return () => ctrl.abort();
  }, [isSignedIn, user?.id]);

  if (!isSignedIn) {
    return (
      <div className="container" style={{ padding: 20 }}>
        <p>Please sign in to view Java progress.</p>
        <Link to="/login" className="continue-btn">Login</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0 }}>Java Course Progress</h1>
          <p style={{ marginTop: 4, color: "#6b7280" }}>Track topics and completion percentage</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="continue-btn" onClick={fetchTopics}>Refresh</button>
          <button className="continue-btn" onClick={resetAll}>Reset</button>
        </div>
      </header>

      <section style={{ marginTop: 16 }}>
        {loading && <p>Loading topics…</p>}
        {err && <p style={{ color: "crimson" }}>{err}</p>}

        {!loading && !err && (
          <>
            <div style={{ marginBottom: 12 }}>
              <strong>Completion:</strong> {percent}%
              <div style={{ height: 8, background: "#eee", borderRadius: 8, marginTop: 6 }}>
                <div style={{ width: `${percent}%`, height: 8, background: "#ff9800", borderRadius: 8 }} />
              </div>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {topics.map((t) => (
                <li key={t.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <input
                    type="checkbox"
                    checked={!!t.done}
                    onChange={() => !t.done && markComplete(t.key)}
                    disabled={!!t.done}
                  />
                  <span style={{ flex: 1 }}>{t.title}</span>
                  {t.done ? <span style={{ color: "#16a34a" }}>Done</span> : (
                    <button className="continue-btn" onClick={() => markComplete(t.key)}>Mark done</button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}