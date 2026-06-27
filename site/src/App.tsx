import { LanguageProvider } from './i18n/LanguageContext'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'

export default function App() {
  return (
    <LanguageProvider>
      <div id="top" className="min-h-screen bg-white font-sans text-gray-900">
        <Navbar />
        <main>
          <Hero />
        </main>
      </div>
    </LanguageProvider>
  )
}
