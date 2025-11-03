import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const NoContact = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="app">
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
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Get In Touch</h1>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h3>Email</h3>
                  <p>support@elevateu.com</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h3>Address</h3>
                  <p>123 Education Street<br />Learning City, LC 12345</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div>
                  <h3>Business Hours</h3>
                  <p>Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
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
              <p>Need immediate help? I can answer your questions right now!</p>
            </div>
          </div>
          <div className="chatbot-input">
            <input type="text" placeholder="How can I help you?" />
            <button className="send-button">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoContact;