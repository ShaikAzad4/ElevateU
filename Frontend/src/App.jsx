import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import ProtectedRoute from "./components/ProtectedRoute";
import AddCourse from "./components/AddCourse.jsx";
import Home from "./components/Home";
import Courses from "./components/Courses";
import MyCourse from "./components/MyCourse";
import About from "./components/About";
import Contact from "./components/Contact";
import "./App.css";
import CourseList from "./components/CourseList.jsx";
import { BubbleChat } from "flowise-embed-react";
import Login from "./components/Login.jsx";      // should render <SignIn routing="path" path="/login/*" ... />
import Signup from "./components/Signup.jsx";    // renders <SignUp routing="path" path="/sign-up/*" ... />
import NoAbout from "./components/NoAbout.jsx";
import NoContact from "./components/NoContact.jsx";
import ScrollToTop from "./components/ScrollToTop";
import CourseDetail from "./components/CourseDetails.jsx";
import AfterAuth from "./components/AfterAuth.jsx";
import Response from "./components/response.jsx";
import AdminPage from "./components/AdminPage.jsx";
import JavaProgress from "./components/JavaProgress.jsx";
import PythonProgress from "./components/PythonProgress.jsx";
import AiTutor from "./components/AiTutor.jsx";

function App() {
  return (
    <Router>
      <ScrollToTop />

      <BubbleChat
        chatflowid="76037c3f-89d7-4a13-8719-09c180361eb2"
        apiHost="https://cloud.flowiseai.com"
        theme={{
          button: {
            backgroundColor: "#ff9800",
            iconColor: "#ffffff",
            size: "60px",
          },
          chatWindow: {
            backgroundColor: "#fff7ef",
            textColor: "#5d4037",
            headerBackgroundColor: "#ff9800",
            headerTextColor: "#ffffff",
            sendButtonColor: "#ff9800",
          },
        }}
      />

      <div className="App">
        <Routes>
          {/* App routes */}
          <Route path="/" element={<Home />} />
          <Route path="/addcourse" element={<AddCourse />} />
          <Route path="/courses" element={
            <ProtectedRoute>
            <Courses />
            </ProtectedRoute>
            } />
          <Route path="/mycourse" element={
            <ProtectedRoute>
            <MyCourse />
            </ProtectedRoute>
            } />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Nocontact" element={<NoContact />} />
          <Route path="/NoAbout" element={<NoAbout />} />
          <Route path="/response" element={<Response />} />
          <Route path="/courses/:courseId" element={
            <ProtectedRoute>
            <CourseDetail />
            </ProtectedRoute>
            } />
          <Route path="/after-auth" element={<AfterAuth />} />
          <Route path="/admin" element={
            <ProtectedRoute>
            <AdminPage />
            </ProtectedRoute>
            } />

          <Route path="/java-progress" element={
            <ProtectedRoute>
            <JavaProgress />
            </ProtectedRoute>
            } />

          <Route path="/python-progress" element={
            <ProtectedRoute>
            <PythonProgress />
            </ProtectedRoute>
            } />

          <Route path="/ai-tutor" element={
            <ProtectedRoute>
            <AiTutor />
            </ProtectedRoute>
            } />

          {/* Auth pages */}
          <Route path="/login/*" element={<Login />} />
          <Route path="/sign-up/*" element={<Signup />} />

          {/* OAuth/SSO callback(s) */}
          <Route path="/login/sso-callback" element={<AuthenticateWithRedirectCallback />} />
          <Route path="/sign-up/sso-callback" element={<AuthenticateWithRedirectCallback />} />
          {/* (optional) also handle /sso-callback if your provider redirects there */}
          {/* <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
