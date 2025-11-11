import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "@clerk/clerk-react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";

import "./Home.css"
const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();
  const [sameUser,setSameUser] =useState(false)
  const [mongoData,setMongoData] = useState([])
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

    useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const clerkId = user.id;
      const email = user?.primaryEmailAddress?.emailAddress || "";
      const name  = user?.fullName || "";

      // IMPORTANT: use localhost to match CORS, and use the sync response directly
      fetch("http://localhost:5000/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerk_id: clerkId, email, name }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            throw new Error(j?.error || "Sync failed");
          }
          return res.json();
        })
        .then((savedUser) => {
          console.log("Synced/loaded Mongo user:", savedUser);
          setMongoData(savedUser); // <- no immediate GET; trust the saved row
        })
        .catch((err) => console.error("Error syncing user:", err));
    }
  }, [isLoaded, isSignedIn, user]);

  // ---- access rule (unchanged) ----
  const norm = (s) => (s || "").trim().toLowerCase();
  const clerkName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username || "";

  const showAdminLink =
    isLoaded &&
    isSignedIn &&
    user &&
    mongoData &&
    user.id === mongoData.clerk_id &&               // IDs match
    norm(clerkName) === norm(mongoData.name) &&     // names match
    norm(mongoData.name) === "admin";               // name is admin

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo" style={{cursor:"pointer"}}>
            <Link to="/"><h2 className='elevateu'>ElevateU</h2></Link>
          </div>

          {showAdminLink && (
            <nav>
              <Link to="/admin">Admin Page</Link>
            </nav>
          )}

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            <SignedOut>
              <div className='authbtns'>
                <button className="login-btn">
                  <Link to="/login" style={{ color:'white', textDecoration:'none' }}>Login&nbsp;&nbsp;</Link>
                </button>
                <button className="login-btn">
                  <Link to="/sign-up" style={{ color:'white', textDecoration:'none' }}>SignUp</Link>
                </button>
              </div>
            </SignedOut>

            <SignedIn>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "white", fontWeight: 500 }}>
                  {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Account"}
                </span>
                <UserButton signOutRedirectUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Rest of your existing Home component remains the same */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Connecting Learners to Knowledge</h1>
            <p>An integrated learning hub helping students gain practical knowledge and interview experience to stand out in their careers</p>
            <Link to="/login"><button className="cta-button">Get Started</button></Link>
          </div>
          
          <div style={{display: "flex",
              flexWrap: "wrap",
              gap: "25px",
              width: "100%",
              justifyContent: "center",}}>
            <div className="stats-container">
              <div className="stat">
                <h3>+38k</h3>
                <p>Happy Students</p>
              </div>
              <div className="stat">
                <h3>+45k</h3>
                <p>Courses Completed</p>
              </div>
              <div className="stat">
                <h3>100%</h3>
                <p>Student Satisfaction</p>
              </div>
            </div>
            
            <div className="balance-card">
              <h4>Balance Stats $4200</h4>
            </div>
            
            <div className="payment-card">
              <h4>Payment on Internet</h4>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Our Courses?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">📚</div>
              <h3>Comprehensive Content</h3>
              <p>In-depth courses covering all essential topics with practical examples.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Expert Instructors</h3>
              <p>Learn from industry professionals with years of experience.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💼</div>
              <h3>Career Focused</h3>
              <p>Courses designed to help you advance in your career path.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div>
            <Link to="/NoAbout" style={{color:"white",textDecoration:"none",marginRight:"20px"}}>About</Link>
            <Link to="/NoContact" style={{color:"white",textDecoration:"none"}}>Contact</Link>
          </div>
          <p>&copy; 2023 ElevateU. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;

