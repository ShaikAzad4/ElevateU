import React, { useMemo, useState} from "react";
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
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [showCreate, setShowCreate] = useState(false);

  const [form, setForm] = useState({
    title: "",
    instructor: "",
    lessons: "",
    students: "",
    price: "",
    status: "Active",
    createdAt: new Date().toISOString().slice(0, 10),
  });

  const filtered = useMemo(() => {
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

  const handleCreate = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      id: Date.now(),
      lessons: Number(form.lessons) || 0,
      students: Number(form.students) || 0,
      price: Number(form.price) || 0,
    };
    setCourses([payload, ...courses]);
    setForm({
      title: "",
      instructor: "",
      lessons: "",
      students: "",
      price: "",
      status: "Active",
      createdAt: new Date().toISOString().slice(0, 10),
    });
    setShowCreate(false);
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
            placeholder="Search courses…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Link to="/addcourse">
        <button className="btn btn-primary">
            + Create Course
          </button></Link>
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

        {/* KPIs */}
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

        {/* Filters */}
        <section className="toolbar">
          <div className="toolbar-left">
            <label htmlFor="status" className="label">
              Status
            </label>
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

        {/* Courses */}
        {filtered.length === 0 ? (
          <div className="empty">
            <p>No courses found. Try different filters.</p>
          </div>
        ) : (
          <section className="grid">
            {filtered.map((c) => (
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
      </main>
    </div>
  );
}
