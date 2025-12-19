// Configurações centralizadas do projeto Kaio Zaga
// Edite este arquivo para personalizar facilmente

// Base URL dinâmico baseado no domínio
// Se estiver em domínio personalizado (kaiozaga.com.br), usa raiz (/)
// Se estiver em GitHub Pages padrão, usa /kaio-zaga-links/
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Usa o base path definido no script inline do index.html
    if (window.__BASE_PATH__ !== undefined) {
      return window.__BASE_PATH__ + '/'
    }

    const hostname = window.location.hostname
    // Se for domínio personalizado, usa raiz
    if (hostname.includes('kaiozaga.com.br')) {
      return '/'
    }
  }
  // Para GitHub Pages padrão ou desenvolvimento, usa o base do Vite
  return import.meta.env.BASE_URL || '/kaio-zaga-links/'
}

const BASE_URL = getBaseUrl()

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
      href: 'https://www.instagram.com/kaiozaga/',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: '💬',
      href: 'https://wa.me/5562981265955?text=Ol%C3%A1!%20Acabei%20de%20visitar%20o%20seu%20Instagram%20e%20gostaria%20de%20agendar%20um%20hor%C3%A1rio.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'location',
      label: 'Localização',
      icon: '📍',
      href: 'https://maps.app.goo.gl/TVZipXFqYuiNE4Y27',
      color: 'from-blue-500 to-cyan-500'
    },
    // {
    //   id: 'tiktok',
    //   label: 'TikTok',
    //   icon: '🎵',
    //   href: 'https://tiktok.com',
    //   color: 'from-black to-gray-800'
    // },
    // {
    //   id: 'phone',
    //   label: 'Ligação',
    //   icon: '📞',
    //   href: 'tel:+5511999999999',
    //   color: 'from-yellow-500 to-orange-500'
    // }
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

