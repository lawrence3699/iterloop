import { LanguageProvider } from './i18n/LanguageContext'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { TerminalDemo } from './components/TerminalDemo'
import { HowItWorks } from './components/HowItWorks'
import { Features } from './components/Features'
import { QuickStart } from './components/QuickStart'
import { Usage } from './components/Usage'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <LanguageProvider>
      <div id="top" className="min-h-screen bg-white font-sans text-gray-900">
        <Navbar />
        <main>
          <Hero />
          <div className="-mt-10 px-5 sm:-mt-14">
            <TerminalDemo />
          </div>
          <HowItWorks />
          <Features />
          <QuickStart />
          <Usage />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}
