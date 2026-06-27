import { LanguageProvider } from './i18n/LanguageContext'
import { Navbar } from './components/Navbar'

export default function App() {
  return (
    <LanguageProvider>
      <div id="top" className="min-h-screen bg-white font-sans text-gray-900">
        <Navbar />
      </div>
    </LanguageProvider>
  )
}
