import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'
import { Fragment } from 'react/jsx-runtime'

createRoot(document.getElementById('root')!).render(
  <Fragment>
    <App />
    <Toaster position='bottom-center' />
  </Fragment>
)
