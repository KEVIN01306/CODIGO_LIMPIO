import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.tsx'
import { AppThemeProvider } from './core/theme/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <App />
    </AppThemeProvider>
  </StrictMode>,
)
