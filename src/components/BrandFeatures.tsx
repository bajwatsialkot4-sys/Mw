import React from 'react';
import { Sparkles, Droplets, Sun, Moon, Check, ShieldCheck, Heart, Truck, ThumbsUp } from 'lucide-react';
import { Product } from '../types';

interface BrandFeaturesProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const BrandFeatures: React.FC<BrandFeaturesProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const steps = [
    {
      step: '01',
      title: 'Purify & Clarify',
      productName: 'Premium Glass Skin Face Wash',
      desc: 'Gentle pH 5.5 fermented rice foam removes impurities without stripping moisture.',
      time: 'Morning & Night',
      icon: Droplets,
    },
    {
      step: '02',
      title: 'Target & Refine',
      productName: 'Oil Control Glow Serum',
      desc: '10% Niacinamide + Zinc PCA tightens pores and eliminates excess shine.',
      time: 'Mid-routine',
      icon: Sparkles,
    },
    {
      step: '03',
      title: 'Glaze & Seal',
      productName: 'Glaze Glow Gel Moisturizer',
      desc: '24K gold flakes and triple ceramides lock in 72-hour dewy hydration.',
      time: 'Finish with Glow',
      icon: Sun,
    },
  ];

  const testimonials = [
    {
      name: 'Mahnoor Tariq',
      city: 'Lahore (DHA)',
      product: 'Complete 3-Step Routine',
      quote: 'Honestly blown away! In Lahore heat my face used to turn greasy within 2 hours. The Oil Control Serum + Glaze Gel kept my skin glowing yet matte all day. Received within 3 days via TCS COD!',
      rating: 5,
    },
    {
      name: 'Dr. Sarah Bilal',
      city: 'Karachi (Clifton)',
      product: 'Premium Glass Skin Face Wash',
      quote: 'As a dermatologist, I love the pH 5.5 balance and fermented rice water. It cleanses sunscreen effortlessly without making the skin feel stretchy. 100% recommended for Pakistani humidity.',
      rating: 5,
    },
    {
      name: 'Hiba Kashif',
      city: 'Islamabad (F-8)',
      product: 'Glaze Glow Gel Moisturizer',
      quote: 'The 24K gold flakes melt right into the skin! It leaves a real glass donut sheen that looks like you drank 4 liters of water. Beautiful packaging and super fast free shipping.',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-[#FFFDFD] space-y-16">
      {/* 3-Step Routine Breakdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-[#B8860B] uppercase tracking-widest inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Easy 3-Step Glass Skin Ritual
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-[#2C181C]">
            Formulated in Harmony for Maximum Radiance
          </h2>
          <p className="text-xs sm:text-sm text-[#7A585F] leading-relaxed">
            Each formulation is engineered to synergize with the next, unlocking high-definition glass skin translucency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const matchedProduct = products.find(p => p.name === item.productName);
            const Icon = item.icon;

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#F2D6D0] hover:border-[#D4AF37] transition-all shadow-2xs hover:shadow-lg relative overflow-hidden flex flex-col justify-between group"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif-luxury text-3xl font-extrabold text-[#F2D6D0] group-hover:text-[#D4AF37] transition-colors">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF5F3] text-[#8B263E] flex items-center justify-center border border-[#F2D6D0]">
                    <Icon className="w-5 h-5 text-[#B8860B]" />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-[#8C646B] uppercase tracking-wider block">
                    {item.time}
                  </span>
                  <h3 className="font-serif-luxury text-lg font-bold text-[#2C181C] mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#8B263E] mt-0.5">
                    {item.productName}
                  </p>
                  <p className="text-xs text-[#6A4E54] mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#F8E5E1] flex items-center justify-between">
                  {matchedProduct ? (
                    <>
                      <span className="font-serif-luxury font-bold text-sm text-[#2C181C]">
                        Rs. {matchedProduct.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectProduct(matchedProduct)}
                        className="text-xs font-bold text-[#8B263E] hover:text-[#2C181C] flex items-center gap-1 underline underline-offset-2 cursor-pointer"
                      >
                        View Formula
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Pakistani Customer Reviews */}
      <div className="bg-[#FFF5F3]/50 py-14 border-y border-[#F5E1DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
            <span className="text-xs font-bold text-[#8B263E] uppercase tracking-wider">
              Real Pakistani Skin Stories
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2C181C]">
              Loved Across Karachi, Lahore & Islamabad
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#F2D6D0] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#D4AF37] mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                    <span className="text-xs font-bold text-[#2C181C] ml-1">Verified Buyer</span>
                  </div>

                  <p className="text-xs text-[#523A3E] italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F5E1DC] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#2C181C]">{t.name}</p>
                    <p className="text-[11px] text-[#8C646B]">{t.city}</p>
                  </div>
                  <span className="text-[10px] text-[#8B263E] font-semibold bg-[#FFF0ED] px-2 py-0.5 rounded-full">
                    {t.product}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
