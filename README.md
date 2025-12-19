# 🚀 Kaio Zaga - Landing Page Premium

Uma landing page altamente profissional com animações 3D, efeitos parallax avançados, microinterações e UX imersiva de nível Awwwards.

## ✨ Características

- 🎨 **Design Dark Premium** - Estilo minimalista e moderno
- 🎭 **Animações 3D** - Efeitos de profundidade e movimento
- 🌊 **Parallax Avançado** - Scroll suave e responsivo
- 💫 **Microinterações** - Botões com efeitos premium
- 📱 **100% Responsivo** - Mobile-first e otimizado
- ⚡ **Performance Otimizada** - GPU acceleration e lazy loading
- 🎬 **Vídeo Background** - Com efeito fumaça atmosférica

## 🛠️ Tecnologias

- **React 18** - Framework moderno
- **Vite** - Build tool ultra-rápido
- **GSAP** - Animações profissionais
- **Framer Motion** - Microinterações avançadas
- **Tailwind CSS** - Estilização rápida
- **Canvas API** - Efeitos de fumaça personalizados

## 📦 Instalação

1. **Clone ou baixe o projeto**

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure os assets:**

   Os arquivos de imagem e vídeo devem estar na pasta `public/assets/`:
   ```
   public/
     assets/
       capa-kaio.jpg
       video-kaio.mp4
   ```

   Se seus arquivos estão na raiz em `assets/`, mova-os:
   ```bash
   mkdir -p public/assets
   mv assets/* public/assets/
   ```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

5. **Acesse no navegador:**
```
http://localhost:3000
```

## 📝 Personalização

### 1. Alterar a Foto do Kaio

Edite o arquivo `src/config.js`:

```javascript
profile: {
  name: 'Kaio Zaga',
  image: '/assets/capa-kaio.jpg', // Altere o caminho aqui
  video: '/assets/video-kaio.mp4'
}
```

Ou simplesmente substitua o arquivo `public/assets/capa-kaio.jpg` mantendo o mesmo nome.

### 2. Alterar o Vídeo

Edite o arquivo `src/config.js`:

```javascript
profile: {
  video: '/assets/video-kaio.mp4' // Altere o caminho aqui
}
```

Ou substitua o arquivo `public/assets/video-kaio.mp4`.

**Dicas para o vídeo:**
- Formato recomendado: MP4
- Resolução: 1920x1080 ou superior
- Duração: Loop infinito
- Tamanho: Otimize para web (< 10MB se possível)

### 3. Alterar os Links dos Botões

Edite o arquivo `src/config.js` na seção `socialLinks`:

```javascript
socialLinks: [
  {
    id: 'instagram',
    label: 'Instagram',
    icon: '📷',
    href: 'https://instagram.com/seu-usuario', // Seu link aqui
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: '💬',
    href: 'https://wa.me/5511999999999', // Seu número aqui
    color: 'from-green-500 to-emerald-500'
  },
  // ... outros links
]
```

### 4. Alterar Cores

Edite o arquivo `src/config.js` na seção `colors`:

```javascript
colors: {
  dark: {
    primary: '#000000',    // Cor de fundo principal
    secondary: '#0a0a0a',  // Cor secundária
    accent: '#1a1a1a'      // Cor de destaque
  },
  text: {
    primary: '#ffffff',    // Cor do texto principal
    secondary: '#a0a0a0'   // Cor do texto secundário
  }
}
```

As cores dos botões sociais podem ser alteradas nas classes Tailwind em `socialLinks`. Exemplos:
- `from-purple-500 to-pink-500` - Gradiente roxo para rosa
- `from-blue-500 to-cyan-500` - Gradiente azul para ciano
- `from-green-500 to-emerald-500` - Gradiente verde

### 5. Alterar o Nome

Edite o arquivo `src/config.js`:

```javascript
profile: {
  name: 'Seu Nome Aqui', // Altere aqui
  // ...
}
```

