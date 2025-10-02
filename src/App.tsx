import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Search, Heart, Moon, Sun, Trash2, X, SlidersHorizontal, TrendingUp, Sparkles, Package, Filter, Grid, List, ChevronDown, Award, Zap, Tag } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface CartItem extends Product {
  quantity: number;
}

export default function FakeStoreApp() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    saveToLocalStorage();
  }, [favorites, cart]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://fakestoreapi.com/products');
      
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      
      const data: Product[] = await response.json();
      setProducts(data);
      const maxPrice = Math.max(...data.map(p => p.price));
      setPriceRange([0, Math.ceil(maxPrice)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const loadFromLocalStorage = () => {
    const savedFavorites = localStorage.getItem('favorites');
    const savedCart = localStorage.getItem('cart');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode));
  };

  const saveToLocalStorage = () => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  };

  const showNotification = (message: string) => {
    setNotification(message);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const isFavorite = prev.includes(productId);
      showNotification(isFavorite ? '💔 Removido dos favoritos' : '💜 Adicionado aos favoritos!');
      return isFavorite 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
    });
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      showNotification('🛒 Produto adicionado ao carrinho!');
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showNotification('🗑️ Produto removido do carrinho');
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    showNotification('🧹 Carrinho limpo!');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getDiscount = (price: number) => {
    return ((price * 0.3) / price * 100).toFixed(0);
  };

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  
  let filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Price range filter
  filteredProducts = filteredProducts.filter(p => 
    p.price >= priceRange[0] && p.price <= priceRange[1]
  );

  if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating.rate - a.rating.rate);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-6"></div>
            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-700 dark:text-gray-200 text-xl font-semibold">Carregando produtos incríveis...</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Preparando a melhor experiência para você ✨</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl text-center max-w-md border border-red-100 dark:border-red-900">
          <div className="text-red-500 text-6xl mb-6">💔</div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Oops!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={fetchProducts}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-violet-900 transition-all duration-500 ${darkMode ? 'dark' : ''}`}>
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 animate-slideInRight">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 backdrop-blur-xl flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold">{notification}</span>
          </div>
        </div>
      )}

      {/* Header with Glassmorphism */}
      <header className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 shadow-lg sticky top-0 z-20 border-b border-white/20 dark:border-gray-700/30">
        <div className="max-w-7xl mx-auto px-4 py-5">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-2xl shadow-lg transform hover:scale-110 transition-transform animate-pulse">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                  LuxeStore
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  Premium Shopping Experience
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden md:flex items-center gap-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-110 shadow-lg hover:rotate-12"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-white" />
                )}
              </button>

              {/* Favorites */}
              <button className="relative p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white transition-all transform hover:scale-110 shadow-lg group">
                <Heart className="w-5 h-5 group-hover:scale-125 transition-transform" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-purple-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow animate-bounce">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-3 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all transform hover:scale-110 shadow-lg group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-125 transition-transform" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar with Glassmorphism */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Buscar produtos incríveis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-purple-200/50 dark:border-purple-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-700 focus:border-transparent transition-all shadow-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              <Filter className="w-4 h-4" />
              Filtros
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-purple-200/30 dark:border-purple-700/30">
              <SlidersHorizontal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none focus:outline-none text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <option value="default">Padrão</option>
                <option value="price-asc">💰 Menor preço</option>
                <option value="price-desc">💎 Maior preço</option>
                <option value="rating">⭐ Melhor avaliação</option>
              </select>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-xl whitespace-nowrap transition-all text-sm font-semibold transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/80 border border-purple-200/30 dark:border-purple-700/30'
                  }`}
                >
                  {category === 'all' ? '✨ Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30 animate-slideDown">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  Faixa de Preço: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <button
                  onClick={() => setPriceRange([0, Math.max(...products.map(p => p.price))])}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                >
                  Resetar
                </button>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(...products.map(p => p.price))}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-purple-600"
              />
            </div>
          )}
        </div>
      </header>

      {/* Cart Sidebar with Glassmorphism */}
      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-fadeIn" onClick={() => setShowCart(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-y-auto animate-slideInRight border-l border-purple-200/30 dark:border-purple-700/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-xl">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Meu Carrinho
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{getCartItemsCount()} itens</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCart(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Seu carrinho está vazio</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Adicione produtos incríveis!</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal dos produtos</span>
                    <button
                      onClick={clearCart}
                      className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Limpar tudo
                    </button>
                  </div>

                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 border border-purple-100 dark:border-gray-700 hover:shadow-lg transition-all">
                        <div className="w-20 h-20 bg-white dark:bg-gray-700 rounded-xl p-2 flex items-center justify-center flex-shrink-0">
                          <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-800 dark:text-white mb-1 line-clamp-2">{item.title}</h3>
                          <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            ${item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600 font-bold text-gray-700 dark:text-gray-300 transition"
                            >
                              -
                            </button>
                            <span className="text-gray-800 dark:text-white font-semibold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-gray-700 hover:bg-purple-100 dark:hover:bg-gray-600 font-bold text-gray-700 dark:text-gray-300 transition"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-purple-200 dark:border-purple-800 pt-6 space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Subtotal</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                        <span>Frete grátis 🎉</span>
                        <span>$0.00</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total:</span>
                      <span className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl font-bold transition-all transform hover:scale-105 shadow-lg text-lg flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      Finalizar Compra
                    </button>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      🔒 Pagamento 100% seguro
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/30">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-gray-700 dark:text-gray-300 font-semibold">
              Mostrando <span className="text-purple-600 dark:text-purple-400 font-bold">{filteredProducts.length}</span> de {products.length} produtos
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Produtos premium selecionados</span>
          </div>
        </div>

        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-purple-100/50 dark:border-purple-900/50 ${
                viewMode === 'list' ? 'flex flex-row' : ''
              }`}
            >
              {/* Product Image */}
              <div className={`relative bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-700 flex items-center justify-center p-6 overflow-hidden ${
                viewMode === 'list' ? 'w-64 flex-shrink-0' : 'h-64'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500 relative z-10"
                />
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:scale-125 transition-all z-20"
                >
                  <Heart 
                    className={`w-5 h-5 transition-all ${
                      favorites.includes(product.id) 
                        ? 'fill-red-500 text-red-500 animate-pulse' 
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  />
                </button>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.rating.rate >= 4.5 && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Top Rated
                    </div>
                  )}
                  <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    -{getDiscount(product.price)}% OFF
                  </div>
                </div>
              </div>
              
              {/* Product Info */}
              <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  {product.rating.count > 100 && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      Popular
                    </div>
                  )}
                </div>
                
                <h3 className={`text-lg font-bold text-gray-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors ${
                  viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-2 h-14'
                }`}>
                  {product.title}
                </h3>
                
                <p className={`text-gray-600 dark:text-gray-400 text-sm mb-4 ${
                  viewMode === 'list' ? 'line-clamp-3' : 'line-clamp-2 h-10'
                }`}>
                  {product.description}
                </p>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4 p-2 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating.rate) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {product.rating.rate}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({product.rating.count})
                  </span>
                </div>
                
                {/* Price and Button */}
                <div className={`flex items-center gap-3 ${viewMode === 'list' ? 'justify-between' : 'justify-between'}`}>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                      ${(product.price * 1.3).toFixed(2)}
                    </p>
                    <span className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-5 py-3 rounded-xl transition-all transform hover:scale-110 flex items-center gap-2 font-semibold shadow-lg whitespace-nowrap"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {viewMode === 'grid' ? 'Comprar' : 'Adicionar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Search className="w-16 h-16 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xl font-semibold mb-2">Nenhum produto encontrado</p>
            <p className="text-gray-400 dark:text-gray-500 mt-2 mb-6">Tente ajustar seus filtros ou buscar por outro termo</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceRange([0, Math.max(...products.map(p => p.price))]);
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl transition-all transform hover:scale-105 font-semibold shadow-lg"
            >
              Limpar Filtros
            </button>
          </div>
        )}

        {/* Featured Banner */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 animate-spin" />
                <h3 className="text-3xl font-black">Ofertas Especiais</h3>
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <p className="text-lg mb-6 opacity-90">
                Descontos de até 30% em produtos selecionados! 🎉
              </p>
              <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
                Ver Todas as Ofertas
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl border-t border-purple-200/30 dark:border-purple-700/30 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  LuxeStore
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Sua loja premium de produtos selecionados com os melhores preços e qualidade.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition">Sobre Nós</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition">Contato</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition">Política de Privacidade</li>
                <li className="hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition">Termos de Uso</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-4">Atendimento</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>📧 contato@luxestore.com</li>
                <li>📱 (11) 99999-9999</li>
                <li>🕐 Seg-Sex: 9h às 18h</li>
                <li>💬 Chat online disponível</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-200 dark:border-purple-800 pt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 font-medium flex items-center justify-center gap-2">
              Made with 
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              by <span className="font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">LuxeStore Team</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              © 2025 LuxeStore. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}