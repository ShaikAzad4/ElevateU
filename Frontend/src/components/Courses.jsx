import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Courses.css";

const Courses = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const courses = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      description:
        "Learn full-stack web development with HTML, CSS, JavaScript, React, and Node.js",
      price: "$299",
      duration: "12 weeks",
      level: "Beginner",
      rating: 4.8,
      students: 12500,
      image: "🌐",
      category: "web",
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      description:
        "Master data analysis, visualization, and machine learning with Python",
      price: "$399",
      duration: "16 weeks",
      level: "Intermediate",
      rating: 4.9,
      students: 8900,
      image: "📊",
      category: "data",
    },
    {
      id: 3,
      title: "Machine Learning & AI",
      description: "Comprehensive machine learning algorithms and AI concepts",
      price: "$449",
      duration: "18 weeks",
      level: "Advanced",
      rating: 4.9,
      students: 6700,
      image: "🤖",
      category: "ai",
    },
    {
      id: 4,
      title: "Python Programming",
      description:
        "From basics to advanced Python programming and applications",
      price: "$199",
      duration: "8 weeks",
      level: "Beginner",
      rating: 4.7,
      students: 15200,
      image: "🐍",
      category: "programming",
    },
    {
      id: 5,
      title: "Java Development",
      description: "Object-oriented programming with Java and Spring Framework",
      price: "$349",
      duration: "14 weeks",
      level: "Intermediate",
      rating: 4.6,
      students: 8300,
      image: "☕",
      category: "programming",
    },
    {
      id: 6,
      title: "Data Analytics",
      description: "Data analysis, SQL, and business intelligence tools",
      price: "$329",
      duration: "10 weeks",
      level: "Beginner",
      rating: 4.5,
      students: 7200,
      image: "📈",
      category: "data",
    },
    {
      id: 7,
      title: "Generative AI",
      description:
        "Learn GPT models, diffusion models, and creative AI applications",
      price: "$499",
      duration: "12 weeks",
      level: "Advanced",
      rating: 4.9,
      students: 4500,
      image: "🎨",
      category: "ai",
    },
    {
      id: 8,
      title: "Cloud Computing & AWS",
      description: "Master cloud infrastructure, deployment, and AWS services",
      price: "$449",
      duration: "16 weeks",
      level: "Intermediate",
      rating: 4.8,
      students: 5400,
      image: "☁️",
      category: "cloud",
    },
    {
      id: 9,
      title: "Cybersecurity Fundamentals",
      description: "Network security, ethical hacking, and threat protection",
      price: "$399",
      duration: "14 weeks",
      level: "Intermediate",
      rating: 4.7,
      students: 6100,
      image: "🔒",
      category: "security",
    },
    {
      id: 10,
      title: "Mobile App Development",
      description: "Build cross-platform mobile applications with React Native",
      price: "$349",
      duration: "14 weeks",
      level: "Intermediate",
      rating: 4.7,
      students: 7500,
      image: "📱",
      category: "mobile",
    },
    {
      id: 11,
      title: "DevOps & CI/CD",
      description: "Docker, Kubernetes, Jenkins, and deployment pipelines",
      price: "$429",
      duration: "15 weeks",
      level: "Advanced",
      rating: 4.8,
      students: 4800,
      image: "⚙️",
      category: "devops",
    },
    {
      id: 12,
      title: "UI/UX Design Masterclass",
      description: "User-centered design principles, Figma, and prototyping",
      price: "$279",
      duration: "10 weeks",
      level: "Beginner",
      rating: 4.6,
      students: 6200,
      image: "🎯",
      category: "design",
    },
  ];

  const filteredCourses =
    activeFilter === "all"
      ? courses
      : courses.filter(
          (course) => course.level.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="logo">
            <h2>ElevateU</h2>
          </div>
          <nav className="nav">
            <Link to="/courses" className="active">
              Courses
            </Link>
            <Link to="/mycourse">MyCourse</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <div>
            <button className="login-btn">Logout</button>
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
          <div className="courses-filters">
            <button
              className={`filter-btn ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All Courses
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "beginner" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("beginner")}
            >
              Beginner
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "intermediate" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("intermediate")}
            >
              Intermediate
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "advanced" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("advanced")}
            >
              Advanced
            </button>
          </div>

          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-image">
                  <span className="course-emoji">{course.image}</span>
                  <div className="course-level">{course.level}</div>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <div className="course-meta">
                    <span className="duration">⏱️ {course.duration}</span>
                    <span className="rating">⭐ {course.rating}</span>
                  </div>
                  <div className="course-stats">
                    <span className="students">
                      👥 {course.students.toLocaleString()} students
                    </span>
                  </div>

                  <div className="course-footer">
                    <span className="price">{course.price}</span>
                    <Link
                      to={`/courses/${course.title
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")}`}
                      className="enroll-btn"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 ElevateU. All rights reserved.</p>
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
            <button className="close-chat" onClick={toggleChat}>
              ×
            </button>
          </div>
          <div className="chatbot-messages">
            <div className="message bot-message">
              <p>
                Hello! I can help you choose the right course. What are you
                interested in learning?
              </p>
            </div>
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="Ask about courses..." />
            <button className="send-button">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
