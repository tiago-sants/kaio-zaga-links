// Configurações centralizadas do projeto Kaio Zaga
// Edite este arquivo para personalizar facilmente

// Base URL do Vite (inclui o base path configurado)
const BASE_URL = import.meta.env.BASE_URL

export const config = {
  // Informações do perfil
  profile: {
    name: 'Kaio Zaga',
    logo: `${BASE_URL}assets/logo-letra-branca-sf.png`, // Logo com o nome
    image: `${BASE_URL}assets/capa-kaio.jpg`, // Imagem padrão (fallback)
    imageMobile: `${BASE_URL}assets/kaio-zaga-mobile.png`, // Imagem para mobile
    imageDesktop: `${BASE_URL}assets/kaio-zaga-desktop.png`, // Imagem para desktop
    video: `${BASE_URL}assets/video-kaio.mp4`
  },

  // Links sociais (edite os URLs aqui)
  socialLinks: [
    {
      id: 'instagram',
      label: 'Instagram',
      icon: '📷',
      href: 'https://instagram.com',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: '💬',
      href: 'https://wa.me',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'location',
      label: 'Localização',
      icon: '📍',
      href: '#location',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      icon: '🎵',
      href: 'https://tiktok.com',
      color: 'from-black to-gray-800'
    },
    {
      id: 'phone',
      label: 'Ligação',
      icon: '📞',
      href: 'tel:+5511999999999',
      color: 'from-yellow-500 to-orange-500'
    }
  ],

  // Cores do tema (cores em formato hexadecimal)
  colors: {
    dark: {
      primary: '#000000',
      secondary: '#0a0a0a',
      accent: '#1a1a1a'
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0'
    }
  },

  // Configurações de animação
  animation: {
    // Velocidade das animações (em segundos)
    heroEntrance: 1.5,
    buttonStagger: 0.1,

    // Sensibilidade do efeito 3D do mouse
    mouseSensitivity: 0.1,

    // Parallax
    parallaxSpeed: 1.5
  }
}

