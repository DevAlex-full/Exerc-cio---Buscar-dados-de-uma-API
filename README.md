# 🛍️ LuxeStore - Premium Shopping Experience

<div align="center">

![LuxeStore](https://img.shields.io/badge/LuxeStore-Premium-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Uma aplicação moderna de e-commerce com design premium e funcionalidades avançadas**

[Demo ao Vivo](#) • [Reportar Bug](https://github.com/DevAlex-full/luxestore/issues) • [Solicitar Feature](https://github.com/DevAlex-full/luxestore/issues)

</div>

---

## 📋 Sobre o Projeto

LuxeStore é uma aplicação web moderna de e-commerce desenvolvida com **React**, **TypeScript** e **TailwindCSS**, consumindo a [Fake Store API](https://fakestoreapi.com) para exibir produtos de forma elegante e interativa.

Este projeto foi desenvolvido como um exercício de integração com APIs, demonstrando boas práticas de desenvolvimento frontend e design moderno.

### ✨ Características Principais

- 🎨 **Design Premium** - Interface moderna com glassmorphism e gradientes vibrantes
- 🌓 **Dark Mode** - Alternância suave entre temas claro e escuro
- 🛒 **Carrinho Funcional** - Sistema completo de carrinho de compras com persistência
- ❤️ **Favoritos** - Salve seus produtos preferidos
- 🔍 **Busca Avançada** - Pesquise produtos por nome ou descrição
- 📊 **Filtros Inteligentes** - Filtre por categoria, preço e ordenação
- 📱 **100% Responsivo** - Funciona perfeitamente em todos os dispositivos
- 💾 **LocalStorage** - Dados persistem mesmo após fechar o navegador
- 🔔 **Notificações Toast** - Feedback visual para ações do usuário
- 📑 **Múltiplas Visualizações** - Modo grid ou lista

---

## 🛠️ Tecnologias Utilizadas

### Core
- **React 18.3** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.5** - Superset JavaScript com tipagem estática
- **Vite 5.4** - Build tool ultra-rápida

### Estilização
- **TailwindCSS 3.4** - Framework CSS utility-first
- **Lucide React** - Biblioteca de ícones moderna

### APIs
- **Fake Store API** - API REST para dados de produtos

### Ferramentas
- **ESLint** - Linter para qualidade de código
- **PostCSS** - Processador CSS

---

## 📦 Instalação e Uso

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/DevAlex-full/luxestore.git
cd luxestore
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Tailwind CSS**
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

4. **Instale o Lucide React**
```bash
npm install lucide-react
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Abra no navegador**
```
http://localhost:5173
```

### Build para Produção

```bash
npm run build
npm run preview
```

---

## 📂 Estrutura do Projeto

```
luxestore/
├── public/
├── src/
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Entry point
│   ├── index.css         # Estilos globais + Tailwind
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tailwind.config.js    # Configuração do Tailwind
├── tsconfig.json         # Configuração do TypeScript
├── vite.config.ts        # Configuração do Vite
└── README.md
```

---

## 🎯 Funcionalidades Detalhadas

### 🛒 Sistema de Carrinho
- Adicionar/remover produtos
- Ajustar quantidades
- Cálculo automático do total
- Persistência com localStorage
- Limpar carrinho completo

### ❤️ Sistema de Favoritos
- Marcar produtos como favoritos
- Contador visual de favoritos
- Animação de pulso ao favoritar
- Persistência local

### 🔍 Busca e Filtros
- **Busca em tempo real** por título e descrição
- **Filtro por categoria** (Eletrônicos, Joias, Roupas)
- **Ordenação**:
  - Padrão
  - Menor preço
  - Maior preço
  - Melhor avaliação
- **Filtro de preço** com slider

### 🎨 Interface
- **Glassmorphism** em header e cards
- **Gradientes** roxo → rosa em toda interface
- **Animações suaves** em hover e transições
- **Badges inteligentes**:
  - "Top Rated" para produtos 4.5+ ⭐
  - "Popular" para 100+ avaliações
  - Desconto em %

### 📱 Responsividade
- Grid adaptável: 1 → 2 → 3 → 4 colunas
- Menu mobile otimizado
- Carrinho em tela cheia no mobile
- Touch-friendly

---

## 🎨 Paleta de Cores

```css
/* Gradientes Principais */
Purple: #9333ea → Pink: #ec4899

/* Modo Claro */
Background: Indigo-100 → Purple-50 → Pink-100
Cards: White/80 com backdrop-blur

/* Modo Escuro */
Background: Gray-900 → Purple-900 → Violet-900
Cards: Gray-800/80 com backdrop-blur
```

---

## 📊 API Utilizada

### Fake Store API

**Base URL**: `https://fakestoreapi.com`

#### Endpoints Utilizados

```javascript
// Buscar todos os produtos
GET https://fakestoreapi.com/products

// Resposta esperada
[
  {
    id: 1,
    title: "Product Name",
    price: 109.95,
    description: "Product description...",
    category: "electronics",
    image: "https://...",
    rating: {
      rate: 4.5,
      count: 120
    }
  }
]
```

---

## 🔧 Configurações

### tailwind.config.js
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Animações customizadas */
@keyframes slideInRight { /* ... */ }
@keyframes fadeIn { /* ... */ }
@keyframes slideDown { /* ... */ }
```

---

## 🚧 Roadmap

- [ ] Autenticação de usuários
- [ ] Integração com gateway de pagamento
- [ ] Sistema de reviews
- [ ] Wishlist compartilhável
- [ ] Comparação de produtos
- [ ] Histórico de pedidos
- [ ] Notificações push
- [ ] PWA (Progressive Web App)
- [ ] Testes unitários e E2E
- [ ] Internacionalização (i18n)

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Alex Developer**

- GitHub: [@DevAlex-full](https://github.com/DevAlex-full)
- LinkedIn: [Seu LinkedIn](#)
- Portfolio: [Seu Portfolio](#)

---

## 🙏 Agradecimentos

- [Fake Store API](https://fakestoreapi.com) pelos dados de produtos
- [Lucide Icons](https://lucide.dev) pelos ícones
- [TailwindCSS](https://tailwindcss.com) pelo framework CSS
- [React](https://react.dev) pela biblioteca incrível
- Comunidade open source 💜

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela!**

Made with 💜 by [DevAlex-full](https://github.com/DevAlex-full)

</div>
