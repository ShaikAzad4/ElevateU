import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Courses from './components/Courses';
import MyCourse from './components/MyCourse';
import About from './components/About';
import Contact from './components/Contact';
import ElevateUAuth from './components/ElevateUAuth'
import './App.css';
import NoAbout from './components/NoAbout.jsx'
import NoContact from './components/NoContact.jsx'
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/mycourse" element={<MyCourse />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={< ElevateUAuth/>} />
          <Route path="/Nocontact" element={<NoContact />} />
          <Route path="/NoAbout" element={<NoAbout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;