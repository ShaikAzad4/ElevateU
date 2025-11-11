// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import './MyCourse.css';
// import { useAuth } from "@clerk/clerk-react";
// import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

// const MyCourse = () => {
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const { user, isSignedIn, isLoaded } = useUser();
//   const toggleChat = () => {
//     setIsChatOpen(!isChatOpen);
//   };

//   const enrolledCourses = [
//     {
//       id: 1,
//       title: "Web Development Bootcamp",
//       progress: 75,
//       nextLesson: "React Hooks",
//       dueDate: "2024-01-15",
//       instructor: "John Doe",
//       thumbnail: "🌐"
//     },
//     {
//       id: 2,
//       title: "Data Science Fundamentals",
//       progress: 45,
//       nextLesson: "Data Visualization",
//       dueDate: "2024-01-20",
//       instructor: "Jane Smith",
//       thumbnail: "📊"
//     }
//   ];

//   const completedCourses = [
//     {
//       id: 3,
//       title: "Python for Beginners",
//       completionDate: "2023-12-01",
//       certificate: true,
//       thumbnail: "🐍"
//     }
//   ];

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

//       <section className="mycourse-hero">
//         <div className="container">
//           <div className="hero-content">
//             <h1>My Learning Dashboard</h1>
//             <p>Track your progress and continue your learning journey</p>
//           </div>
//         </div>
//       </section>

//       <section className="mycourse-content">
//         <div className="container">
//           <div className="learning-stats">
//             <div className="stat-card">
//               <h3>Courses in Progress</h3>
//               <p className="stat-number">{enrolledCourses.length}</p>
//             </div>
//             <div className="stat-card">
//               <h3>Completed Courses</h3>
//               <p className="stat-number">{completedCourses.length}</p>
//             </div>
//             <div className="stat-card">
//               <h3>Learning Hours</h3>
//               <p className="stat-number">42</p>
//             </div>
//           </div>

//           <div className="courses-section">
//             <h2>Continue Learning</h2>
//             <div className="enrolled-courses">
//               {enrolledCourses.map(course => (
//                 <div key={course.id} className="course-progress-card">
//                   <div className="course-thumbnail">
//                     <span>{course.thumbnail}</span>
//                   </div>
//                   <div className="course-details">
//                     <h3>{course.title}</h3>
//                     <p>Instructor: {course.instructor}</p>
//                     <div className="progress-container">
//                       <div className="progress-bar">
//                         <div 
//                           className="progress-fill" 
//                           style={{width: `${course.progress}%`}}
//                         ></div>
//                       </div>
//                       <span className="progress-text">{course.progress}% Complete</span>
//                     </div>
//                     <div className="course-next">
//                       <p>Next: {course.nextLesson}</p>
//                       <p>Due: {course.dueDate}</p>
//                     </div>
//                     <button className="continue-btn">Continue Learning</button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <h2>Completed Courses</h2>
//             <div className="completed-courses">
//               {completedCourses.map(course => (
//                 <div key={course.id} className="completed-course-card">
//                   <div className="course-thumbnail">
//                     <span>{course.thumbnail}</span>
//                   </div>
//                   <div className="course-details">
//                     <h3>{course.title}</h3>
//                     <p>Completed on: {course.completionDate}</p>
//                     {course.certificate && (
//                       <button className="certificate-btn">Download Certificate</button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       <footer className="footer">
//         <div className="container">
//           <p>&copy; 2023 ElevateU. All rights reserved.</p>
//         </div>
//       </footer>

//     </div>
//   );
// };

// export default MyCourse;




import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./MyCourse.css";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const MyCourse = () => {
  const { user, isSignedIn } = useUser();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!isSignedIn || !user?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/my-courses?clerk_id=${encodeURIComponent(user.id)}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load courses");
        if (!cancelled) setCourses(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setErr(e.message || "Failed to load courses");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isSignedIn, user?.id]);

  const stats = useMemo(() => {
    return {
      inProgress: courses.length, // you can split by status later if you add it
      completed: 0,               // placeholder until you track completion
      hours: 0,                   // optional metric if you track it
    };
  }, [courses]);

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
                {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Account"}
              </span>
              <UserButton signOutRedirectUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <section className="mycourse-hero">
        <div className="container">
          <div className="hero-content">
            <h1>My Learning Dashboard</h1>
            <p>Track your progress and continue your learning journey</p>
          </div>
        </div>
      </section>

      <section className="mycourse-content">
        <div className="container">
          {!isSignedIn && <p>Please sign in to view your courses.</p>}
          {loading && <p>Loading your courses…</p>}
          {err && <p style={{ color: "crimson" }}>{err}</p>}

          {!loading && isSignedIn && !err && (
            <>
              <div className="learning-stats">
                <div className="stat-card">
                  <h3>Courses in Progress</h3>
                  <p className="stat-number">{stats.inProgress}</p>
                </div>
                <div className="stat-card">
                  <h3>Completed Courses</h3>
                  <p className="stat-number">{stats.completed}</p>
                </div>
                <div className="stat-card">
                  <h3>Learning Hours</h3>
                  <p className="stat-number">{stats.hours}</p>
                </div>
              </div>

              <div className="courses-section">
                <h2>Enrolled Courses</h2>

                {courses.length === 0 ? (
                  <p>You haven’t enrolled in any courses yet.</p>
                ) : (
                  <div className="enrolled-courses">
                    {courses.map((c) => (
                      <div key={c.enrollment_id || c.id} className="course-progress-card">
                        <div className="course-thumbnail">
                          <span role="img" aria-label="course">🎓</span>
                        </div>

                        <div className="course-details">
                          <h3>{c.title}</h3>
                          <p>Instructor: {c.tutor}</p>

                          <div className="progress-container">
                            {/* Placeholder progress UI (until you track progress) */}
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `0%` }}></div>
                            </div>
                            <span className="progress-text">0% Complete</span>
                          </div>

                          <div className="course-next">
                            <p>Duration: {c.duration}</p>
                            <p>
                              Enrolled on:{" "}
                              {c.enrolled_at ? new Date(c.enrolled_at).toLocaleString() : "—"}
                            </p>
                          </div>

                          <div className="course-actions">
                            <Link to={`/course/${c.id}`} className="continue-btn">
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Completed section will work once you add status tracking */}
                <h2 style={{ marginTop: 24 }}>Completed Courses</h2>
                <div className="completed-courses">
                  <p>No completed courses yet.</p>
                </div>
              </div>
            </>
          )}
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

export default MyCourse;
