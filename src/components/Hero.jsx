import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SocialButton from './SocialButton'
import { config } from '../config'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
    const heroRef = useRef(null)
    const menuRef = useRef(null)
    const containerRef = useRef(null)

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    // Valores de movimento do mouse para efeitos 3D
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 50, stiffness: 100 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    // Rotação 3D baseada na posição do mouse
    const rotateX = useTransform(y, [-0.5, 0.5], [5, -5])
    const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5])

    useEffect(() => {
        // Verificar se é mobile
        const isMobile = window.innerWidth <= 768

        // Garantir que os elementos estão visíveis desde o início
        if (heroRef.current) {
            heroRef.current.style.opacity = '1'
            heroRef.current.style.visibility = 'visible'
        }

        // Animação inicial de entrada após um pequeno delay
        const timer = setTimeout(() => {
            const tl = gsap.timeline()

            if (heroRef.current) {
                tl.from(heroRef.current, {
                    y: isMobile ? 10 : 15,
                    duration: isMobile ? 0.4 : 0.6,
                    ease: 'power2.out'
                }, 0)
            }

            if (menuRef.current?.children && menuRef.current.children.length > 0) {
                tl.from(menuRef.current.children, {
                    y: isMobile ? 10 : 15,
                    stagger: isMobile ? 0.04 : 0.06,
                    duration: isMobile ? 0.4 : 0.5,
                    ease: 'power2.out'
                }, 0.3)
            }
        }, 100)

        return () => {
            clearTimeout(timer)
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars?.trigger === heroRef.current) {
                    trigger.kill()
                }
            })
        }
    }, [])

    // Rastrear movimento do mouse para efeitos 3D (desabilitado no mobile)
    useEffect(() => {
        // Verificar se é mobile
        const isMobile = window.innerWidth <= 768
        if (isMobile) return // Desabilitar efeitos 3D no mobile

        const handleMouseMove = (e) => {
            if (!containerRef.current) return

            const rect = containerRef.current.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            const normalizedX = (e.clientX - centerX) / (rect.width / 2)
            const normalizedY = (e.clientY - centerY) / (rect.height / 2)

            mouseX.set(normalizedX * 0.1)
            mouseY.set(normalizedY * 0.1)

            setMousePosition({
                x: (e.clientX - centerX) / (rect.width / 2),
                y: (e.clientY - centerY) / (rect.height / 2)
            })
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener('mousemove', handleMouseMove)
            return () => container.removeEventListener('mousemove', handleMouseMove)
        }
    }, [mouseX, mouseY])

    // Scroll tipo TikTok - Vai direto para próxima seção ao arrastar/scrollar para cima
    useEffect(() => {
        const heroSection = containerRef.current
        if (!heroSection) return

        let touchStartY = 0
        let touchEndY = 0
        let isScrolling = false
        let wheelAccumulator = 0
        let wheelTimeout = null

        // Verificar se está na seção hero
        const isInHeroSection = () => {
            if (!heroSection) return false
            const rect = heroSection.getBoundingClientRect()
            const windowHeight = window.innerHeight
            // Verifica se a seção hero está visível (pelo menos parte dela)
            return rect.top < windowHeight && rect.bottom > 0 &&
                (rect.top <= windowHeight * 0.7 || window.scrollY === 0)
        }

        // Scroll instantâneo para próxima seção
        const scrollToNextSection = () => {
            if (isScrolling) return
            isScrolling = true

            const videoSection = document.querySelector('#video-section')
            if (videoSection) {
                // Usa scrollTo para comportamento instantâneo tipo TikTok
                const videoTop = videoSection.offsetTop
                window.scrollTo({
                    top: videoTop,
                    behavior: 'instant'
                })

                // Fallback caso behavior: 'instant' não seja suportado
                if (window.scrollY !== videoTop) {
                    videoSection.scrollIntoView({ behavior: 'auto', block: 'start' })
                }
            } else {
                // Fallback: scroll para baixo
                window.scrollTo({
                    top: window.scrollY + window.innerHeight,
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
            if (!isInHeroSection()) {
                wheelAccumulator = 0
                return
            }

            // Scroll para baixo (deltaY > 0) - vai para próxima seção
            if (e.deltaY > 0) {
                e.preventDefault()
                e.stopPropagation()

                // Acumula o movimento do scroll
                wheelAccumulator += e.deltaY

                // Se acumulou movimento suficiente (scroll intencional)
                if (wheelAccumulator > 50 && !isScrolling) {
                    scrollToNextSection()
                    wheelAccumulator = 0
                }

                // Reset acumulador após um tempo
                clearTimeout(wheelTimeout)
                wheelTimeout = setTimeout(() => {
                    wheelAccumulator = 0
                }, 150)
            } else {
                // Scroll para cima - reseta acumulador
                wheelAccumulator = 0
            }
        }

        // Handler para touch (mobile) - Swipe para cima
        const handleTouchStart = (e) => {
            if (!isInHeroSection()) return
            touchStartY = e.touches[0].clientY
            touchEndY = touchStartY
        }

        const handleTouchMove = (e) => {
            if (!isInHeroSection() || isScrolling) return
            touchEndY = e.touches[0].clientY
        }

        const handleTouchEnd = () => {
            if (!isInHeroSection() || isScrolling) return

            const touchDiff = touchStartY - touchEndY

            // Se arrastou para cima (swipe up) mais de 50px - comportamento tipo TikTok
            if (touchDiff > 50) {
                scrollToNextSection()
            }

            // Reset
            touchStartY = 0
            touchEndY = 0
        }

        // Adicionar listeners no window para capturar eventos mesmo se o mouse estiver fora
        const handleWindowWheel = (e) => {
            if (isInHeroSection()) {
                handleWheel(e)
            }
        }

        // Adicionar listeners
        window.addEventListener('wheel', handleWindowWheel, { passive: false })
        heroSection.addEventListener('touchstart', handleTouchStart, { passive: true })
        heroSection.addEventListener('touchmove', handleTouchMove, { passive: true })
        heroSection.addEventListener('touchend', handleTouchEnd, { passive: true })

        return () => {
            window.removeEventListener('wheel', handleWindowWheel)
            heroSection.removeEventListener('touchstart', handleTouchStart)
            heroSection.removeEventListener('touchmove', handleTouchMove)
            heroSection.removeEventListener('touchend', handleTouchEnd)
            if (wheelTimeout) {
                clearTimeout(wheelTimeout)
            }
        }
    }, [])

    const socialLinks = config.socialLinks

    // Verificar se é mobile para desabilitar efeitos 3D
    const [isMobile, setIsMobile] = useState(false)
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768
            setIsMobile(mobile)
            setImageUrl(mobile ? config.profile.imageMobile : config.profile.imageDesktop)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <section
            ref={containerRef}
            id="hero-section"
            className="hero-section"
            style={{
                transformStyle: 'preserve-3d',
                backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'top right',
                backgroundRepeat: 'no-repeat'
            }}
        >

            {/* Logo fixada no canto superior direito */}
            <motion.img
                src={config.profile.logo}
                alt={config.profile.name}
                className="hero-logo"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0 }}
            />

            {/* Container principal */}
            <div
                ref={heroRef}
                className="hero-container"
                style={{ opacity: 1, visibility: 'visible' }}
            >
                {/* Menu de Links */}
                <motion.div
                    ref={menuRef}
                    className="hero-menu"
                    style={{
                        rotateX: isMobile ? 0 : rotateX,
                        rotateY: isMobile ? 0 : rotateY,
                        transformStyle: isMobile ? 'flat' : 'preserve-3d'
                    }}
                >
                    <div className="hero-menu-items">
                        {socialLinks.map((link, index) => (
                            <SocialButton
                                key={link.id}
                                {...link}
                                index={index}
                                mousePosition={mousePosition}
                            />
                        ))}
                    </div>
                </motion.div>

            </div>

            {/* Elementos decorativos flutuantes */}
            <div className="hero-decorative-elements">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`decorative-circle decorative-circle-${i + 1}`}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.1, 0.2, 0.1],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 4 + i * 0.5,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.5
                        }}
                    />
                ))}
            </div>
        </section>
    )
}

export default Hero

