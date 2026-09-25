import React, { useState } from 'react';
import { X, Phone, Mail, Clock, MessageSquare, MapPin, Send, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { BRAND_ASSETS } from '../data/initialProducts';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;
    setSubmitted(true);
    setTimeout(() => {
      // Keep state for viewing confirmation
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#D4AF37]/50 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2E161A] via-[#3E1B22] to-[#2E161A] p-6 text-white text-center relative border-b border-[#D4AF37]/30">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#E8C2B9] hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF3B0] text-[#2E161A] flex items-center justify-center shadow-lg mb-2">
            <Phone className="w-6 h-6" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Customer Concierge
          </span>
          <h2 className="font-serif-luxury text-2xl font-bold mt-0.5">
            Help & Direct Support
          </h2>
          <p className="text-xs text-[#E8C2B9] mt-1">
            Dedicated team available 6 days a week across Pakistan
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Quick Direct Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Phone Call Card */}
            <a
              href={BRAND_ASSETS.callUrl}
              className="bg-[#FFF8F7] hover:bg-[#FFEFEF] p-3.5 rounded-2xl border border-[#F2D6D0] hover:border-[#D4AF37] transition-all flex flex-col justify-between group shadow-2xs"
              title="Click to Call 03288608585"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#8B263E] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Phone className="w-4 h-4 text-[#FFF3B0]" />
                </div>
                <div>
                  <span className="font-bold text-[#2D1B1E] block text-xs">Direct Call</span>
                  <span className="text-[10px] text-[#2E7D32] font-semibold">Toll-Free Dial</span>
                </div>
              </div>
              <div>
                <span className="text-[#8B263E] font-bold block text-xs tracking-tight">
                  {BRAND_ASSETS.supportPhoneDisplay}
                </span>
                <span className="text-[10px] text-[#8C646B] mt-0.5 block">{BRAND_ASSETS.supportHours}</span>
              </div>
            </a>

            {/* WhatsApp Chat Card */}
            <a
              href={BRAND_ASSETS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#F0FFF4] hover:bg-[#E6FFEC] p-3.5 rounded-2xl border border-[#9AE6B4] hover:border-[#2E7D32] transition-all flex flex-col justify-between group shadow-2xs"
              title="Click to Chat on WhatsApp: 03288608585"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                  <MessageSquare className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="font-bold text-[#1E4620] block text-xs">WhatsApp Chat</span>
                  <span className="text-[10px] text-[#2E7D32] font-semibold">Instant Reply</span>
                </div>
              </div>
              <div>
                <span className="text-[#1E4620] font-bold block text-xs tracking-tight">
                  {BRAND_ASSETS.supportPhoneDisplay}
                </span>
                <span className="text-[10px] text-[#2F855A] mt-0.5 block">Tap to chat with consultant</span>
              </div>
            </a>

            {/* Official Email Card */}
            <a
              href={BRAND_ASSETS.emailUrl}
              className="bg-[#FFF8F7] hover:bg-[#FFEFEF] p-3.5 rounded-2xl border border-[#F2D6D0] hover:border-[#D4AF37] transition-all flex flex-col justify-between group shadow-2xs"
              title="Click to send email to mwcosmetics8585@gmail.com"
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#8B263E] text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-4 h-4 text-[#FFF3B0]" />
                </div>
                <div>
                  <span className="font-bold text-[#2D1B1E] block text-xs">Official Email</span>
                  <span className="text-[10px] text-[#8C646B]">Mailbox Composer</span>
                </div>
              </div>
              <div>
                <span className="text-[#8B263E] font-bold block text-xs break-all leading-tight">
                  {BRAND_ASSETS.supportEmail}
                </span>
                <span className="text-[10px] text-[#8C646B] mt-0.5 block">Response within 2 hours</span>
              </div>
            </a>
          </div>

          {/* Message Form */}
          {submitted ? (
            <div className="p-6 bg-[#F0FFF4] border border-[#9AE6B4] rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#2E7D32] mx-auto" />
              <h3 className="font-bold text-base text-[#22543D]">Message Received!</h3>
              <p className="text-xs text-[#2F855A]">
                Thank you for contacting MW Cosmetics. Our beauty consultant will reach out to you at{' '}
                <strong>{phone}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-3 text-xs font-semibold text-[#22543D] underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 bg-[#FFFDFD] p-4 rounded-2xl border border-[#F2D6D0]">
              <span className="text-xs font-bold text-[#4A2E33] uppercase tracking-wider block">
                Send Direct Message to MW Skincare Specialists
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#523A3E] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fatima Ali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#F2D6D0] rounded-xl text-xs focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#523A3E] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#F2D6D0] rounded-xl text-xs focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#523A3E] mb-1">Your Question or Inquiry</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ask about skin type compatibility, routine suggestions, or order tracking..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#F2D6D0] rounded-xl text-xs focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#8B263E] to-[#591424] hover:from-[#9E2B47] hover:to-[#6E192D] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-[#FFF3B0]" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}

          {/* Frequently Asked Questions */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A2E33]">
              Quick Skincare & Delivery FAQs
            </h4>
            
            <div className="space-y-1.5 text-xs text-[#523A3E]">
              <div className="p-3 bg-[#FFF8F7] rounded-xl border border-[#F2D6D0]">
                <p className="font-bold text-[#2D1B1E]">How fast is delivery to Karachi, Lahore, or Islamabad?</p>
                <p className="text-[11px] text-[#7A585F] mt-0.5">
                  Major cities receive parcels within 3 business days via TCS & Leopards. Remote towns may take up to 4 days. Shipping is 100% Free!
                </p>
              </div>

              <div className="p-3 bg-[#FFF8F7] rounded-xl border border-[#F2D6D0]">
                <p className="font-bold text-[#2D1B1E]">Are MW Cosmetics formulas suitable for sensitive Pakistani skin?</p>
                <p className="text-[11px] text-[#7A585F] mt-0.5">
                  Yes, each formula has been tailored specifically for Pakistani weather (humid summers and dry winters). They are non-comedogenic, cruelty-free, and formulated at healthy pH 5.5.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
