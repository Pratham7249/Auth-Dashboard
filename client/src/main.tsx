import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('Main.tsx executing...');

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log('App mounted successfully');
} catch (err) {
  console.error('Error mounting App:', err);
  document.body.innerHTML = `<h1>Fatal Error in Main</h1><pre>${err}</pre>`
}


