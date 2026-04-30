import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DevErrorBoundary } from './ui/components/DevErrorBoundary.tsx'

const app = import.meta.env.DEV ? (
  <DevErrorBoundary>
    <App />
  </DevErrorBoundary>
) : (
  <App />
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>{app}</StrictMode>,
)
