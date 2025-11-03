import React from 'react';
import './landingPage.css';

const landingPage = () => {
  return (
    <div className="app">
      {/* Header Section */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h2>ElevateU</h2>
          </div>
          <nav className="nav">
            <a href="#courses">Courses</a>
            <a href="#pricing">MyCourse</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <div>
            <button className="login-btn">Login</button>
            <button className="login-btn">Signup</button>
          </div>
        </div>
      </header>

      {/* Hero Section - Fixed Height */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Connecting Learners to Knowledge</h1>
            <p>An integrated learning hub helping students gain practical knowledge and interview experience to stand out in their careers</p>
            <button className="cta-button">Get Started</button>
          </div>
          
          <div className="stats-section">
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

      {/* Features Section */}
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

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 CoursePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default landingPage;