import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#18103A',
              border: '1.5px solid #E5DFF5',
              borderRadius: '18px',
              padding: '14px 20px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 20px 60px rgba(124,58,237,.18)',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#ECFDF5' }
            },
            error: {
              iconTheme: { primary: '#FF5757', secondary: '#FFF0F0' }
            }
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)