import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Router>
      <Routes>
        <Route path="/Nocontact" element={<NoAbout />} />
        <Route path="/NoAbout" element={< NoContact/>} />
      </Routes>
    </Router> */}
  </StrictMode>,
)
