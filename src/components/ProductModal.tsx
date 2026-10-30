import React, { useState } from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  Droplets, 
  Sparkles, 
  Shield, 
  Truck, 
  ShoppingBag, 
  Zap,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  Share2
} from 'lucide-react';
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedAdPack, setCopiedAdPack] = useState(false);

  if (!product) return null;

  // Direct shareable page URL and direct image URL for Advertisements & Socials
  const origin = typeof window !== 'undefined' && window.location.origin 
    ? window.location.origin 
    : 'https://www.mwcosmetics.store';
  const directProductUrl = `${origin}/?product=${encodeURIComponent(product.id)}`;
  const directImageUrl = product.image;

  const copyToClipboard = async (text: string, type: 'link' | 'image' | 'adPack') => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    if (type === 'link') {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } else if (type === 'image') {
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2200);
    } else {
      setCopiedAdPack(true);
      setTimeout(() => setCopiedAdPack(false), 2200);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | MW Cosmetics`,
          text: `${product.name} - ${product.tagline}. Price: Rs. ${product.price.toLocaleString()} with Free COD delivery across Pakistan!`,
          url: directProductUrl,
        });
      } catch {
        // User cancelled or dismissed
      }
    } else {
      copyToClipboard(directProductUrl, 'link');
    }
  };

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
          className="absolute top-4 right-4 z-20 p-2 text-gray-500 hover:text-black bg-white/80 hover:bg-white rounded-full transition-all shadow-xs border border-gray-200 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Key Attributes & Direct Ad Links */}
          <div className="bg-[#FFF8F7] p-5 sm:p-6 flex flex-col items-center justify-between relative border-b md:border-b-0 md:border-r border-[#F2D6D0] overflow-y-auto max-h-[85vh]">
            <div className="w-full flex flex-col items-center">
              <div className="relative w-full max-w-[260px] aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <span className="absolute top-2.5 left-2.5 z-10 bg-[#8B263E] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-md border border-[#D4AF37]/60 tracking-wide">
                  40% OFF
                </span>
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
              <div className="mt-3.5 grid grid-cols-2 gap-2 w-full text-[11px] text-[#6E474E]">
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

            {/* Direct Product Link & Image for Advertisements */}
            <div className="mt-4 w-full bg-white rounded-2xl p-3 border border-[#E8C2B9] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#8B263E]" />
                  <span className="text-[11px] font-bold text-[#2D1B1E] uppercase tracking-wider">
                    Direct Ad & Share Links
                  </span>
                </div>
                <span className="text-[10px] bg-[#FFF2F0] text-[#8B263E] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  Ads Ready
                </span>
              </div>

              {/* 1. Direct Page Link */}
              <div>
                <label className="block text-[10px] font-bold text-[#6E474E] mb-1">
                  Direct Product Page URL (For Ads & Campaigns):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={directProductUrl}
                    className="w-full bg-[#FFF9F8] border border-[#F2D6D0] rounded-lg px-2 py-1.5 text-[11px] text-[#2D1B1E] font-mono select-all focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(directProductUrl, 'link')}
                    className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all border cursor-pointer ${
                      copiedLink
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                        : 'bg-[#FFF2F0] hover:bg-[#FFE5E0] text-[#8B263E] border-[#F2D6D0]'
                    }`}
                    title="Copy direct product URL"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* 2. Direct Image Link */}
              <div>
                <label className="block text-[10px] font-bold text-[#6E474E] mb-1">
                  Direct Image URL (For Ad Creatives):
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={directImageUrl}
                    className="w-full bg-[#FFF9F8] border border-[#F2D6D0] rounded-lg px-2 py-1.5 text-[11px] text-[#2D1B1E] font-mono select-all focus:outline-hidden truncate"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(directImageUrl, 'image')}
                    className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all border cursor-pointer ${
                      copiedImage
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32]'
                        : 'bg-[#FFF2F0] hover:bg-[#FFE5E0] text-[#8B263E] border-[#F2D6D0]'
                    }`}
                    title="Copy direct image URL"
                  >
                    {copiedImage ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedImage ? 'Copied' : 'Copy'}</span>
                  </button>
                  <a
                    href={directImageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-[#8B263E] hover:text-[#2D1B1E] bg-[#FFF2F0] rounded-lg border border-[#F2D6D0] cursor-pointer"
                    title="View high-res image in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Ad Bundle & Native Share */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#F2D6D0]">
                <button
                  type="button"
                  onClick={() => {
                    const adPack = `Product: ${product.name}\nPrice: Rs. ${product.price.toLocaleString()} (Cash on Delivery)\nProduct Link: ${directProductUrl}\nImage Link: ${directImageUrl}`;
                    copyToClipboard(adPack, 'adPack');
                  }}
                  className="flex-1 py-1.5 px-2 bg-gray-50 hover:bg-gray-100 text-[#4A2E33] border border-gray-200 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedAdPack ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAdPack ? 'Ad Details Copied!' : 'Copy Full Ad Details'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="py-1.5 px-2.5 bg-[#FFF2F0] hover:bg-[#FFE5E0] text-[#8B263E] border border-[#F2D6D0] rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Share product link"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </button>
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
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-2xl font-extrabold text-[#2D1B1E]">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-extrabold text-white bg-[#8B263E] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/50 shadow-2xs">
                  40% OFF
                </span>
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
