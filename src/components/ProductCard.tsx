import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Zap, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { QuantitySelector } from './QuantitySelector';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onBuyNow,
  onQuickView,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-[#F2D6D0] hover:border-[#D4AF37]/70 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.isBestSeller && (
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#E8CA65] text-[#2D1B1E] text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#2D1B1E]" />
            Best Seller
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-[#8B263E] text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full shadow-xs">
            Save {discountPercent}%
          </span>
        )}
      </div>

      {/* Quick View Button on Image Hover */}
      <div className="relative aspect-square overflow-hidden bg-[#FFF9F9] cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="bg-white/95 text-[#2D1B1E] hover:bg-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all border border-[#D4AF37]/50"
          >
            <Eye className="w-3.5 h-3.5 text-[#B8860B]" />
            Quick Ingredients & Routine
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#B8860B]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-[#2D1B1E]">
              <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="font-bold text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-[#8C646B] text-[11px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-serif-luxury text-base sm:text-lg font-bold text-[#2D1B1E] group-hover:text-[#8B263E] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#7A585F] mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* Pricing */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-extrabold text-[#2D1B1E]">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#A8888E] line-through font-medium">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[11px] text-[#2E7D32] font-semibold bg-[#E8F5E9] px-2 py-0.5 rounded-full ml-auto">
              COD Available
            </span>
          </div>
        </div>

        {/* Dynamic Quantity Selector */}
        <div className="pt-2 border-t border-[#F5E1DC]">
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            compact={false}
            showPresets={true}
          />
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 border ${
              addedAnimation
                ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                : 'bg-white text-[#3B1C22] border-[#E8C2B9] hover:border-[#D4AF37] hover:bg-[#FFF7F6] active:scale-98'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4 animate-scale-in" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-[#B8860B]" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#8B263E] to-[#68192C] hover:from-[#A02C48] hover:to-[#7A1E34] transition-all flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md active:scale-98 border border-[#D4AF37]/30 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#FFF3B0] fill-[#FFF3B0]" />
            <span>Order COD</span>
          </button>
        </div>
      </div>
    </div>
  );
};
