import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './styles.css'

const Router = import.meta.env.BASE_URL === '/' ? BrowserRouter : HashRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
  })
}
