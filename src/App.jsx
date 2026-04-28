// src/App.jsx
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tutorial from './pages/Tutorial'
import Socials from './pages/Socials'

function App() {
  const [lang, setLang] = useState('zh')

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar lang={lang} onLangChange={setLang} />
      <main className="app-main flex-1">
        <Routes>
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/tutorial" element={<Tutorial lang={lang} />} />
          <Route path="/socials" element={<Socials lang={lang} />} />
        </Routes>
      </main>
      <Footer lang={lang} />
    </div>
  )
}

export default App
