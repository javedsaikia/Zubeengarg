import { useState } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Voice from './components/Voice'
import Timeline from './components/Timeline'
import Legacy from './components/Legacy'
import Tribute from './components/Tribute'
import Footer from './components/Footer'
import Loading from './components/Loading'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <main
        className={`relative bg-black text-lav-100 transition-opacity duration-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Nav />
        <Hero />
        <Intro />
        <Voice />
        <Timeline />
        <Legacy />
        <Tribute />
        <Footer />
      </main>
      {!loaded && <Loading onDone={() => setLoaded(true)} />}
    </>
  )
}