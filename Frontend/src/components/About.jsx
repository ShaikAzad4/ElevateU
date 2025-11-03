import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const teamMembers = [
    { name: "Ameer", role: "Founder & CEO", bio: "10+ years in EdTech", avatar: "👨‍💼" },
    { name: "Dhanush", role: "Head of Instruction", bio: "Former Google Lead Instructor", avatar: "🧑‍🎓" },
    { name: "Venkatesh", role: "CTO", bio: "Expert in Learning Platforms", avatar: "👨‍💻" },
    { name: "Azad", role: "Student Success", bio: "Dedicated to learner outcomes", avatar: "👨🏼‍🎓" },
    { name: "Teja", role: "Team Leader", bio: "Leads TO SOLVE IT Problems", avatar: "🦸‍♂️" },
    { name: "Vamsi", role: "Tutor", bio: "Teaches several Techs", avatar: "🦹‍♂️" }
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">
            <h2>ElevateU</h2>
          </div>
          <nav className="nav">
            <Link to="/courses">Courses</Link>
            <Link to="/mycourse">MyCourse</Link>
            <Link to="/about" className="active">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <div>
            <button className="login-btn">Logout</button>
          </div>
        </div>
      </header>

      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About ElevateU</h1>
            <p>Transforming education through innovative learning solutions</p>
          </div>
        </div>
      </section>

      <section className="about-content">
        <div className="container">
          <div className="about-section">
            <h2>Our Mission</h2>
            <p>
              At ElevateU, we believe that education should be accessible, engaging, and transformative. 
              Our mission is to bridge the gap between traditional education and industry requirements, 
              providing students with practical skills that prepare them for successful careers.
            </p>
          </div>

          <div className="about-section">
            <h2>Our Story</h2>
            <p>
              Founded in 2020, ElevateU started as a small initiative to help students gain practical 
              skills alongside their academic education. Today, we've grown into a comprehensive learning 
              platform serving thousands of students worldwide, with a focus on quality instruction and 
              student success.
            </p>
          </div>

          <div className="about-section">
            <h2>What Makes Us Different</h2>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">🎯</div>
                <h3>Industry-Focused</h3>
                <p>Courses designed with current industry requirements in mind</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🤝</div>
                <h3>Personalized Support</h3>
                <p>One-on-one mentorship and dedicated student success team</p>
              </div>
              <div className="feature">
                <div className="feature-icon">💼</div>
                <h3>Career Services</h3>
                <p>Comprehensive career support including resume reviews and interview prep</p>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Meet Our Team</h2>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-card">
                  <div className="team-avatar">
                    <span>{member.avatar}</span>
                  </div>
                  <h3>{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-bio">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 ElevateU. All rights reserved.</p>
        </div>
      </footer>

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
              <p>Want to know more about us? Ask me anything!</p>
            </div>
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Ask about ElevateU..." />
            <button className="send-button">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;