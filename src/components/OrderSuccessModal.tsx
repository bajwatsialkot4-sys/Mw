import React from 'react';
import { CheckCircle, Truck, Package, Calendar, MapPin, Printer, ArrowRight, Sparkles } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  // Calculate 3-4 business days delivery estimate
  const orderDate = new Date(order.createdAt);
  const deliveryStart = new Date(orderDate);
  deliveryStart.setDate(deliveryStart.getDate() + 3);
  const deliveryEnd = new Date(orderDate);
  deliveryEnd.setDate(deliveryEnd.getDate() + 4);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-PK', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/50 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Header */}
        <div className="bg-gradient-to-br from-[#2D161A] via-[#3F1C23] to-[#2D161A] text-white p-6 sm:p-7 text-center relative overflow-hidden border-b border-[#D4AF37]/30">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF3B0] text-[#2D161A] flex items-center justify-center shadow-lg mb-3">
            <CheckCircle className="w-9 h-9 stroke-[2.5]" />
          </div>

          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D4AF37] inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Order Placed Successfully
          </span>

          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold mt-1">
            Thank You, {order.shippingDetails.fullName.split(' ')[0]}!
          </h2>

          <p className="text-xs text-[#E8C2B9] mt-1">
            Your parcel is registered in our database with Order ID{' '}
            <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded-sm">
              #{order.orderNumber}
            </span>
          </p>
        </div>

        {/* Details Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          {/* Estimated Delivery Timeline */}
          <div className="bg-[#FFF8F7] p-4 rounded-2xl border border-[#F2D6D0] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B263E] text-white flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-[#FFF3B0]" />
            </div>
            <div>
              <span className="text-xs text-[#8C646B] font-semibold block uppercase tracking-wider">
                Estimated Delivery Window (3-4 Days):
              </span>
              <span className="text-sm font-bold text-[#2D1B1E]">
                {formatDate(deliveryStart)} — {formatDate(deliveryEnd)}
              </span>
            </div>
          </div>

          {/* Delivery Address & Landmark */}
          <div className="space-y-1.5 p-3.5 rounded-2xl border border-[#F2D6D0] bg-[#FAFAFA]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B263E] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>Nationwide Shipping Destination</span>
            </div>
            <p className="font-semibold text-[#2D1B1E] text-sm">
              {order.shippingDetails.fullName} • {order.shippingDetails.phone}
            </p>
            <p className="text-xs text-[#523A3E]">
              {order.shippingDetails.address}, {order.shippingDetails.city}
            </p>
            <p className="text-xs text-[#8C646B]">
              <span className="font-semibold text-[#523A3E]">Nearest Landmark:</span> {order.shippingDetails.landmark}
            </p>
          </div>

          {/* Items Breakdown */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-bold text-[#4A2E33] block">
              Ordered Products
            </span>
            <div className="divide-y divide-[#F2D6D0] border border-[#F2D6D0] rounded-2xl p-2 bg-white">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 px-1 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-10 h-10 rounded-lg object-cover border border-[#F2D6D0]"
                    />
                    <div>
                      <p className="font-bold text-[#2D1B1E]">{item.productName}</p>
                      <p className="text-[11px] text-[#8C646B]">Qty: {item.quantity} × Rs. {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#2D1B1E]">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Totals */}
          <div className="bg-[#FFF8F7] p-3.5 rounded-2xl border border-[#F2D6D0] space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#8C646B]">Subtotal:</span>
              <span className="font-medium">Rs. {order.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#2E7D32]">
              <span>Nationwide Shipping:</span>
              <span className="font-bold">FREE (Rs. 0)</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#2D1B1E] pt-2 border-t border-[#F2D6D0]">
              <span>Payable on Delivery:</span>
              <span className="text-[#8B263E] font-serif-luxury text-lg">
                Rs. {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Notice */}
          <div className="flex items-center gap-2 text-xs text-[#6E474E] bg-[#FFF2F0] p-3 rounded-xl border border-[#F2D6D0]">
            <Truck className="w-4 h-4 text-[#8B263E] shrink-0" />
            <span>
              Our courier rider will deliver the sealed parcel directly to your address and collect{' '}
              <strong>Rs. {order.totalAmount.toLocaleString()}</strong> in cash.
            </span>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold text-[#3B1C22] bg-white border border-[#E8C2B9] hover:bg-[#FFF8F7] transition-all flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-[#8B263E]" />
              <span>Print Invoice</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#3B1C22] hover:bg-[#4E242C] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
