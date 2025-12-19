import { useEffect } from 'react'
import Hero from './components/Hero'
import VideoSection from './components/VideoSection'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // Configuração global do GSAP
    gsap.config({
      nullTargetWarn: false,
      trialWarn: false,
    })
    
    // Debug
    console.log('App carregado')
  }, [])

  return (
    <div className="app" style={{ background: '#000000', minHeight: '100vh', width: '100%' }}>
      <Hero />
      <VideoSection />
    </div>
  )
}

export default App

