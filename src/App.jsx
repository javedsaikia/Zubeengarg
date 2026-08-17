import Nav from './components/Nav'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Voice from './components/Voice'
import Timeline from './components/Timeline'
import Legacy from './components/Legacy'
import Tribute from './components/Tribute'
import Footer from './components/Footer'

export default function App() {
  return (
    <main className="bg-black text-lav-100">
      <Nav />
      <Hero />
      <Intro />
      <Voice />
      <Timeline />
      <Legacy />
      <Tribute />
      <Footer />
    </main>
  )
}
