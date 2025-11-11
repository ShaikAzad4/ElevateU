// import React, { useEffect, useState } from "react";
// import "./CourseList.css";

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// function CourseList() {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState(null);
//   const [query, setQuery] = useState("");
//   const [sort, setSort] = useState("new"); // 'new' | 'price-asc' | 'price-desc'

//   useEffect(() => {
//     let ignore = false;
//     (async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/courses`);
//         const data = await res.json();
//         if (!res.ok) throw new Error(data?.error || "Failed to load courses");
//         if (!ignore) setCourses(data);
//       } catch (e) {
//         if (!ignore) setErr(e.message);
//       } finally {
//         if (!ignore) setLoading(false);
//       }
//     })();
//     return () => (ignore = true);
//   }, []);

//   const filtered = courses
//     .filter((c) => {
//       const q = query.trim().toLowerCase();
//       if (!q) return true;
//       return (
//         c.title?.toLowerCase().includes(q) ||
//         c.tutor?.toLowerCase().includes(q) ||
//         c.duration?.toLowerCase().includes(q)
//       );
//     })
//     .sort((a, b) => {
//       if (sort === "price-asc") return (a.price ?? 0) - (b.price ?? 0);
//       if (sort === "price-desc") return (b.price ?? 0) - (a.price ?? 0);
//       const da = new Date(a.created_at || 0).getTime();
//       const db = new Date(b.created_at || 0).getTime();
//       return db - da;
//     });

//   if (loading) {
//     return (
//       <div className="courses-container">
//         <p>Loading courses…</p>
//       </div>
//     );
//   }

//   if (err) {
//     return (
//       <div className="courses-container">
//         <p style={{ color: "crimson" }}>❌ {err}</p>
//       </div>
//     );
//   }

//   if (!filtered.length) {
//     return (
//       <div className="courses-container">
//         <div className="courses-toolbar">
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search by title, tutor, duration…"
//           />
//           <select value={sort} onChange={(e) => setSort(e.target.value)}>
//             <option value="new">Newest</option>
//             <option value="price-asc">Price: Low to High</option>
//             <option value="price-desc">Price: High to Low</option>
//           </select>
//         </div>
//         <p>No courses yet.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="courses-container">
//       <div className="courses-toolbar">
//         <input
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Search by title, tutor, duration…"
//         />
//         <select value={sort} onChange={(e) => setSort(e.target.value)}>
//           <option value="new">Newest</option>
//           <option value="price-asc">Price: Low to High</option>
//           <option value="price-desc">Price: High to Low</option>
//         </select>
//       </div>

//       <div className="course-grid">
//         {filtered.map((c) => (
//           <article key={c.id} className="course-card">
//             <h3 className="course-title">{c.title}</h3>
//             <p className="course-tutor">By {c.tutor}</p>
//             <p className="course-duration">Duration: {c.duration}</p>
//             <p className="course-price">
//               {typeof c.price === "number" ? `$${c.price.toFixed(2)}` : "Free"}
//             </p>
//             <p className="course-curriculum">
//               {c.curriculum?.length > 120
//                 ? c.curriculum.slice(0, 120) + "…"
//                 : c.curriculum}
//             </p>
//             <a className="course-link" href={`/courses/${c.id}`}>
//               View details →
//             </a>
//           </article>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CourseList;


// top imports (unchanged)
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Courses.css";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { user, isSignedIn } = useUser();             // 👈 we’ll read user.id here
  const navigate = useNavigate();                     // 👈 for redirect after enroll

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [enrolling, setEnrolling] = useState(null);   // 👈 enrolling spinner per card

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/courses`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load courses");

        const normalized = (Array.isArray(data) ? data : []).map((c, idx) => ({
          id: c.id || idx, // 👈 should be the Mongo id string from backend
          title: c.title || "Untitled Course",
          description: c.curriculum || "No description provided.",
          price:
            typeof c.price === "number"
              ? c.price
              : c.price !== undefined && c.price !== null && c.price !== ""
              ? Number(c.price)
              : null,
          duration: c.duration || "—",
          level:
            (c.level &&
              String(c.level).charAt(0).toUpperCase() +
                String(c.level).slice(1)) || "Beginner",
          students: c.students ?? 0,
          image: "🎓",
          category: c.category || "general",
          slug:
            (c.title || "course")
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `course-${idx}`,
        }));

        if (!ignore) setCourses(normalized);
      } catch (e) {
        if (!ignore) setErr(e.message || "Failed to load courses");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const filteredCourses = useMemo(() => {
    if (activeFilter === "all") return courses;
    return courses.filter(
      (course) =>
        (course.level || "").toLowerCase() === activeFilter.toLowerCase()
    );
  }, [courses, activeFilter]);

  // 👇 Enroll handler
  const handleEnroll = async (courseId) => {
    if (!isSignedIn || !user?.id) {
      alert("Please sign in first.");
      return;
    }
    setEnrolling(courseId);
    try {
      const res = await fetch(`${API_BASE}/api/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_id: user.id,          // server uses this to find the User doc
          course_id: courseId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to enroll");
      }
      // success → go to MyCourse
      navigate("/mycourse");
    } catch (e) {
      alert(e.message || "Failed to enroll");
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div className="app">
      {/* header unchanged */}
      {/* ... */}

      <section className="courses-section">
        <div className="container">
          {loading && <p>Loading courses…</p>}
          {err && <p style={{ color: "crimson" }}>{err}</p>}

          <div className="courses-grid">
            {!loading && !err && filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-image">
                  <span className="course-emoji">{course.image}</span>
                </div>

                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>

                  <div className="course-footer">
                    <span className="price">
                      {course.price != null && !Number.isNaN(course.price)
                        ? `₹${Number(course.price).toFixed(2)}`
                        : "Free"}
                    </span>

                    {/* 👇 Replace Link with button that calls enroll */}
                    <button
                      className="enroll-btn"
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolling === course.id}
                      title={!isSignedIn ? "Sign in to enroll" : "Enroll"}
                    >
                      {enrolling === course.id ? "Enrolling..." : "Enroll Now"}
                    </button>

                    {/* (optional) keep the detail page link if you have one */}
                    {/* <Link to={`/courses/${course.slug}`} className="details-btn">Details</Link> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* footer unchanged */}
    </div>
  );
};

export default Courses;
