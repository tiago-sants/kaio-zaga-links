import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SmokeOverlay from './SmokeOverlay'
import { config } from '../config'
import './VideoSection.css'

gsap.registerPlugin(ScrollTrigger)

const VideoSection = () => {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const overlayRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const loadingAttemptedRef = useRef(false)
  const playingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
    layoutEffect: false // Desabilita layoutEffect para evitar warning de posição estática
  })

  // Transformações baseadas no scroll - removido scale para não cortar o vídeo
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1])
  const videoOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 1, 0.9])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 0.4, 0.7])
  const overlayBlur = useTransform(scrollYProgress, [0, 1], [15, 25])
  const darkenOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.4, 0.3])

  // Estado para controlar visibilidade do vídeo
  const [videoReady, setVideoReady] = useState(false)

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Carregar vídeo e controlar play/pause baseado na visibilidade
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    loadingAttemptedRef.current = true
    setIsLoading(true)

    const handlePlaying = () => {
      setVideoLoaded(true)
      setIsLoading(false)
      setIsPlaying(true)
      playingRef.current = true
    }

    const handlePause = () => {
      setIsPlaying(false)
      playingRef.current = false
    }

    const handleLoadedData = () => {
      setVideoReady(true)
      setVideoLoaded(true)
      setIsLoading(false)
    }

    const handleCanPlay = () => {
      setVideoLoaded(true)
      setIsLoading(false)
    }

    const handleWaiting = () => {
      setIsLoading(true)
    }

    const handleError = (e) => {
      console.error('Erro ao carregar vídeo:', e)
      setIsLoading(false)
      setVideoLoaded(false)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
    }

    // Adicionar listeners
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('pause', handlePause)
    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('error', handleError)
    video.addEventListener('loadstart', handleLoadStart)

    // Forçar carregamento do vídeo
    video.load()

    // Intersection Observer para controlar play/pause e carregamento
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Seção está visível - carregar e reproduzir vídeo
            if (video.readyState === 0) {
              // Vídeo ainda não começou a carregar
              video.load()
            }

            // Tentar reproduzir quando estiver pronto
            if (video.readyState >= 2) {
              const playPromise = video.play()
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    setVideoLoaded(true)
                    setIsLoading(false)
                    playingRef.current = true
                  })
                  .catch((error) => {
                    console.log('Autoplay bloqueado, aguardando interação do usuário:', error)
                    // No mobile, pode ser necessário interação do usuário
                    // Marca como carregado mas não tocando ainda
                    if (video.readyState >= 3) {
                      setVideoLoaded(true)
                      setIsLoading(false)
                    }
                    // Tenta novamente quando o usuário interagir
                    const tryPlayOnInteraction = () => {
                      video.play()
                        .then(() => {
                          setVideoLoaded(true)
                          setIsLoading(false)
                          playingRef.current = true
                        })
                        .catch(() => { })
                      document.removeEventListener('touchstart', tryPlayOnInteraction)
                      document.removeEventListener('touchend', tryPlayOnInteraction)
                      document.removeEventListener('click', tryPlayOnInteraction)
                    }
                    document.addEventListener('touchstart', tryPlayOnInteraction, { once: true, passive: true })
                    document.addEventListener('touchend', tryPlayOnInteraction, { once: true, passive: true })
                    document.addEventListener('click', tryPlayOnInteraction, { once: true })
                  })
              }
            } else {
              // Vídeo ainda não está pronto, aguardar
              const waitForReady = () => {
                if (video.readyState >= 2) {
                  video.play()
                    .then(() => {
                      setVideoLoaded(true)
                      setIsLoading(false)
                      playingRef.current = true
                    })
                    .catch(() => {
                      // Autoplay bloqueado, mas vídeo está carregado
                      if (video.readyState >= 3) {
                        setVideoLoaded(true)
                        setIsLoading(false)
                      }
                    })
                } else {
                  setTimeout(waitForReady, 100)
                }
              }
              waitForReady()
            }
          } else {
            // Seção não está visível - pausar vídeo
            if (!video.paused) {
              video.pause()
            }
          }
        })
      },
      {
        threshold: 0.3, // Reduzido para mobile - vídeo toca quando 30% está visível
        rootMargin: '50px' // Começa a carregar antes de ficar totalmente visível
      }
    )

    observer.observe(section)

    // Preload quando a seção estiver próxima (para mobile)
    const preloadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && video.readyState === 0) {
            // Seção está próxima e vídeo não começou a carregar
            video.load()
          }
        })
      },
      {
        rootMargin: '200px' // Começa a carregar quando está a 200px de ficar visível
      }
    )

    preloadObserver.observe(section)

    return () => {
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadstart', handleLoadStart)
      observer.disconnect()
      preloadObserver.disconnect()
    }
  }, [isMobile])

  useEffect(() => {
    // Garantir que a seção está visível desde o início
    if (sectionRef.current) {
      sectionRef.current.style.opacity = '1'
      sectionRef.current.style.visibility = 'visible'
    }

    // Animação de entrada da seção (sem esconder inicialmente)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    tl.from(sectionRef.current, {
      y: 50,
      duration: 1.5,
      ease: 'power3.out'
    })

    // Animações de scroll desabilitadas para manter vídeo centralizado
    // O vídeo permanece centralizado sem animações de movimento

    // Animações para o overlay de fumaça
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true
        },
        opacity: 0.8,
        ease: 'none'
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  // Scroll tipo TikTok - Volta para Hero ao arrastar/scrollar para cima
  useEffect(() => {
    const videoSection = sectionRef.current
    if (!videoSection) return

    let touchStartY = 0
    let touchEndY = 0
    let isScrolling = false
    let wheelAccumulator = 0
    let wheelTimeout = null

    // Verificar se está na seção video
    const isInVideoSection = () => {
      if (!videoSection) return false
      const rect = videoSection.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // Verifica se a seção video está visível (pelo menos parte dela)
      return rect.top < windowHeight && rect.bottom > 0 &&
        (rect.top <= windowHeight * 0.7)
    }

    // Scroll instantâneo para seção anterior (Hero)
    const scrollToPreviousSection = () => {
      if (isScrolling) return
      isScrolling = true

      const heroSection = document.querySelector('#hero-section')
      if (heroSection) {
        // Usa scrollTo para comportamento instantâneo tipo TikTok
        const heroTop = heroSection.offsetTop
        window.scrollTo({
          top: heroTop,
          behavior: 'instant'
        })

        // Fallback caso behavior: 'instant' não seja suportado
        if (window.scrollY !== heroTop) {
          heroSection.scrollIntoView({ behavior: 'auto', block: 'start' })
        }
      } else {
        // Fallback: scroll para cima
        window.scrollTo({
          top: window.scrollY - window.innerHeight,
          behavior: 'instant'
        })
      }

      // Reset após um tempo
      setTimeout(() => {
        isScrolling = false
        wheelAccumulator = 0
      }, 500)
    }

    // Handler para scroll com mouse (wheel) - Desktop
    const handleWheel = (e) => {
      if (!isInVideoSection()) {
        wheelAccumulator = 0
        return
      }

      // Scroll para cima (deltaY < 0) - volta para Hero
      if (e.deltaY < 0) {
        e.preventDefault()
        e.stopPropagation()

        // Acumula o movimento do scroll (valor negativo, então usa Math.abs)
        wheelAccumulator += Math.abs(e.deltaY)

        // Se acumulou movimento suficiente (scroll intencional)
        if (wheelAccumulator > 50 && !isScrolling) {
          scrollToPreviousSection()
          wheelAccumulator = 0
        }

        // Reset acumulador após um tempo
        clearTimeout(wheelTimeout)
        wheelTimeout = setTimeout(() => {
          wheelAccumulator = 0
        }, 150)
      } else {
        // Scroll para baixo - reseta acumulador
        wheelAccumulator = 0
      }
    }

    // Handler para touch (mobile) - Swipe para baixo (voltar)
    const handleTouchStart = (e) => {
      if (!isInVideoSection()) return
      touchStartY = e.touches[0].clientY
      touchEndY = touchStartY
    }

    const handleTouchMove = (e) => {
      if (!isInVideoSection() || isScrolling) return
      touchEndY = e.touches[0].clientY
    }

    const handleTouchEnd = () => {
      if (!isInVideoSection() || isScrolling) return

      const touchDiff = touchStartY - touchEndY

      // Se arrastou para baixo (swipe down) mais de 50px - volta para Hero
      if (touchDiff < -50) {
        scrollToPreviousSection()
      }

      // Reset
      touchStartY = 0
      touchEndY = 0
    }

    // Adicionar listeners no window para capturar eventos mesmo se o mouse estiver fora
    const handleWindowWheel = (e) => {
      if (isInVideoSection()) {
        handleWheel(e)
      }
    }

    // Adicionar listeners
    window.addEventListener('wheel', handleWindowWheel, { passive: false })
    videoSection.addEventListener('touchstart', handleTouchStart, { passive: true })
    videoSection.addEventListener('touchmove', handleTouchMove, { passive: true })
    videoSection.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleWindowWheel)
      videoSection.removeEventListener('touchstart', handleTouchStart)
      videoSection.removeEventListener('touchmove', handleTouchMove)
      videoSection.removeEventListener('touchend', handleTouchEnd)
      if (wheelTimeout) {
        clearTimeout(wheelTimeout)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} id="video-section" className="video-section" style={{ opacity: 1, visibility: 'visible' }}>
      {/* Container do vídeo */}
      <div className="video-container">
        <video
          ref={videoRef}
          className="video-background"
          loop
          muted
          playsInline
          preload={isMobile ? "metadata" : "auto"}
          onPlaying={() => {
            setVideoLoaded(true)
            setIsLoading(false)
          }}
          onCanPlay={() => {
            setVideoLoaded(true)
            setIsLoading(false)
          }}
          onWaiting={() => setIsLoading(true)}
          onError={(e) => {
            console.error('Erro no vídeo:', e)
            setIsLoading(false)
          }}
        >
          <source src={config.profile.video} type="video/mp4" />
          Seu navegador não suporta vídeos HTML5.
        </video>
      </div>

      {/* Overlay de fumaça atmosférica */}
      <motion.div
        ref={overlayRef}
        className="smoke-overlay-container"
        style={{
          opacity: overlayOpacity,
          filter: `blur(${overlayBlur}px)`
        }}
      >
        <SmokeOverlay />
      </motion.div>

      {/* Overlay de escurecimento dinâmico */}
      <motion.div
        className="video-darken-overlay"
        style={{
          opacity: darkenOpacity
        }}
      />

      {/* Elementos decorativos flutuantes */}
      <div className="video-decorative-elements">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className={`video-decorative-circle video-circle-${i + 1}`}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8
            }}
          />
        ))}
      </div>

      {/* Indicador de carregamento - escondido após vídeo começar */}
      {(isLoading || !videoLoaded) && (
        <div className="video-loading">
          <div className="loading-spinner" />
          {isMobile && (
            <p className="loading-text">Carregando vídeo...</p>
          )}
        </div>
      )}

      {/* Overlay clicável para mobile quando vídeo está carregado mas não tocando */}
      {isMobile && videoLoaded && !isPlaying && (
        <div
          className="video-play-overlay"
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  setIsPlaying(true)
                  playingRef.current = true
                })
                .catch(() => { })
            }
          }}
        >
          <div className="play-button">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
            </svg>
          </div>
          <p className="play-text">Toque para reproduzir</p>
        </div>
      )}
    </section>
  )
}

export default VideoSection

