import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Root element #root not found in document')
}

createRoot(container).render(<App />)
