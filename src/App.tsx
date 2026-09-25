import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order } from './types';
import { INITIAL_PRODUCTS, BRAND_ASSETS } from './data/initialProducts';
import { subscribeToOrders, subscribeToProducts } from './firebase';
import { Banner } from './components/Banner';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminPanel } from './components/AdminPanel';
import { ContactModal } from './components/ContactModal';
import { LegalModal } from './components/LegalModal';
import { BrandFeatures } from './components/BrandFeatures';
import { Footer } from './components/Footer';
import { Search, Sparkles, Filter, PackageCheck, Zap, X, MessageSquare, Phone } from 'lucide-react';

export default function App() {
  // Products & Orders State (Synced in Real-time)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);

  // Navigation & Search
  const [activeTab, setActiveTab] = useState<'home' | 'shop'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mw_cosmetics_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'shipping' | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('mw_cosmetics_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Could not save cart:', e);
    }
  }, [cart]);

  // Subscribe to real-time Firestore / local storage updates
  useEffect(() => {
    const unsubOrders = subscribeToOrders((latestOrders) => {
      setOrders(latestOrders);
    });

    const unsubProducts = subscribeToProducts((latestProducts) => {
      setProducts(latestProducts);
    });

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, []);

  // Listen for /admin or #admin or #contact URL route
  useEffect(() => {
    const checkHashRoute = () => {
      if (
        window.location.pathname === '/admin' || 
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=true')
      ) {
        setIsAdminOpen(true);
      } else if (
        window.location.hash === '#contact' ||
        window.location.hash === '#help'
      ) {
        setIsContactOpen(true);
      }
    };
    checkHashRoute();
    window.addEventListener('hashchange', checkHashRoute);
    window.addEventListener('popstate', checkHashRoute);
    return () => {
      window.removeEventListener('hashchange', checkHashRoute);
      window.removeEventListener('popstate', checkHashRoute);
    };
  }, []);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  // Instant Search & Filtering
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        product.name.toLowerCase().includes(query) ||
        product.tagline.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === 'all' || product.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity: number) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.product.id !== productId));
  };

  // Instant Buy Now (Opens Checkout directly with selected item)
  const handleBuyNow = (product: Product, quantity: number) => {
    // Put item in checkout list and open checkout modal
    setCheckoutItems([{ product, quantity }]);
    setIsCheckoutOpen(true);
  };

  // Proceed to Checkout from Cart
  const handleProceedToCheckoutFromCart = () => {
    if (cart.length === 0) return;
    setCheckoutItems([...cart]);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order Complete handler
  const handleOrderCompleted = (order: Order) => {
    // Clear cart if items matched
    setCart([]);
    setCompletedOrder(order);
  };

  // Categories list
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ['all', ...cats];
  }, [products]);

  const featuredProduct = products[0] || INITIAL_PRODUCTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F9] text-[#2C2424]">
      {/* Top Shipping Banner */}
      <Banner />

      {/* Main Header with Logo, Navigation & Instant Search */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenShipping={() => setLegalModalType('shipping')}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1">
        {/* If user searched, or if on 'shop' tab, show catalog directly; else show hero first */}
        {activeTab === 'home' && !searchQuery ? (
          <>
            <Hero
              onShopClick={() => {
                setActiveTab('shop');
                window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
              featuredProduct={featuredProduct}
              onQuickView={(p) => setSelectedProductModal(p)}
              onBuyNow={handleBuyNow}
            />

            {/* Skincare Routine Showcase */}
            <BrandFeatures
              products={products}
              onSelectProduct={(p) => setSelectedProductModal(p)}
              onAddToCart={handleAddToCart}
            />
          </>
        ) : null}

        {/* Product Catalog Section */}
        <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-[#B8860B] mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>MW Cosmetics Official Formulations</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#2C181C]">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Skincare Catalog'}
              </h2>
              <p className="text-xs sm:text-sm text-[#7A585F] mt-1">
                Cash on delivery across all cities of Pakistan. Free delivery within 3 to 4 business days.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize whitespace-nowrap transition-all border ${
                    categoryFilter === cat
                      ? 'bg-[#3B1C22] text-[#FFF3B0] border-[#3B1C22] shadow-2xs'
                      : 'bg-white text-[#523A3E] border-[#E8C2B9] hover:bg-[#FFF5F3]'
                  }`}
                >
                  {cat === 'all' ? 'All Products' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Active Search Indicator Strip */}
          {searchQuery && (
            <div className="mb-6 p-3 bg-[#FFF5F3] border border-[#F2D6D0] rounded-2xl flex items-center justify-between text-xs text-[#8B263E]">
              <span className="flex items-center gap-1.5 font-medium">
                <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
                Found <strong>{filteredProducts.length}</strong> matching products in catalog
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-[#8B263E] hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear Search
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#F2D6D0] p-8 space-y-3">
              <Search className="w-10 h-10 text-[#D4AF37] mx-auto" />
              <h3 className="font-serif-luxury text-xl font-bold text-[#2D1B1E]">
                No products found
              </h3>
              <p className="text-xs text-[#8C646B] max-w-md mx-auto">
                We couldn't find any products matching "{searchQuery}". Check your spelling or browse our 3 core glass skin formulas below.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#3B1C22] text-white text-xs font-bold hover:bg-[#522931] transition-colors"
              >
                Reset Catalog Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                  onQuickView={(p) => setSelectedProductModal(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Why MW Pakistani Formula Guarantee Banner */}
        <section className="bg-gradient-to-r from-[#FFF5F4] via-[#FEEDEC] to-[#FFF5F4] py-12 border-y border-[#F2D6D0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2D1B1E]">
              The MW Cosmetics Nationwide Promise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-xs text-[#523A3E]">
              <div className="bg-white/80 p-4 rounded-2xl border border-[#F2D6D0]">
                <span className="font-bold text-sm text-[#8B263E] block mb-1">📦 Cash on Delivery (COD)</span>
                <span>Zero advance deposit needed. Verify parcel with courier and pay cash at your doorstep.</span>
              </div>
              <div className="bg-white/80 p-4 rounded-2xl border border-[#F2D6D0]">
                <span className="font-bold text-sm text-[#8B263E] block mb-1">⏱️ 3 to 4 Business Days</span>
                <span>Fast express dispatch across Karachi, Lahore, Islamabad, Rawalpindi, Sialkot, and beyond.</span>
              </div>
              <div className="bg-white/80 p-4 rounded-2xl border border-[#F2D6D0]">
                <span className="font-bold text-sm text-[#8B263E] block mb-1">✨ 100% Sealed Fresh</span>
                <span>Bottled with pure ingredients, Korean rice ferment, 10% niacinamide, and 24K gold flakes.</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModalType('privacy')}
        onOpenShipping={() => setLegalModalType('shipping')}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigateShop={() => {
          setActiveTab('shop');
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

      {/* Floating WhatsApp / Phone Contact Button */}
      <a
        href={BRAND_ASSETS.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Chat: 03288608585"
        title="Direct WhatsApp: 03288608585 (+92 328 8608585)"
        className="fixed bottom-5 right-5 z-30 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2.5 px-4 rounded-full shadow-2xl flex items-center gap-2 border-2 border-white transition-all hover:scale-105 active:scale-95 group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <MessageSquare className="w-4 h-4 text-white shrink-0" />
        <span className="text-xs font-bold tracking-wide">
          WhatsApp 03288608585
        </span>
      </a>

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProductModal}
        onClose={() => setSelectedProductModal(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckoutFromCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={checkoutItems}
        onOrderCompleted={handleOrderCompleted}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      {/* Admin Panel (Dual-Auth with Google + 10-char passcode "Pak#9842@M") */}
      {isAdminOpen && (
        <AdminPanel
          orders={orders}
          products={products}
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              history.pushState('', document.title, window.location.pathname);
            }
          }}
        />
      )}

      {/* Contact & Support Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Legal & Shipping Policy Modal */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
