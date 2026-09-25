import React from 'react';
import { Lock, Sparkles, ShieldCheck, Truck, Phone, Mail, Heart, MessageSquare } from 'lucide-react';
import { BRAND_ASSETS } from '../data/initialProducts';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenShipping: () => void;
  onOpenContact: () => void;
  onOpenAdmin: () => void;
  onNavigateShop: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenShipping,
  onOpenContact,
  onOpenAdmin,
  onNavigateShop
}) => {
  return (
    <footer className="bg-gradient-to-b from-[#2B1418] to-[#1C0B0E] text-white pt-14 pb-8 border-t-2 border-[#D4AF37]/40 relative overflow-hidden">
      {/* Decorative Gold particles glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top Badges Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-10 border-b border-white/10 text-center">
          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5">
            <Truck className="w-6 h-6 text-[#D4AF37] mb-2" />
            <span className="text-xs font-bold text-[#FFF3B0]">Free Nationwide COD</span>
            <span className="text-[11px] text-[#E8C2B9] mt-0.5">3-4 Days Delivery Across Pakistan</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5">
            <Sparkles className="w-6 h-6 text-[#D4AF37] mb-2" />
            <span className="text-xs font-bold text-[#FFF3B0]">Glass Skin Radiance</span>
            <span className="text-[11px] text-[#E8C2B9] mt-0.5">24K Gold Dust & Niacinamide</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37] mb-2" />
            <span className="text-xs font-bold text-[#FFF3B0]">100% Genuine Guaranteed</span>
            <span className="text-[11px] text-[#E8C2B9] mt-0.5">Original Factory Sealed Formulas</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-2xl bg-white/5 border border-white/5">
            <Phone className="w-6 h-6 text-[#D4AF37] mb-2" />
            <span className="text-xs font-bold text-[#FFF3B0]">Dedicated Helpline</span>
            <span className="text-[11px] text-[#E8C2B9] mt-0.5">Live WhatsApp & Call Assistance</span>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={BRAND_ASSETS.logo}
                alt="MW Cosmetics"
                className="w-12 h-12 rounded-full border-2 border-[#D4AF37] object-cover"
              />
              <div>
                <span className="font-serif-luxury text-xl font-bold tracking-wider text-white">
                  MW <span className="text-[#D4AF37] italic font-normal">Cosmetics</span>
                </span>
                <span className="block text-[10px] uppercase tracking-[0.25em] text-[#E8C2B9]">
                  Luxury Skincare Atelier Pakistan
                </span>
              </div>
            </div>

            <p className="text-xs text-[#E8C2B9] leading-relaxed max-w-md">
              MW Cosmetics brings the coveted porcelain glass skin ritual to Pakistan. Infused with fermented botanicals, multi-molecular hyaluronic acid, and pure gold dust accents, our luxury formulations hydrate, refine pores, and impart an unparalleled lit-from-within luminosity.
            </p>

            <div className="text-xs text-[#FFF3B0] font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              <span>Orders dispatched daily via TCS & Leopards Courier</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif-luxury text-sm font-bold text-[#FFF3B0] tracking-wider uppercase">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-[#E8C2B9]">
              <li>
                <button
                  type="button"
                  onClick={onNavigateShop}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shop Skincare Catalog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenShipping}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Free Shipping & COD Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy & Data Security
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Customer Support & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif-luxury text-sm font-bold text-[#FFF3B0] tracking-wider uppercase">
              Support & Inquiries
            </h4>
            <div className="space-y-2.5 text-[#E8C2B9]">
              {/* Direct Phone Call Link */}
              <a
                href={BRAND_ASSETS.callUrl}
                title="Direct Phone Call: 03288608585"
                className="flex items-start gap-2 hover:text-[#FFF3B0] transition-colors group"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-semibold text-white block">Call Support</span>
                  <span className="text-[11px] underline underline-offset-2 decoration-[#D4AF37]/50 group-hover:decoration-[#FFF3B0]">
                    {BRAND_ASSETS.supportPhoneDisplay}
                  </span>
                </div>
              </a>

              {/* Direct WhatsApp Chat Link */}
              <a
                href={BRAND_ASSETS.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Direct WhatsApp Chat: 03288608585"
                className="flex items-start gap-2 hover:text-[#25D366] transition-colors group"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-semibold text-[#86EFAC] block">WhatsApp Chat</span>
                  <span className="text-[11px] text-[#D1FAE5] underline underline-offset-2 decoration-[#25D366]/60">
                    {BRAND_ASSETS.supportPhoneDisplay}
                  </span>
                </div>
              </a>

              {/* Direct Email Link */}
              <a
                href={BRAND_ASSETS.emailUrl}
                title="Send email to mwcosmetics8585@gmail.com"
                className="flex items-start gap-2 hover:text-[#FFF3B0] transition-colors group"
              >
                <Mail className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div>
                  <span className="font-semibold text-white block">Official Email</span>
                  <span className="text-[11px] underline underline-offset-2 decoration-[#D4AF37]/50 group-hover:decoration-[#FFF3B0] break-all">
                    {BRAND_ASSETS.supportEmail}
                  </span>
                </div>
              </a>

              <p className="text-[10px] text-[#A8888E] pt-1">
                {BRAND_ASSETS.supportHours}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Discrete Lock Icon for Admin Access */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#A8888E]">
          <p>© {new Date().getFullYear()} MW Cosmetics Pakistan. All rights reserved. Crafted for porcelain radiance.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#E8C2B9]">
              Handcrafted with <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" /> in Pakistan
            </span>

            {/* Discreet Admin Lock Icon */}
            <button
              type="button"
              onClick={onOpenAdmin}
              aria-label="Admin Portal"
              title="Secure Admin Portal"
              className="p-1.5 text-white/30 hover:text-[#D4AF37] rounded-full hover:bg-white/5 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
