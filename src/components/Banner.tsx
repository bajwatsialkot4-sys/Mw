import React from 'react';
import { Truck, ShieldCheck, Sparkles, Clock } from 'lucide-react';
import { BRAND_ASSETS } from '../data/initialProducts';

export const Banner: React.FC = () => {
  return (
    <div className="w-full">
      {/* Top Prominent Promotional Announcement Bar */}
      <div className="bg-gradient-to-r from-[#68192C] via-[#8B263E] to-[#68192C] text-white py-2.5 px-4 border-b border-[#D4AF37]/60 shadow-sm relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center relative z-10">
          <Sparkles className="w-4 h-4 text-[#FFF3B0] animate-pulse shrink-0" />
          <p className="text-xs sm:text-sm font-extrabold tracking-wide text-[#FFF3B0]">
            Special Offer: Get 40% OFF on all products!
          </p>
          <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37] text-[#2D1B1E] px-2 py-0.5 rounded-full shadow-2xs">
            Limited-Time Offer
          </span>
        </div>
      </div>

      {/* Existing Shipping & Trust Bar */}
      <div className="bg-gradient-to-r from-[#2A161A] via-[#3D1E24] to-[#2A161A] text-white text-xs sm:text-sm py-2 px-3 border-b border-[#D4AF37]/30 shadow-inner relative overflow-hidden">
        {/* Decorative Gold particles glow */}
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 relative z-10">
          <div className="hidden lg:flex items-center gap-2 text-[#E8C2B9] text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>100% Authentic Luxury Skincare • Halal & Cruelty Free</span>
          </div>

          <div className="flex-1 flex items-center justify-center gap-2 font-medium tracking-wide text-center">
            <Truck className="w-4 h-4 text-[#D4AF37] animate-pulse shrink-0" />
            <span className="text-[#FFF7F5] font-semibold">
              {BRAND_ASSETS.deliveryBanner}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs text-[#E8C2B9]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>3-4 Days Dispatch</span>
            </span>
            <span className="text-white/30">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>100% Sealed Fresh</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