### 6. Ajustar Velocidade das Animações

Edite o arquivo `src/config.js` na seção `animation`:

```javascript
animation: {
  heroEntrance: 1.5,        // Duração da entrada (segundos)
  buttonStagger: 0.1,       // Delay entre botões (segundos)
  mouseSensitivity: 0.1,    // Sensibilidade do efeito 3D (0.05-0.2)
  parallaxSpeed: 1.5        // Velocidade do parallax
}
```

## 🏗️ Estrutura do Projeto

```
kaio-zaga/
├── public/
│   └── assets/
│       ├── capa-kaio.jpg      # Foto do perfil
│       └── video-kaio.mp4     # Vídeo de fundo
├── src/
│   ├── components/
│   │   ├── Hero.jsx           # Seção hero principal
│   │   ├── Hero.css
│   │   ├── SocialButton.jsx   # Botões de redes sociais
│   │   ├── SocialButton.css
│   │   ├── VideoSection.jsx   # Seção com vídeo
│   │   ├── VideoSection.css
│   │   ├── SmokeOverlay.jsx   # Efeito de fumaça
│   │   └── SmokeOverlay.css
│   ├── config.js              # ⭐ Arquivo de configuração
│   ├── App.jsx                # Componente principal
│   ├── main.jsx               # Entry point
│   └── index.css              # Estilos globais
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos estarão na pasta `dist/`. Você pode fazer deploy em qualquer serviço estático:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

Para preview da build:

```bash
npm run preview
```

## 🎯 Recursos Avançados

### Efeitos Implementados

1. **Hero Section:**
   - Gradiente dinâmico preto da direita para esquerda
   - Foto com efeito 3D baseado no movimento do mouse
   - Menu de links com animações premium
   - Parallax no scroll

2. **Video Section:**
   - Vídeo em background com autoplay e loop
   - Overlay de fumaça animado (Canvas API)
   - Escurecimento dinâmico no scroll
   - Zoom e movimento parallax

3. **Microinterações:**
   - Botões com efeito hover 3D
   - Partículas animadas
   - Brilho deslizante
   - Transformações suaves

### Otimizações

- ✅ GPU acceleration em todos os elementos animados
- ✅ Lazy loading do vídeo
- ✅ Will-change para performance
- ✅ Transform3d para animações suaves
- ✅ Backdrop-filter para efeitos blur
- ✅ RequestAnimationFrame para canvas

## 🐛 Solução de Problemas

### Vídeo não carrega
- Verifique se o arquivo está em `public/assets/`
- Verifique o formato (MP4 recomendado)
- Teste com outro navegador

### Imagem não aparece
- Verifique o caminho em `src/config.js`
- Certifique-se que o arquivo está em `public/assets/`
- Limpe o cache do navegador (Ctrl+Shift+R)

### Animações travando
- Verifique o console do navegador
- Reduza a sensibilidade do mouse em `config.js`
- Desabilite extensões do navegador que possam interferir

### Layout quebrado no mobile
- Limpe o cache
- Verifique a viewport meta tag no `index.html`
- Teste em diferentes dispositivos

## 📱 Responsividade

A landing page é totalmente responsiva e otimizada para:

- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large Desktop (1440px+)

No mobile:
- A foto vai para o canto direito
- O menu fica à esquerda
- Layout adaptado para touch

## 🎨 Personalização Avançada

Para personalizações mais profundas, você pode editar:

- `src/components/Hero.css` - Estilos do hero
- `src/components/VideoSection.css` - Estilos do vídeo
- `src/index.css` - Variáveis CSS globais
- Componentes JSX para lógica customizada

## 📄 Licença

Este projeto foi criado para uso personalizado.

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação acima
2. Revise os arquivos de configuração
3. Teste em diferentes navegadores

---

**Desenvolvido com ❤️ para criar uma experiência premium e memorável.**

