# ⚡ Início Rápido - Kaio Zaga

## 🚀 Passos para Rodar o Projeto

### 1. Instalar Dependências
```bash
npm install
```

### 2. Verificar Assets
Certifique-se que os arquivos estão em:
- `public/assets/capa-kaio.jpg`
- `public/assets/video-kaio.mp4`

### 3. Iniciar Servidor
```bash
npm run dev
```

### 4. Acessar
Abra o navegador em: `http://localhost:3000`

---

## 📝 Personalizações Rápidas

### Trocar Foto
1. Substitua o arquivo `public/assets/capa-kaio.jpg`
2. OU edite o caminho em `src/config.js` → `profile.image`

### Trocar Vídeo
1. Substitua o arquivo `public/assets/video-kaio.mp4`
2. OU edite o caminho em `src/config.js` → `profile.video`

### Alterar Links
Edite `src/config.js` → `socialLinks`:
```javascript
{
  id: 'instagram',
  href: 'https://instagram.com/seu-usuario', // ← Seu link
  // ...
}
```

### Alterar Nome
Edite `src/config.js` → `profile.name`:
```javascript
profile: {
  name: 'Seu Nome', // ← Aqui
}
```

### Alterar Cores
Edite `src/config.js` → `colors`:
```javascript
colors: {
  dark: {
    primary: '#000000', // ← Cor de fundo
  }
}
```

---

## 🎯 Estrutura de Arquivos Importantes

```
📁 src/
  ├── config.js          ← ⭐ EDITE AQUI para personalizar
  └── components/
      ├── Hero.jsx       ← Seção principal
      └── VideoSection.jsx ← Seção do vídeo

📁 public/
  └── assets/
      ├── capa-kaio.jpg  ← Sua foto
      └── video-kaio.mp4 ← Seu vídeo
```

---

## ✅ Checklist de Configuração

- [ ] Dependências instaladas (`npm install`)
- [ ] Foto em `public/assets/capa-kaio.jpg`
- [ ] Vídeo em `public/assets/video-kaio.mp4`
- [ ] Links atualizados em `src/config.js`
- [ ] Nome atualizado em `src/config.js`
- [ ] Servidor rodando (`npm run dev`)

---

## 🐛 Problemas Comuns

**Vídeo não carrega?**
- Verifique se está em `public/assets/`
- Formato deve ser MP4

**Foto não aparece?**
- Verifique o caminho em `src/config.js`
- Limpe o cache (Ctrl+Shift+R)

**Erro ao instalar?**
- Use Node.js 16+ 
- Delete `node_modules` e `package-lock.json`
- Execute `npm install` novamente

---

Para mais detalhes, veja o [README.md](README.md) completo.

