import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, Shield, Phone, Sparkles } from 'lucide-react';
import { BRAND_ASSETS } from '../data/initialProducts';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  activeTab: 'home' | 'shop';
  setActiveTab: (tab: 'home' | 'shop') => void;
  onOpenContact: () => void;
  onOpenPrivacy: () => void;
  onOpenShipping: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  onOpenCart,
  activeTab,
  setActiveTab,
  onOpenContact,
  onOpenPrivacy,
  onOpenShipping,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleNavClick = (tab: 'home' | 'shop') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#F2D6D0] shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-2 sm:gap-6">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-[#4A262C] hover:bg-[#FFF2F0] rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo & Name */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFF3B0] to-[#E8CA65] shadow-xs group-hover:shadow-md transition-all">
              <img
                src={BRAND_ASSETS.logo}
                alt="MW Cosmetics Logo"
                className="w-11 h-11 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-white"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-wider text-[#2D1B1E] group-hover:text-[#8B263E] transition-colors leading-tight">
                MW <span className="text-[#B8860B] font-normal italic">Cosmetics</span>
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#8C646B] font-medium">
                Luxury Skincare • PK
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`text-sm tracking-wide font-medium transition-colors relative py-1 cursor-pointer ${
                activeTab === 'home'
                  ? 'text-[#8B263E] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#D4AF37]'
                  : 'text-[#4A2E33] hover:text-[#8B263E]'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('shop')}
              className={`text-sm tracking-wide font-medium transition-colors relative py-1 cursor-pointer ${
                activeTab === 'shop'
                  ? 'text-[#8B263E] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#D4AF37]'
                  : 'text-[#4A2E33] hover:text-[#8B263E]'
              }`}
            >
              Shop Catalog
            </button>
            <button
              type="button"
              onClick={onOpenShipping}
              className="text-sm tracking-wide font-medium text-[#4A2E33] hover:text-[#8B263E] transition-colors cursor-pointer"
            >
              Shipping & COD
            </button>
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="text-sm tracking-wide font-medium text-[#4A2E33] hover:text-[#8B263E] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={onOpenContact}
              className="text-sm tracking-wide font-medium text-[#4A2E33] hover:text-[#8B263E] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Help / Contact</span>
            </button>
          </nav>

          {/* Search Bar & Cart Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Instant Search Bar */}
            <div className={`relative transition-all duration-300 ${searchFocused ? 'w-48 sm:w-64 md:w-72' : 'w-36 sm:w-52 md:w-60'}`}>
              <div className="relative flex items-center">
                <Search className={`absolute left-3 w-4 h-4 transition-colors ${searchFocused ? 'text-[#B8860B]' : 'text-[#9A7077]'}`} />
                <input
                  type="text"
                  placeholder="Search skincare..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-9 pr-8 py-2 bg-[#FFF7F6] border border-[#F2D6D0] rounded-full text-xs sm:text-sm text-[#2D1B1E] placeholder:text-[#9A7077]/70 focus:bg-white focus:outline-hidden focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="View shopping cart"
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-[#3B1C22] to-[#2B1418] text-white hover:from-[#4E242C] hover:to-[#381B20] transition-all shadow-sm active:scale-95 group border border-[#D4AF37]/40 cursor-pointer"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8CA65] group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#D4AF37] to-[#F1D26E] text-[#2B1418] text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs border border-white animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left leading-none">
                <span className="text-[10px] uppercase text-[#E8C2B9] tracking-wider font-semibold">
                  Bag
                </span>
                <span className="text-xs font-bold text-white">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFBFB] border-b border-[#F2D6D0] px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#4A262C] hover:bg-[#FFF0ED]"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('shop')}
              className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#4A262C] hover:bg-[#FFF0ED]"
            >
              Shop All Products
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShipping();
              }}
              className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#4A262C] hover:bg-[#FFF0ED]"
            >
              Free Shipping & COD Policy
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPrivacy();
              }}
              className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#4A262C] hover:bg-[#FFF0ED]"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="text-left py-2 px-3 rounded-lg text-sm font-semibold text-[#8B263E] hover:bg-[#FFF0ED] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37]" />
                Customer Support
              </span>
              <span className="text-xs bg-[#FFF2F0] text-[#8B263E] px-2 py-0.5 rounded-full font-medium">
                Active
              </span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#F2D6D0]/60 flex items-center justify-between text-xs text-[#8C646B]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Official MW Brand Store
            </span>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center gap-1 text-[#8C646B] hover:text-[#2D1B1E]"
            >
              <Shield className="w-3 h-3 text-[#D4AF37]" />
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
