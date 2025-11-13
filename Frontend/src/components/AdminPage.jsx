import React, { useEffect, useMemo, useState } from "react";
import "./AdminPage.css";
import { Link } from "react-router-dom";

const SEED = [
  {
    id: 1,
    title: "React Fundamentals",
    instructor: "Sarah Kim",
    lessons: 24,
    students: 1820,
    price: 49,
    status: "Active",
    createdAt: "2025-01-03",
  },
  {
    id: 2,
    title: "Data Structures in JS",
    instructor: "Jamal Carter",
    lessons: 30,
    students: 1450,
    price: 59,
    status: "Active",
    createdAt: "2025-02-12",
  },
  {
    id: 3,
    title: "Intro to UI/UX",
    instructor: "Anita Rao",
    lessons: 18,
    students: 980,
    price: 39,
    status: "Draft",
    createdAt: "2025-03-28",
  },
];

export default function AdminPage() {
  const [courses, setCourses] = useState(SEED);
  const [status, setStatus] = useState("All");
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0 });
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [monitorForm, setMonitorForm] = useState({ clerk_id: "", course: "", topic_title: "", note: "" });
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.ok ? r.json() : Promise.reject(r.status)),
      fetch("/api/admin/enrollments").then((r) => r.ok ? r.json() : Promise.reject(r.status)),
      fetch("/api/monitor").then((r) => r.ok ? r.json() : Promise.reject(r.status)),
    ]).then(([s, e, l]) => {
      if (!alive) return;
      setStats(s);
      setRows(Array.isArray(e) ? e : []);
      setLogs(Array.isArray(l) ? l : []);
    }).catch(() => {});
    return () => { alive = false; };
  }, []);

  const filteredEnrollments = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const t = (r?.course?.title || "").toLowerCase();
      const n = (r?.user?.name || "").toLowerCase();
      const e = (r?.user?.email || "").toLowerCase();
      return q === "" || t.includes(q) || n.includes(q) || e.includes(q);
    });
  }, [rows, query]);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      const statusOk = status === "All" || c.status === status;
      const qOk =
        q === "" ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q);
      return statusOk && qOk;
    });
  }, [courses, query, status]);

  const totalStudents = courses.reduce((sum, c) => sum + (Number(c.students) || 0), 0);
  const activeCourses = courses.filter((c) => c.status === "Active").length;

  const submitLog = (e) => {
    e.preventDefault();
    const payload = { ...monitorForm };
    fetch("/api/monitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => r.json()).then((x) => {
      setLogs([x, ...logs]);
      setMonitorForm({ clerk_id: "", course: "", topic_title: "", note: "" });
    }).catch(() => {});
  };

  return (
    <div className="page">
      {/* App Bar */}
      <header className="appbar">
        <div className="brand">
          <span className="brand-dot" aria-hidden />
          <span className="brand-name">ElevateU</span>
          <span className="brand-divider">•</span>
          <span className="brand-sub">Admin</span>
        </div>

        <div className="appbar-right">
          <input
            className="input input-search"
            placeholder="Search by course or student…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Link to="/addcourse"><button className="btn btn-primary">+ Create Course</button></Link>
        </div>
      </header>

      <main className="container">
        {/* Headline */}
        <section className="intro">
          <div>
            <h1>Manage Courses & Learners</h1>
            <p>
              Track student growth, monitor active courses, and publish new content — all in one
              place.
            </p>
          </div>
        </section>

        <section className="kpis">
          <article className="kpi">
            <h3>Total Students</h3>
            <p className="kpi-value">{totalStudents.toLocaleString()}</p>
          </article>
          <article className="kpi">
            <h3>Active Courses</h3>
            <p className="kpi-value">{activeCourses}</p>
          </article>
          <article className="kpi">
            <h3>Total Courses</h3>
            <p className="kpi-value">{courses.length}</p>
          </article>
        </section>

        <section className="kpis" style={{marginTop:"1rem"}}>
          <article className="kpi">
            <h3>Registered Students</h3>
            <p className="kpi-value">{Number(stats.users || 0).toLocaleString()}</p>
          </article>
          <article className="kpi">
            <h3>Total Enrollments</h3>
            <p className="kpi-value">{Number(stats.enrollments || 0)}</p>
          </article>
          <article className="kpi">
            <h3>Courses In DB</h3>
            <p className="kpi-value">{Number(stats.courses || 0)}</p>
          </article>
        </section>

        <section className="toolbar">
          <div className="toolbar-left">
            <label htmlFor="status" className="label">Status</label>
            <select
              id="status"
              className="select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>Draft</option>
            </select>
          </div>
          <div className="toolbar-right">
            <button className="btn btn-ghost" onClick={() => { setStatus("All"); setQuery(""); }}>
              Reset
            </button>
          </div>
        </section>

        {filteredCourses.length === 0 ? (
          <div className="empty">
            <p>No courses found. Try different filters.</p>
          </div>
        ) : (
          <section className="grid">
            {filteredCourses.map((c) => (
              <article key={c.id} className="course">
                <header className="course-head">
                  <h4 className="course-title">{c.title}</h4>
                  <span className={`pill ${c.status === "Active" ? "pill-green" : "pill-amber"}`}>
                    {c.status}
                  </span>
                </header>
                <dl className="course-meta">
                  <div><dt>Instructor</dt><dd>{c.instructor}</dd></div>
                  <div><dt>Lessons</dt><dd>{c.lessons}</dd></div>
                  <div><dt>Students</dt><dd>{c.students}</dd></div>
                  <div><dt>Price</dt><dd>${c.price}</dd></div>
                  <div><dt>Created</dt><dd>{c.createdAt}</dd></div>
                </dl>
                <footer className="course-actions">
                  <button className="btn btn-ghost">Edit</button>
                  <button
                    className="btn btn-ghost danger"
                    onClick={() => setCourses(courses.filter((x) => x.id !== c.id))}
                  >
                    Delete
                  </button>
                </footer>
              </article>
            ))}
          </section>
        )}

        <section className="intro">
          <div>
            <h2>Enrollments</h2>
          </div>
        </section>

        {filteredEnrollments.length === 0 ? (
          <div className="empty">
            <p>No enrollments found. Try different filters.</p>
          </div>
        ) : (
          <section className="grid">
            {filteredEnrollments.map((r) => (
              <article key={r.id} className="course">
                <header className="course-head">
                  <h4 className="course-title">{r.course?.title || "Untitled"}</h4>
                  <span className={`pill pill-green`}>{r.status}</span>
                </header>
                <dl className="course-meta">
                  <div><dt>Student</dt><dd>{r.user?.name}</dd></div>
                  <div><dt>Email</dt><dd>{r.user?.email}</dd></div>
                  <div><dt>Clerk</dt><dd>{r.user?.clerk_id}</dd></div>
                  <div><dt>Tutor</dt><dd>{r.course?.tutor}</dd></div>
                  <div><dt>Enrolled</dt><dd>{r.created_at}</dd></div>
                </dl>
                <footer className="course-actions">
                  <button className="btn btn-ghost">View</button>
                </footer>
              </article>
            ))}
          </section>
        )}

        <section className="intro">
          <div>
            <h2>Student Monitor</h2>
            <p>Log completed topics today and review recent notes.</p>
          </div>
        </section>

        <section className="toolbar">
          <form className="grid" onSubmit={submitLog}>
            <article className="course">
              <header className="course-head"><h4 className="course-title">Add Note</h4></header>
              <div className="form-grid">
                <input className="input" placeholder="Clerk ID" value={monitorForm.clerk_id} onChange={(e)=>setMonitorForm({...monitorForm, clerk_id:e.target.value})} />
                <input className="input" placeholder="Course" value={monitorForm.course} onChange={(e)=>setMonitorForm({...monitorForm, course:e.target.value})} />
                <input className="input" placeholder="Topic" value={monitorForm.topic_title} onChange={(e)=>setMonitorForm({...monitorForm, topic_title:e.target.value})} />
                <input className="input" placeholder="Note" value={monitorForm.note} onChange={(e)=>setMonitorForm({...monitorForm, note:e.target.value})} />
              </div>
              <footer className="course-actions"><button className="btn btn-primary" type="submit">Add</button></footer>
            </article>
          </form>
        </section>

        {logs.length > 0 && (
          <section className="grid">
            {logs.map((x) => (
              <article key={x.id} className="course">
                <header className="course-head">
                  <h4 className="course-title">{x.course}</h4>
                  <span className={`pill pill-amber`}>{x.topic_title || "Topic"}</span>
                </header>
                <dl className="course-meta">
                  <div><dt>Clerk</dt><dd>{x.clerk_id}</dd></div>
                  <div><dt>Note</dt><dd>{x.note}</dd></div>
                  <div><dt>When</dt><dd>{x.created_at}</dd></div>
                </dl>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
