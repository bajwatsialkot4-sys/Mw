import React, { useState } from 'react';
import { 
  X, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  Home, 
  Compass, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Sparkles
} from 'lucide-react';
import { CartItem, Order, ShippingDetails } from '../types';
import { PAKISTAN_CITIES, BRAND_ASSETS } from '../data/initialProducts';
import { saveOrderToDatabase } from '../firebase';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
}) => {
  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: '',
    phone: '03',
    alternatePhone: '',
    email: '',
    city: 'Lahore',
    address: '',
    landmark: '',
    notes: '',
  });

  const [customCity, setCustomCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Auto-format Pakistani phone number (03XX-XXXXXXX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (!raw.startsWith('03') && raw.length > 0) {
      if (raw.startsWith('3')) {
        raw = '0' + raw;
      } else if (!raw.startsWith('0')) {
        raw = '03' + raw;
      }
    }
    raw = raw.slice(0, 11);

    let formatted = raw;
    if (raw.length > 4) {
      formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
    }

    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters.';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Active Pakistani phone number is required.';
    } else if (cleanPhone.length !== 11 || !cleanPhone.startsWith('03')) {
      newErrors.phone = 'Enter valid 11-digit Pakistani phone (e.g. 0300-1234567).';
    }

    if (formData.city === 'Other City in Pakistan' && !customCity.trim()) {
      newErrors.city = 'Please specify your city name.';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Please provide complete house/apartment and street address.';
    } else if (formData.address.trim().length < 8) {
      newErrors.address = 'Please specify detailed street and house address for courier delivery.';
    }

    if (!formData.landmark.trim()) {
      newErrors.landmark = 'Nearest landmark helps courier rider locate your address easily.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (items.length === 0) return;

    setIsSubmitting(true);

    try {
      const selectedCity = formData.city === 'Other City in Pakistan' && customCity.trim()
        ? customCity.trim()
        : formData.city;

      const randomDigits = Math.floor(10000 + Math.random() * 90000);
      const orderNumber = `MW-${randomDigits}`;

      const orderPayload: Omit<Order, 'id'> = {
        orderNumber,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image
        })),
        totalAmount,
        shippingFee: 0, // Free Shipping Nationwide
        shippingDetails: {
          ...formData,
          city: selectedCity
        },
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Pending',
        courier: 'TCS / Leopards COD'
      };

      // Direct write to Firestore / Database - NO WhatsApp redirection!
      const createdOrder = await saveOrderToDatabase(orderPayload);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#E8C2B9', '#8B263E', '#FFFFFF']
        });
      } catch (err) {
        // Confetti fallback
      }

      setIsSubmitting(false);
      onOrderCompleted(createdOrder);
      onClose();
    } catch (err) {
      console.error('Failed to submit order:', err);
      setIsSubmitting(false);
      setErrors({ form: 'An error occurred while confirming your order. Please try again.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/50 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3B1C22] via-[#2A1418] to-[#3B1C22] text-white p-5 sm:p-6 border-b border-[#D4AF37]/40 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="absolute top-5 right-5 text-[#E8C2B9] hover:text-white p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>MW Cosmetics Direct Checkout</span>
          </div>

          <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">
            Cash on Delivery Order Form
          </h2>

          <p className="text-xs text-[#E8C2B9] mt-1 max-w-lg leading-relaxed">
            {BRAND_ASSETS.deliveryBanner}
          </p>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Order Summary Strip */}
          <div className="bg-[#FFF8F7] p-3.5 rounded-2xl border border-[#F2D6D0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[#8C646B] font-medium block">
                Order Items ({items.reduce((acc, i) => acc + i.quantity, 0)} units):
              </span>
              <span className="font-semibold text-[#2D1B1E]">
                {items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')}
              </span>
            </div>
            <div className="sm:text-right shrink-0">
              <span className="text-xs text-[#8C646B] block">Total Payable at Doorstep:</span>
              <span className="font-serif-luxury text-lg font-bold text-[#8B263E]">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-xs font-bold text-[#4A2E33] uppercase tracking-wider mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-[#9A7077]" />
              <input
                type="text"
                placeholder="e.g. Ayesha Khan"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDFD] border border-[#F2D6D0] rounded-xl text-sm text-[#2D1B1E] focus:outline-hidden focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Pakistani Phone Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#4A2E33] uppercase tracking-wider">
                Active Pakistani Mobile Number <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-[#8C646B]">Rider will call for delivery</span>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-3 flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#8B263E] border-r border-[#F2D6D0] pr-2">🇵🇰 +92</span>
              </div>
              <input
                type="tel"
                placeholder="0300-1234567"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={12}
                className="w-full pl-20 pr-4 py-2.5 bg-[#FFFDFD] border border-[#F2D6D0] rounded-xl text-sm font-semibold tracking-wider text-[#2D1B1E] focus:outline-hidden focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </div>
            {errors.phone ? (
              <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>
            ) : (
              <p className="text-[10px] text-[#8C646B] mt-1">Format: 03XX-XXXXXXX (11 digits)</p>
            )}
          </div>

          {/* City Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A2E33] uppercase tracking-wider mb-1.5">
                Destination City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#9A7077]" />
                <select
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full pl-10 pr-8 py-2.5 bg-[#FFFDFD] border border-[#F2D6D0] rounded-xl text-sm text-[#2D1B1E] focus:outline-hidden focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 appearance-none cursor-pointer"
                >
                  {PAKISTAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              {errors.city && (
                <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>
              )}
            </div>

            {formData.city === 'Other City in Pakistan' ? (
              <div>
                <label className="block text-xs font-bold text-[#4A2E33] uppercase tracking-wider mb-1.5">
                  Enter Your City Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kasur, Turbat, Muzaffarabad"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FFFDFD] border border-[#F2D6D0] rounded-xl text-sm text-[#2D1B1E] focus:outline-hidden focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-[#4A2E33] uppercase tracking-wider mb-1.5">
                  Alternate Phone / WhatsApp (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-[#9A7077]" />
                  <input
                    type="tel"
                    placeholder="03XX-XXXXXXX"
                    value={formData.alternatePhone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, alternatePhone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDFD] border border-[#F2D6D0] rounded-xl text-sm text-[#2D1B1E] focus:outline-hidden focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Complete Delivery Address */}
          <div>
            <label className="block text-xs font-bold text-[#4A2E33] uppercase tracking-wider mb-1.5">
              Complete Delivery Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Home className="absolute left-3.5 top-3 w-4 h-4 text-[#9A7077]" />
              <textarea
                rows={2}
                placeholder="House/Apartment #, Street number, Block/Sector, Area name"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDFD] border border-[#F2D6D0] rounded-xl text-sm text-[#2D1B1E] focus:outline-hidden focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 leading-relaxed"
              />
            </div>
            {errors.address && (
              <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>
            )}
          </div>

          {/* Nearest Landmark */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#4A2E33] uppercase tracking-wider">
                Nearest Famous Landmark <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-[#8C646B]">Essential for courier rider</span>
            </div>
            <div className="relative">
              <Compass className="absolute left-3.5 top-3 w-4 h-4 text-[#9A7077]" />
              <input
                type="text"
                placeholder="e.g. Near Shell Petrol Pump, Behind Masjid Bilal, Opposite Commercial Market"
                value={formData.landmark}
                onChange={(e) => setFormData(prev => ({ ...prev, landmark: e.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDFD] border border-[#F2D6D0] rounded-xl text-sm text-[#2D1B1E] focus:outline-hidden focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              />
            </div>
            {errors.landmark && (
              <p className="text-[11px] text-red-600 mt-1">{errors.landmark}</p>
            )}
          </div>

          {/* Payment Method Badge */}
          <div className="bg-[#F0FFF4] border border-[#C6F6D5] p-3 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#38A169] text-white flex items-center justify-center font-bold text-xs">
                COD
              </div>
              <div>
                <span className="text-xs font-bold text-[#22543D] block">
                  Cash on Delivery (Standard)
                </span>
                <span className="text-[11px] text-[#2F855A]">
                  Pay in PKR cash only when the parcel arrives at your address.
                </span>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-[#38A169] shrink-0" />
          </div>

          {/* Submission Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-[#8B263E] via-[#731D31] to-[#4A1620] hover:from-[#9E2B47] hover:to-[#5E1B29] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-98 border border-[#D4AF37]/60 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-[#FFF3B0]" />
                  <span>Submitting to Database...</span>
                </>
              ) : (
                <>
                  <Truck className="w-5 h-5 text-[#FFF3B0]" />
                  <span>Confirm Order (Rs. {totalAmount.toLocaleString()} COD)</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-[#8C646B] mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Direct Database submission. No WhatsApp redirection required.</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
