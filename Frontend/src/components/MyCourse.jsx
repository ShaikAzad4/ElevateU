import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MyCourse.css';

const MyCourse = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const enrolledCourses = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      progress: 75,
      nextLesson: "React Hooks",
      dueDate: "2024-01-15",
      instructor: "John Doe",
      thumbnail: "🌐"
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      progress: 45,
      nextLesson: "Data Visualization",
      dueDate: "2024-01-20",
      instructor: "Jane Smith",
      thumbnail: "📊"
    }
  ];

  const completedCourses = [
    {
      id: 3,
      title: "Python for Beginners",
      completionDate: "2023-12-01",
      certificate: true,
      thumbnail: "🐍"
    }
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
            <Link to="/mycourse" className="active">MyCourse</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <div>
            <button className="login-btn">Logout</button>
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
          <div className="learning-stats">
            <div className="stat-card">
              <h3>Courses in Progress</h3>
              <p className="stat-number">{enrolledCourses.length}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Courses</h3>
              <p className="stat-number">{completedCourses.length}</p>
            </div>
            <div className="stat-card">
              <h3>Learning Hours</h3>
              <p className="stat-number">42</p>
            </div>
          </div>

          <div className="courses-section">
            <h2>Continue Learning</h2>
            <div className="enrolled-courses">
              {enrolledCourses.map(course => (
                <div key={course.id} className="course-progress-card">
                  <div className="course-thumbnail">
                    <span>{course.thumbnail}</span>
                  </div>
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p>Instructor: {course.instructor}</p>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${course.progress}%`}}
                        ></div>
                      </div>
                      <span className="progress-text">{course.progress}% Complete</span>
                    </div>
                    <div className="course-next">
                      <p>Next: {course.nextLesson}</p>
                      <p>Due: {course.dueDate}</p>
                    </div>
                    <button className="continue-btn">Continue Learning</button>
                  </div>
                </div>
              ))}
            </div>

            <h2>Completed Courses</h2>
            <div className="completed-courses">
              {completedCourses.map(course => (
                <div key={course.id} className="completed-course-card">
                  <div className="course-thumbnail">
                    <span>{course.thumbnail}</span>
                  </div>
                  <div className="course-details">
                    <h3>{course.title}</h3>
                    <p>Completed on: {course.completionDate}</p>
                    {course.certificate && (
                      <button className="certificate-btn">Download Certificate</button>
                    )}
                  </div>
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
              <p>Need help with your courses? I'm here to assist!</p>
            </div>
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Ask about your courses..." />
            <button className="send-button">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourse;

