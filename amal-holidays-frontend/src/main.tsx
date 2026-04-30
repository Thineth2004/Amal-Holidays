import { createRoot } from 'react-dom/client'
import { AuthProvider } from './contexts/AuthProvider'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
