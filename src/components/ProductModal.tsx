import React, { useState } from 'react';
import { X, Star, CheckCircle2, Droplets, Sparkles, Shield, Truck, ShoppingBag, Zap } from 'lucide-react';
import { Product } from '../types';
import { QuantitySelector } from './QuantitySelector';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howTo'>('benefits');

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/40 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-20 p-2 text-gray-500 hover:text-black bg-white/80 hover:bg-white rounded-full transition-all shadow-xs border border-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Key Attributes */}
          <div className="bg-[#FFF8F7] p-6 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-[#F2D6D0]">
            <div className="relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-white">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] py-1 px-2.5 rounded-lg flex items-center justify-between">
                <span>{product.volume}</span>
                <span className="text-[#F1D26E]">Pakistani Formula</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-5 grid grid-cols-2 gap-2 w-full text-[11px] text-[#6E474E]">
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-[#F2D6D0]">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Free COD (3-4 Days)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 rounded-xl border border-[#F2D6D0]">
                <Shield className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>100% Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Details & Dynamic Quantity */}
          <div className="p-6 flex flex-col justify-between space-y-4 max-h-[85vh] overflow-y-auto">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B8860B] bg-[#FFF8E7] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-[#8C646B]">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2D1B1E] mt-1">
                {product.name}
              </h2>
              <p className="text-xs text-[#8C646B] italic mt-0.5">{product.tagline}</p>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-[#2D1B1E]">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-semibold text-[#8B263E] bg-[#FFF2F0] px-2 py-0.5 rounded-md ml-auto">
                  Taxes Included
                </span>
              </div>

              <p className="text-xs text-[#523A3E] mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Tabs: Benefits / Ingredients / How to Use */}
              <div className="mt-4 pt-3 border-t border-[#F2D6D0]">
                <div className="flex gap-2 border-b border-[#F2D6D0] pb-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('benefits')}
                    className={`font-semibold pb-1 transition-colors ${
                      activeTab === 'benefits'
                        ? 'text-[#8B263E] border-b-2 border-[#D4AF37]'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Key Benefits
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('ingredients')}
                    className={`font-semibold pb-1 transition-colors ${
                      activeTab === 'ingredients'
                        ? 'text-[#8B263E] border-b-2 border-[#D4AF37]'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Ingredients
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('howTo')}
                    className={`font-semibold pb-1 transition-colors ${
                      activeTab === 'howTo'
                        ? 'text-[#8B263E] border-b-2 border-[#D4AF37]'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    How To Use
                  </button>
                </div>

                <div className="pt-2 text-xs text-[#523A3E] min-h-[90px]">
                  {activeTab === 'benefits' && (
                    <ul className="space-y-1.5">
                      {product.benefits.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32] mt-0.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'ingredients' && (
                    <p className="leading-relaxed bg-[#FFF8F7] p-2.5 rounded-xl border border-[#F2D6D0] font-mono text-[11px]">
                      {product.ingredients}
                    </p>
                  )}

                  {activeTab === 'howTo' && (
                    <p className="leading-relaxed bg-[#FFF8F7] p-2.5 rounded-xl border border-[#F2D6D0]">
                      {product.howToUse}
                    </p>
                  )}
                </div>
              </div>

              {/* Dynamic Quantity Selector */}
              <div className="mt-4 pt-3 border-t border-[#F2D6D0]">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  showPresets={true}
                />
              </div>

              {/* Total Calculation */}
              <div className="mt-3 flex items-center justify-between text-xs bg-[#FFF8F7] p-2.5 rounded-xl border border-[#F2D6D0]">
                <span className="text-[#6E474E] font-medium">
                  Total for {quantity} {quantity === 1 ? 'unit' : 'units'}:
                </span>
                <span className="font-bold text-sm text-[#2D1B1E]">
                  Rs. {(product.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#3B1C22] bg-white border-2 border-[#E8C2B9] hover:border-[#D4AF37] hover:bg-[#FFF8F7] transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4 text-[#B8860B]" />
                <span>Add to Bag</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#8B263E] to-[#68192C] hover:from-[#A02C48] hover:to-[#7A1E34] transition-all flex items-center justify-center gap-1.5 shadow-md border border-[#D4AF37]/40 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-[#FFF3B0] fill-[#FFF3B0]" />
                <span>Instant COD Order</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
