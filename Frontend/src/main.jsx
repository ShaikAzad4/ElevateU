import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';   
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      telemetry={false}
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#7c3aed',
          borderRadius: '12px',
        },
        layout: {
          socialButtonsVariant: 'iconButton',
          shimmer: true,
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
