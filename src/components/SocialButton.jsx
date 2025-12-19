import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import './SocialButton.css'

const SocialButton = ({ id, label, icon, href, color, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState([])
  const buttonRef = useRef(null)

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClick = (e) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y
    }

    setRipples([...ripples, newRipple])
    setTimeout(() => {
      setRipples(ripples => ripples.filter(r => r.id !== newRipple.id))
    }, 600)
  }

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      target={href.startsWith('http') || href.startsWith('tel') ? '_blank' : '_self'}
      rel={href.startsWith('http') ? 'noopener noreferrer' : ''}
      className={`social-button social-button-${id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: 1
      }}
      transition={{
        opacity: { duration: 0.5, delay: index * 0.1 },
        y: { type: 'spring', stiffness: 200, damping: 20, delay: index * 0.1 },
        scale: { type: 'spring', stiffness: 200, damping: 20, delay: index * 0.1 }
      }}
      whileHover={{
        scale: 1.05,
        y: -2,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      style={{
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {/* Background gradiente com profundidade */}
      <motion.div
        className={`social-button-bg bg-gradient-to-r ${color}`}
        animate={{
          opacity: isHovered ? 0.6 : 0.35,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ 
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
        style={{}}
      />

      {/* Camada de profundidade 3D */}
      <motion.div
        className="social-button-depth"
        animate={{
          opacity: isHovered ? 0.15 : 0.05,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.4 }}
        style={{}}
      />
      
      {/* Brilho animado avançado */}
      <motion.div
        className="social-button-shine"
        animate={{
          x: isHovered ? ['-150%', '250%'] : '-150%',
          opacity: isHovered ? [0, 0.2, 0] : 0,
        }}
        transition={{
          duration: 1.2,
          ease: 'easeInOut',
          repeat: isHovered ? Infinity : 0,
          repeatDelay: 2
        }}
      />

      {/* Brilho secundário */}
      <motion.div
        className="social-button-shine-secondary"
        animate={{
          rotate: isHovered ? 360 : 0,
          opacity: isHovered ? 0.1 : 0,
        }}
        transition={{
          rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
          opacity: { duration: 0.4 }
        }}
      />
      
      {/* Conteúdo com animação 3D */}
      <motion.div 
        className="social-button-content"
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.4 }}
        style={{}}
      >
        <motion.span 
          className="social-button-icon"
          animate={{
            rotate: isHovered ? [0, 10, -10, 0] : 0,
            scale: isHovered ? 1.3 : 1,
          }}
          transition={{
            rotate: { duration: 0.6, ease: 'easeInOut' },
            scale: { duration: 0.3 }
          }}
        >
          {icon}
        </motion.span>
        <motion.span 
          className="social-button-label"
          animate={{
            x: isHovered ? 5 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.span>
      </motion.div>
      
      {/* Borda brilhante com glow avançado */}
      <motion.div
        className="social-button-border"
        animate={{
          opacity: isHovered ? 0.6 : 0.4,
        }}
        style={{
          boxShadow: isHovered 
            ? '0 0 10px rgba(255, 255, 255, 0.08)'
            : '0 0 5px rgba(255, 255, 255, 0.04)'
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Efeito de ripple no click */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="social-button-ripple"
          initial={{
            x: ripple.x,
            y: ripple.y,
            scale: 0,
            opacity: 0.6
          }}
          animate={{
            scale: 4,
            opacity: 0
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut'
          }}
        />
      ))}
      
      {/* Efeito de partículas simplificado no hover */}
      {isHovered && (
        <div className="social-button-particles">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{
                x: '50%',
                y: '50%',
                opacity: 1,
                scale: 0
              }}
              animate={{
                x: `${50 + Math.cos((i / 8) * Math.PI * 2) * 120}%`,
                y: `${50 + Math.sin((i / 8) * Math.PI * 2) * 120}%`,
                opacity: [1, 0],
                scale: [0, 1.2, 0]
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: 'easeOut',
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          ))}
        </div>
      )}

      {/* Efeito de glow pulsante */}
      <motion.div
        className="social-button-glow"
        animate={{
          opacity: isHovered ? [0.05, 0.1, 0.05] : 0,
          scale: isHovered ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: 'easeInOut'
        }}
      />
    </motion.a>
  )
}

export default SocialButton

