import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Sparkles, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';
import { QuantitySelector } from './QuantitySelector';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#F2D6D0] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#F2D6D0] bg-[#FFF8F7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8B263E]" />
              <h2 className="font-serif-luxury text-lg font-bold text-[#2D1B1E]">
                Your Shopping Bag
              </h2>
              <span className="text-xs bg-[#8B263E] text-white font-bold px-2 py-0.5 rounded-full">
                {totalItemsCount}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 text-gray-500 hover:text-black rounded-lg hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Policy Highlight */}
          <div className="bg-gradient-to-r from-[#FFF5F3] to-[#FFF9F6] p-3 border-b border-[#F2D6D0] text-xs flex items-center gap-2 text-[#6E474E]">
            <Truck className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span className="font-semibold text-[#8B263E]">
              Free Nationwide COD Delivery:
            </span>
            <span>3-4 Days to your doorstep</span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF2F0] flex items-center justify-center border border-[#F2D6D0]">
                  <ShoppingBag className="w-8 h-8 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="font-serif-luxury text-lg font-bold text-[#2D1B1E]">
                    Your bag is empty
                  </p>
                  <p className="text-xs text-[#8C646B] mt-1 max-w-xs">
                    Explore our Pakistani glass skin routine and treat your skin to pure gold radiance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#3B1C22] hover:bg-[#522931] transition-colors shadow-xs"
                >
                  Explore Skincare Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-[#FFFDFD] p-3.5 rounded-2xl border border-[#F2D6D0] shadow-2xs hover:border-[#D4AF37]/50 transition-all flex gap-3"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-[#F2D6D0] shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif-luxury text-sm font-bold text-[#2D1B1E] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id)}
                          aria-label="Remove item"
                          className="text-gray-400 hover:text-red-600 transition-colors p-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#8C646B] mt-0.5">
                        Rs. {item.product.price.toLocaleString()} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F8E5E1]">
                      {/* Compact Stepper in Cart */}
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(newQty) => onUpdateQuantity(item.product.id, newQty)}
                        compact={true}
                        showPresets={false}
                      />

                      <span className="font-bold text-sm text-[#2D1B1E]">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#F2D6D0] bg-[#FFF8F7] space-y-3">
              <div className="space-y-1.5 text-xs text-[#523A3E]">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItemsCount} items):</span>
                  <span className="font-semibold text-[#2D1B1E]">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#2E7D32]">
                  <span className="flex items-center gap-1 font-semibold">
                    <Truck className="w-3.5 h-3.5" /> Nationwide Delivery:
                  </span>
                  <span className="font-bold uppercase tracking-wider">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2D1B1E] pt-2 border-t border-[#F2D6D0]">
                  <span>Total Payable:</span>
                  <span className="text-[#8B263E] font-serif-luxury text-lg">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#8B263E] via-[#731D31] to-[#591424] hover:from-[#9E2B47] hover:to-[#6E192D] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-98 border border-[#D4AF37]/50 cursor-pointer"
                >
                  <span>Proceed to Cash on Delivery</span>
                  <ArrowRight className="w-4 h-4 text-[#FFF3B0]" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8C646B] pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>No Advance Payment Required • Pay Cash to Rider</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
