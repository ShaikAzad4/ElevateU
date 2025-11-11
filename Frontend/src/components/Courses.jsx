// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./Courses.css";
// import { useAuth } from "@clerk/clerk-react";
// import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

// const Courses = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const [activeFilter, setActiveFilter] = useState("all");
//   const { user, isSignedIn, isLoaded } = useUser();
//   const toggleChat = () => {
//     setIsChatOpen(!isChatOpen);
//   };

//   const courses = [
//     {
//       id: 1,
//       title: "Web Development Bootcamp",
//       description:
//         "Learn full-stack web development with HTML, CSS, JavaScript, React, and Node.js",
//       price: "$299",
//       duration: "12 weeks",
//       level: "Beginner",
//       rating: 4.8,
//       students: 12500,
//       image: "🌐",
//       category: "web",
//     },
//     {
//       id: 2,
//       title: "Data Science Fundamentals",
//       description:
//         "Master data analysis, visualization, and machine learning with Python",
//       price: "$399",
//       duration: "16 weeks",
//       level: "Intermediate",
//       rating: 4.9,
//       students: 8900,
//       image: "📊",
//       category: "data",
//     },
//     {
//       id: 3,
//       title: "Machine Learning & AI",
//       description: "Comprehensive machine learning algorithms and AI concepts",
//       price: "$449",
//       duration: "18 weeks",
//       level: "Advanced",
//       rating: 4.9,
//       students: 6700,
//       image: "🤖",
//       category: "ai",
//     },
//     {
//       id: 4,
//       title: "Python Programming",
//       description:
//         "From basics to advanced Python programming and applications",
//       price: "$199",
//       duration: "8 weeks",
//       level: "Beginner",
//       rating: 4.7,
//       students: 15200,
//       image: "🐍",
//       category: "programming",
//     },
//     {
//       id: 5,
//       title: "Java Development",
//       description: "Object-oriented programming with Java and Spring Framework",
//       price: "$349",
//       duration: "14 weeks",
//       level: "Intermediate",
//       rating: 4.6,
//       students: 8300,
//       image: "☕",
//       category: "programming",
//     },
//     {
//       id: 6,
//       title: "Data Analytics",
//       description: "Data analysis, SQL, and business intelligence tools",
//       price: "$329",
//       duration: "10 weeks",
//       level: "Beginner",
//       rating: 4.5,
//       students: 7200,
//       image: "📈",
//       category: "data",
//     },
//     {
//       id: 7,
//       title: "Generative AI",
//       description:
//         "Learn GPT models, diffusion models, and creative AI applications",
//       price: "$499",
//       duration: "12 weeks",
//       level: "Advanced",
//       rating: 4.9,
//       students: 4500,
//       image: "🎨",
//       category: "ai",
//     },
//     {
//       id: 8,
//       title: "Cloud Computing & AWS",
//       description: "Master cloud infrastructure, deployment, and AWS services",
//       price: "$449",
//       duration: "16 weeks",
//       level: "Intermediate",
//       rating: 4.8,
//       students: 5400,
//       image: "☁️",
//       category: "cloud",
//     },
//     {
//       id: 9,
//       title: "Cybersecurity Fundamentals",
//       description: "Network security, ethical hacking, and threat protection",
//       price: "$399",
//       duration: "14 weeks",
//       level: "Intermediate",
//       rating: 4.7,
//       students: 6100,
//       image: "🔒",
//       category: "security",
//     },
//     {
//       id: 10,
//       title: "Mobile App Development",
//       description: "Build cross-platform mobile applications with React Native",
//       price: "$349",
//       duration: "14 weeks",
//       level: "Intermediate",
//       rating: 4.7,
//       students: 7500,
//       image: "📱",
//       category: "mobile",
//     },
//     {
//       id: 11,
//       title: "DevOps & CI/CD",
//       description: "Docker, Kubernetes, Jenkins, and deployment pipelines",
//       price: "$429",
//       duration: "15 weeks",
//       level: "Advanced",
//       rating: 4.8,
//       students: 4800,
//       image: "⚙️",
//       category: "devops",
//     },
//     {
//       id: 12,
//       title: "UI/UX Design Masterclass",
//       description: "User-centered design principles, Figma, and prototyping",
//       price: "$279",
//       duration: "10 weeks",
//       level: "Beginner",
//       rating: 4.6,
//       students: 6200,
//       image: "🎯",
//       category: "design",
//     },
//   ];

//   const filteredCourses =
//     activeFilter === "all"
//       ? courses
//       : courses.filter(
//           (course) => course.level.toLowerCase() === activeFilter.toLowerCase()
//         );

//   return (
//     <div className="app">
//       <header className="header">
//         <div className="container header-bar">
//           <div className="logo" style={{cursor:"pointer"}}>
//             <Link to="/"><h2 className='elevateu'>ElevateU</h2></Link>
//           </div>

//           <nav className="nav">
//             <Link to="/courses">Courses</Link>
//             <Link to="/mycourse">MyCourse</Link>
//             <Link to="/about">About</Link>
//             <Link to="/contact">Contact</Link>
//           </nav>

//           <div className="header-right">
//             <SignedOut>
//               <div className='authbtns'>
//                 <button className="login-btn">
//                   <Link to="/login" style={{ color:'white', textDecoration:'none' }}>Login&nbsp;&nbsp;</Link>
//                 </button>
//                 <button className="login-btn">
//                   <Link to="/sign-up" style={{ color:'white', textDecoration:'none' }}>SignUp</Link>
//                 </button>
//               </div>
//             </SignedOut>

//             <SignedIn>
//               <span className="user-label">
//                 {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Account"}
//               </span>
//               <UserButton signOutRedirectUrl="/" />
//             </SignedIn>
//           </div>
//         </div>
//       </header>

