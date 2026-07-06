# Mario Bros Style Game

Um jogo de plataforma estilo Mario Bros completo, construído com Webpack e JavaScript moderno.

## 🎮 Como Jogar

**Controles:**
- **Setas Esquerda/Direita** ou **A/D**: Mover
- **Espaço**, **Seta Cima** ou **W**: Pular
- **R**: Reiniciar o jogo

**Objetivo:**
- Colete todas as moedas (+50 pontos cada)
- Derrote os inimigos pulando sobre eles (+100 pontos cada)
- Chegue à bandeira no final para vencer
- Evite cair nos buracos e tocar nos inimigos!

## 🚀 Instalação e Desenvolvimento

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm

### Passos para configurar:

1. **Instale as dependências:**
```bash
npm install
```

2. **Modo de desenvolvimento (com hot reload):**
```bash
npm run dev
```
O servidor de desenvolvimento estará disponível em `http://localhost:8080`

3. **Build para produção:**
```bash
npm run build
```
Os arquivos de produção serão gerados na pasta `build/`

## 📁 Estrutura do Projeto

```
mario-bros-game/
├── public/
│   └── index.html          # Template HTML
├── src/
│   ├── index.js            # Lógica principal do jogo
│   └── styles.css          # Estilos CSS
├── build/                  # Arquivos de produção (gerado após npm run build)
├── package.json            # Dependências e scripts
├── webpack.config.js       # Configuração do Webpack
└── vercel.json             # Configuração para deploy na Vercel
```

## 🌐 Deploy na Vercel

Este projeto está configurado para deploy automático na Vercel:

1. **Configure o repositório no GitHub**
2. **Conecte na Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Importe o repositório do GitHub
   - A Vercel detectará automaticamente a configuração

3. **Deploy automático:**
   - A cada push para a branch main, a Vercel fará deploy automático
   - O webhook do GitHub notificará a Vercel automaticamente

### Configuração Vercel (vercel.json)

O arquivo `vercel.json` já está configurado com:
- Comando de build: `npm run build`
- Diretório de saída: `build`
- Routing para SPA (Single Page Application)

## 🎯 Funcionalidades

- ✅ Física de plataformas com gravidade
- ✅ Sistema de colisão
- ✅ Câmera que segue o jogador (scroll lateral)
- ✅ Inimigos com patrulha automática
- ✅ Moedas colecionáveis
- ✅ Sistema de vidas e pontuação
- ✅ Telas de Game Over e Vitória
- ✅ Gráficos desenhados com Canvas API
- ✅ Efeitos visuais (nuvens com parallax, gradientes)

## 🛠️ Tecnologias

- **Webpack 5**: Bundler de módulos
- **HTML5 Canvas**: Renderização do jogo
- **CSS3**: Estilização da interface
- **JavaScript ES6+**: Lógica do jogo

## 📝 Licença

ISC

---

Divirta-se jogando! 🍄⭐
