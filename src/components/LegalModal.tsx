import React from 'react';
import { X, ShieldCheck, Truck, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { BRAND_ASSETS } from '../data/initialProducts';

interface LegalModalProps {
  type: 'privacy' | 'shipping' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isShipping = type === 'shipping';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/50 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2A1418] via-[#3B1C22] to-[#2A1418] p-6 text-white text-center relative border-b border-[#D4AF37]/30">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#E8C2B9] hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF3B0] text-[#2A1418] flex items-center justify-center shadow-lg mb-2">
            {isShipping ? <Truck className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>

          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            {isShipping ? 'Official Nationwide Logistics' : 'Customer Trust & Confidentiality'}
          </span>

          <h2 className="font-serif-luxury text-2xl font-bold mt-0.5">
            {isShipping ? 'Shipping Policy & COD Guidelines' : 'Privacy Policy & Data Security'}
          </h2>

          <p className="text-xs text-[#E8C2B9] mt-1">
            MW Cosmetics Pakistan • Effective 2026
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-[#4A2E33] leading-relaxed">
          {isShipping ? (
            <>
              <div className="bg-[#FFF8F7] p-4 rounded-2xl border border-[#F2D6D0] space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#8B263E]">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Free Shipping Across Pakistan</span>
                </div>
                <p>
                  Every order placed on the official MW Cosmetics platform qualifies for <strong>100% Free Nationwide Delivery</strong>. There are no hidden handling fees, fuel surcharges, or minimum cart threshold penalties.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#2D1B1E] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>Delivery Timelines (3 to 4 Business Days)</span>
                </h3>
                <p>
                  Orders received before 4:00 PM PKT are dispatched the same day from our primary fulfillment hub. Major metropolitan cities (including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, and Sialkot) typically receive delivery within <strong>3 business days</strong>. Sub-urban and northern areas receive deliveries in <strong>4 business days</strong>.
                </p>

                <h3 className="font-bold text-sm text-[#2D1B1E] flex items-center gap-1.5 pt-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>Cash on Delivery (COD) Rules</span>
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-[#6E474E]">
                  <li>You only pay cash in PKR to the courier rider upon physical delivery of your sealed box.</li>
                  <li>Please keep the exact cash amount ready to ensure swift handover.</li>
                  <li>The courier will send an SMS dispatch notification prior to arrival.</li>
                </ul>

                <h3 className="font-bold text-sm text-[#2D1B1E] flex items-center gap-1.5 pt-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>Packaging & Damaged Parcel Guarantee</span>
                </h3>
                <p>
                  All MW Cosmetics glass bottles and cosmetic jars are insulated with shock-resistant double bubble wrapping and gold tamper-evident security tape. In the rare case of transit damage, report within 24 hours to{' '}
                  <a
                    href={BRAND_ASSETS.callUrl}
                    className="font-bold text-[#8B263E] underline hover:text-[#2D1B1E]"
                  >
                    {BRAND_ASSETS.supportPhoneDisplay}
                  </a>{' '}
                  or email{' '}
                  <a
                    href={BRAND_ASSETS.emailUrl}
                    className="font-bold text-[#8B263E] underline hover:text-[#2D1B1E]"
                  >
                    {BRAND_ASSETS.supportEmail}
                  </a>{' '}
                  for an immediate replacement at zero cost.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#FFF8F7] p-4 rounded-2xl border border-[#F2D6D0] space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold text-[#8B263E]">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>Your Data Privacy is Guaranteed</span>
                </div>
                <p>
                  MW Cosmetics collects only the essential delivery details (Name, Pakistani Phone Number, City, Address, and Landmark) required to dispatch and fulfill your Cash on Delivery parcel through licensed courier partners.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-sm text-[#2D1B1E]">1. Information We Collect</h3>
                <p>
                  When placing an order, you submit your delivery coordinates directly into our encrypted database. We do not store or process credit/debit card numbers on this website since all orders are fulfilled via Cash on Delivery (COD).
                </p>

                <h3 className="font-bold text-sm text-[#2D1B1E] pt-2">2. Direct Order Database Protection</h3>
                <p>
                  All customer orders are stored directly in our secure Firestore database infrastructure. We do NOT rely on unencrypted third-party links or WhatsApp redirect traps to submit your order data.
                </p>

                <h3 className="font-bold text-sm text-[#2D1B1E] pt-2">3. Zero Third-Party Selling</h3>
                <p>
                  We strictly never sell, rent, or trade your telephone number or home address to advertisers or spammers. Your phone number is utilized solely by our dispatch team and courier riders to deliver your skincare package.
                </p>
              </div>
            </>
          )}

          <div className="pt-4 border-t border-[#F2D6D0] flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 bg-[#3B1C22] text-white rounded-xl font-bold text-xs hover:bg-[#522931] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
