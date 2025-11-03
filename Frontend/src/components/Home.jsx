import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css"
const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="app">
      {/* Header Section */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h2 className='elevateu'>ElevateU</h2>
          </div>
          {/* <nav className="nav">
            <Link to="/courses">Courses</Link>
            <Link to="/mycourse">MyCourse</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav> */}
          <div className='authbtns'>
            <button className="login-btn"><Link to="/login" style={{color:'white',textDecoration:"None"
            }}>Login&nbsp;&nbsp;</Link></button>
            <button className="login-btn"><Link to="/login" style={{color:'white',textDecoration:"None"
            }}>SignUp</Link></button>
          </div>
        </div>
      </header>

      {/* Rest of your existing Home component remains the same */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Connecting Learners to Knowledge</h1>
            <p>An integrated learning hub helping students gain practical knowledge and interview experience to stand out in their careers</p>
            <button className="cta-button">Get Started</button>
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

      {/* Chatbot */}
      <div className="chatbot-logo" onClick={toggleChat}>
        <div className="chatbot-icon">
          <span>💬</span>
        </div>
      </div>

      {isChatOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>ElevateU Assistant</h3>
            <button className="close-chat" onClick={toggleChat}>×</button>
          </div>
          <div className="chatbot-messages">
            <div className="message bot-message">
              <p>Hello! I'm your ElevateU assistant. How can I help you today?</p>
            </div>
          </div>
          <div className="chatbot-input">
            <input 
              type="text" 
              placeholder="Ask me anything about courses, pricing, or support..."
            />
            <button className="send-button">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;