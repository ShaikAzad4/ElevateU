import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Courses from './components/Courses';
import MyCourse from './components/MyCourse';
import About from './components/About';
import Contact from './components/Contact';
import './App.css';
import { BubbleChat } from 'flowise-embed-react'
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import NoAbout from './components/NoAbout.jsx'
import NoContact from './components/NoContact.jsx'
import ScrollToTop from "./components/ScrollToTop";
import CourseDetail from "./components/CourseDetails.jsx";
import AfterAuth from './components/AfterAuth.jsx';
import Response from './components/response.jsx';
import AdminPage from './components/AdminPage.jsx';
function App() {
  return (
    <Router>
      <ScrollToTop />
      <BubbleChat
        chatflowid="76037c3f-89d7-4a13-8719-09c180361eb2"
        apiHost="https://cloud.flowiseai.com"
        theme={{
          button: {
            backgroundColor: '#ff9800',  // same orange as your theme
            iconColor: '#ffffff',        // white icon
            size: '60px',                // optional, bubble size
          },
          chatWindow: {
            backgroundColor: '#fff7ef',  // soft orange background (optional)
            textColor: '#5d4037',        // dark brownish text (matches theme)
            headerBackgroundColor: '#ff9800', // orange chat header
            headerTextColor: '#ffffff',       // white header text
            sendButtonColor: '#ff9800',       // orange send button
          },
        }}
      />

      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/mycourse" element={<MyCourse />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up/*" element={<Signup />} />
          <Route path="/Nocontact" element={<NoContact />} />
          <Route path="/NoAbout" element={<NoAbout />} />
          <Route path="/response" element={<Response />} />
          <Route path="/courses/:courseId" element={<CourseDetail />}/>
          <Route path="/after-auth" element={<AfterAuth />} />
          <Route path="/admin" element={<AdminPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;