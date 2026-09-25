import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Star, Award } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  onShopClick: () => void;
  featuredProduct: Product;
  onQuickView: (product: Product) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onShopClick,
  featuredProduct,
  onQuickView,
  onBuyNow,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF5F4] via-[#FFFBFB] to-white pt-8 pb-16 lg:py-20 border-b border-[#F5E1DC]">
      {/* Background ambient gold and blush orbs */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#FCD5D1]/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-5 w-80 h-80 bg-[#FFF3B0]/30 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Brand Typography & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF0ED] border border-[#D4AF37]/50 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-xs font-bold tracking-wider text-[#8B263E] uppercase">
                The Pakistani Glass Skin Secret
              </span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#2C181C] tracking-tight leading-[1.12]">
              Luminous Porcelain Radiance,{' '}
              <span className="gold-shimmer italic font-normal block sm:inline">
                Infused with Pure Gold.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#61454B] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Formulated specifically for Pakistani climate and skin types. Experience effortless glass luminescence with our triumvirate: gentle fermented rice cleanser, 10% pore-refining niacinamide serum, and 24K gold ceramide cloud moisturizer.
            </p>

            {/* Nationwide COD reassurance badge */}
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-[#F2D6D0] inline-flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-[#523A3E] shadow-2xs">
              <span className="flex items-center gap-1.5 font-semibold text-[#8B263E]">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                Free Nationwide Shipping
              </span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="flex items-center gap-1.5 font-semibold text-[#2D1B1E]">
                <span>⏱️ Delivery in 3-4 Business Days</span>
              </span>
              <span className="hidden sm:inline text-gray-300">•</span>
              <span className="flex items-center gap-1.5 font-bold text-[#2E7D32]">
                <span>💵 Cash on Delivery (COD)</span>
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={onShopClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-[#8B263E] via-[#731D31] to-[#4F1522] hover:from-[#A02C48] hover:to-[#641A2B] transition-all flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl active:scale-98 border border-[#D4AF37]/50 cursor-pointer"
              >
                <span>Shop Skincare Range</span>
                <ArrowRight className="w-4 h-4 text-[#FFF3B0]" />
              </button>

              <button
                type="button"
                onClick={() => onQuickView(featuredProduct)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-[#3B1C22] bg-white border-2 border-[#E8C2B9] hover:border-[#D4AF37] hover:bg-[#FFF7F6] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Routine & Ingredients</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-5 text-xs text-[#7A585F]">
              <div className="flex -space-x-2">
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Customer"
                />
                <img
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80"
                  alt="Customer"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                  <span className="font-bold text-[#2D1B1E] ml-1">4.95/5</span>
                </div>
                <span className="text-[11px] text-[#8C646B]">
                  Over 12,000+ orders fulfilled nationwide
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Showcase Card with Featured Product */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Rotating gold halo */}
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square rounded-3xl p-1 bg-gradient-to-tr from-[#D4AF37] via-[#FFF3B0] to-[#E8CA65] shadow-2xl">
              <div className="w-full h-full bg-white rounded-[22px] overflow-hidden p-5 flex flex-col justify-between relative group">
                
                {/* Floating Tag */}
                <div className="absolute top-6 left-6 z-10 bg-[#2D161A] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-[#D4AF37]/50">
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Editor's Luxury Pick</span>
                </div>

                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FFF9F9]">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                    <p className="font-bold font-serif-luxury text-base text-[#FFF3B0] drop-shadow-xs">
                      {featuredProduct.name}
                    </p>
                    <p className="text-[11px] text-white/90 drop-shadow-xs">
                      {featuredProduct.tagline}
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#8C646B] block">Nationwide COD Price:</span>
                    <span className="text-xl font-bold font-serif-luxury text-[#2D1B1E]">
                      Rs. {featuredProduct.price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onBuyNow(featuredProduct, 1)}
                    className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B263E] to-[#60192A] hover:from-[#A02C48] hover:to-[#761E34] transition-all flex items-center gap-1.5 shadow-md active:scale-95 border border-[#D4AF37]/40 cursor-pointer"
                  >
                    <span>Instant COD Order</span>
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