//       <section className="courses-hero">
//         <div className="container">
//           <div className="hero-content">
//             <h1>Explore Our IT Courses</h1>
//             <p>
//               Discover comprehensive courses designed to boost your career in
//               technology and software development
//             </p>
//           </div>
//         </div>
//       </section>

//       <section className="courses-section">
//         <div className="container">
//           <div className="courses-filters">
//             <button
//               className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
//               onClick={() => setActiveFilter("all")}
//             >
//               All Courses
//             </button>
//             <button
//               className={`filter-btn ${
//                 activeFilter === "beginner" ? "active" : ""
//               }`}
//               onClick={() => setActiveFilter("beginner")}
//             >
//               Beginner
//             </button>
//             <button
//               className={`filter-btn ${
//                 activeFilter === "intermediate" ? "active" : ""
//               }`}
//               onClick={() => setActiveFilter("intermediate")}
//             >
//               Intermediate
//             </button>
//             <button
//               className={`filter-btn ${
//                 activeFilter === "advanced" ? "active" : ""
//               }`}
//               onClick={() => setActiveFilter("advanced")}
//             >
//               Advanced
//             </button>
//           </div>

//           <div className="courses-grid">
//             {filteredCourses.map((course) => (
//               <div key={course.id} className="course-card">
//                 <div className="course-image">
//                   <span className="course-emoji">{course.image}</span>
//                   <div className="course-level">{course.level}</div>
//                 </div>
//                 <div className="course-content">
//                   <h3>{course.title}</h3>
//                   <p>{course.description}</p>
//                   <div className="course-meta">
//                     <span className="duration">⏱️ {course.duration}</span>
//                     <span className="rating">⭐ {course.rating}</span>
//                   </div>
//                   <div className="course-stats">
//                     <span className="students">
//                       👥 {course.students.toLocaleString()} students
//                     </span>
//                   </div>

//                   <div className="course-footer">
//                     <span className="price">{course.price}</span>
//                     <Link
//                       to={`/courses/${course.title
//                         .toLowerCase()
//                         .replace(/[^a-z0-9]+/g, "-")}`}
//                       className="enroll-btn"
//                     >
//                       Enroll Now
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <footer className="footer">
//         <div className="container">
//           <p>&copy; 2024 ElevateU. All rights reserved.</p>
//         </div>
//       </footer>

//     </div>
//   );
// };

// export default Courses;



import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import "./Courses.css";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const Courses = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  
const { user, isSignedIn } = useUser();
const navigate = useNavigate();
const [enrolling, setEnrolling] = useState(null);


  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/courses`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load courses");

        const normalized = (Array.isArray(data) ? data : []).map((c, idx) => ({
          id: c.id || idx,
          title: c.title || "Untitled Course",
          description: c.curriculum || "No description provided.",
          // 👇 keep price numeric; no "$"
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
    return () => {
      ignore = true;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    if (activeFilter === "all") return courses;
    return courses.filter(
      (course) =>
        (course.level || "").toLowerCase() === activeFilter.toLowerCase()
    );
  }, [courses, activeFilter]);

const handleEnroll = async (courseId) => {
  if (!isSignedIn || !user?.id) {
    alert("Please sign in first.");
    return;
  }

  setEnrolling(courseId); // show loading for this course

  try {
    const res = await fetch(`${API_BASE}/api/enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerk_id: user.id,   // Clerk user ID
        course_id: courseId, // which course to enroll
      }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data?.error || "Failed to enroll");

    // redirect to MyCourse page on success
    navigate("/mycourse");
  } catch (err) {
    alert(err.message || "Failed to enroll");
  } finally {
    setEnrolling(null);
  }
};


  return (
    <div className="app">
      <header className="header">
        <div className="container header-bar">
          <div className="logo" style={{ cursor: "pointer" }}>
            <Link to="/">
              <h2 className="elevateu">ElevateU</h2>
            </Link>
          </div>

          <nav className="nav">
            <Link to="/courses">Courses</Link>
            <Link to="/mycourse">MyCourse</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="header-right">
            <SignedOut>
              <div className="authbtns">
                <button className="login-btn">
                  <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
                    Login&nbsp;&nbsp;
                  </Link>
                </button>
                <button className="login-btn">
                  <Link to="/sign-up" style={{ color: "white", textDecoration: "none" }}>
                    SignUp
                  </Link>
                </button>
              </div>
            </SignedOut>

            <SignedIn>
              <span className="user-label">
                {user?.fullName ||
                  user?.primaryEmailAddress?.emailAddress ||
                  "Account"}
              </span>
              <UserButton signOutRedirectUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <section className="courses-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Explore Our IT Courses</h1>
            <p>
              Discover comprehensive courses designed to boost your career in
              technology and software development
            </p>
          </div>
        </div>
      </section>

      <section className="courses-section">
        <div className="container">
          {loading && <p>Loading courses…</p>}
          {err && <p style={{ color: "crimson" }}> {err}</p>}

          <div className="courses-grid">
            {!loading &&
              !err &&
              filteredCourses.map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-image">
                    <span className="course-emoji">{course.image}</span>
                  </div>

                  <div className="course-content">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>

                    <div className="course-footer">
                      {/* 👇 price without $; show "Free" if null/NaN */}
                    <span className="price">
                      {course.price != null && !Number.isNaN(course.price)
                        ? `₹${Number(course.price).toFixed(2)}`
                        : "Free"}
                    </span>

                    <button
                      className="enroll-btn"
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrolling === course.id}
                    >
                      {enrolling === course.id ? "Enrolling..." : "Enroll Now"}
                    </button>

                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} ElevateU. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Courses;
