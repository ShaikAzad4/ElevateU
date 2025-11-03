import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ElevateUAuth.css';

const ElevateUAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login attempt:', { email: formData.email, password: formData.password });
      // Handle login logic
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      console.log('Signup attempt:', formData);
      // Handle signup logic
    }
  };

  return (
    <div className="elevateu-auth-container">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <h2>ElevateU</h2>
          </div>
          <nav className="nav">
            <Link to="/courses">Courses</Link>
            <Link to="/mycourse">MyCourse</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <div className="header-auth-buttons">
            <Link style={{color:'white',textDecoration:"None"
            }} 
              className={`login-btn ${isLogin ? 'active' : ''}`} 
              to="#" 
              onClick={() => setIsLogin(true)}
            >
              Login
            </Link>
            <Link style={{color:'white',textDecoration:"None"
            }} 
              className={`login-btn ${!isLogin ? 'active' : ''}`} 
              to="#" 
              onClick={() => setIsLogin(false)}
            >
              SignUp
            </Link>
          </div>
        </div>
      </header>

      <div className="auth-main">
        {/* Left Section - Hero */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Connecting Learners to Knowledge</h1>
            <p className="hero-description">
              An integrated learning hub helping students gain practical knowledge and interview experience to stand out in their careers.
            </p>
            
            <div className="stats-section">
              <div className="get-started">
                <h3>Get Started</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-number">+38k</div>
                    <div className="stat-label">Happy Students</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">+45k</div>
                    <div className="stat-label">Courses Completed</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">100%</div>
                    <div className="stat-label">Student Satisfaction</div>
                  </div>
                </div>
              </div>
              
              <div className="balance-stats">
                <div className="balance-amount">Balance Stats $4200</div>
                <div className="payment-info">Payment on Internet</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Auth Form */}
        <div className="auth-section">
          <div className="auth-form-container">
            <div className="form-header">
              <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
              <p>{isLogin ? 'Sign in to continue your learning journey' : 'Join thousands of successful learners'}</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                </div>
              )}

              {isLogin && (
                <div className="form-options">
                  <label className="checkbox-container">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                  <a href="#forgot" className="forgot-password">Forgot Password?</a>
                </div>
              )}

              <button type="submit" className="submit-btn">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>

              <div className="auth-divider">
                <span>Or continue with</span>
              </div>

              <div className="social-auth">
                <button type="button" className="social-btn google-btn">
                  <span>Google</span>
                </button>
                <button type="button" className="social-btn facebook-btn">
                  <span>Facebook</span>
                </button>
              </div>

              <div className="auth-switch">
                <p>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <span 
                    className="switch-link"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElevateUAuth;