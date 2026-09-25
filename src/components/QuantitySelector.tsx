import React from 'react';
import { Minus, Plus, Sparkles } from 'lucide-react';

interface QuantitySelectorProps {
  value: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  compact?: boolean;
  showPresets?: boolean;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  onChange,
  min = 1,
  max = 100,
  compact = false,
  showPresets = true
}) => {
  const presets = [1, 2, 4, 10, 20, 50];

  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val < min) onChange(min);
      else if (val > max) onChange(max);
      else onChange(val);
    } else if (e.target.value === '') {
      onChange(min);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center border border-[#E8C2B9] bg-white rounded-lg overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={handleDecrease}
          disabled={value <= min}
          aria-label="Decrease quantity"
          className="p-1.5 px-2.5 text-[#5A383E] hover:bg-[#FFF0ED] active:scale-95 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleCustomInput}
          className="w-10 text-center text-xs font-semibold text-[#2D2326] border-none focus:outline-hidden py-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={handleIncrease}
          disabled={value >= max}
          aria-label="Increase quantity"
          className="p-1.5 px-2.5 text-[#5A383E] hover:bg-[#FFF0ED] active:scale-95 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#6E474E]">
          Select Quantity:
        </span>
        {value >= 2 && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#B8860B] bg-[#FFF8E7] px-2 py-0.5 rounded-full border border-[#D4AF37]/30 animate-pulse">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            {value >= 10 ? 'Wholesale Tier' : value >= 4 ? 'Family Set' : 'Popular Bundle'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Stepper with custom input */}
        <div className="flex items-center border-2 border-[#E8C2B9]/80 rounded-xl bg-white overflow-hidden shadow-xs hover:border-[#D4AF37] transition-all">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={value <= min}
            aria-label="Decrease quantity"
            className="p-2 sm:p-2.5 text-[#5A383E] hover:bg-[#FFF0ED] active:scale-95 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={handleCustomInput}
            className="w-14 sm:w-16 text-center font-bold text-sm sm:text-base text-[#2D2326] border-none focus:outline-hidden py-1.5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <button
            type="button"
            onClick={handleIncrease}
            disabled={value >= max}
            aria-label="Increase quantity"
            className="p-2 sm:p-2.5 text-[#5A383E] hover:bg-[#FFF0ED] active:scale-95 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <span className="text-xs text-[#7A585F] font-medium hidden sm:inline">
          {value === 1 ? 'Unit' : 'Units'}
        </span>
      </div>

      {/* Quick Select Presets: 1, 2, 4, 10, 20, 50+ */}
      {showPresets && (
        <div className="pt-1">
          <div className="text-[11px] text-[#8C686F] mb-1.5 flex items-center justify-between">
            <span>Quick Select:</span>
            <span className="text-[10px] text-[#D4AF37] font-medium">Any quantity up to 50+</span>
          </div>
          <div className="grid grid-cols-6 gap-1.5">
            {presets.map((preset) => {
              const isSelected = value === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChange(preset)}
                  className={`py-1.5 px-1 rounded-lg text-xs font-semibold transition-all text-center border ${
                    isSelected
                      ? 'bg-[#3B1C22] text-white border-[#3B1C22] shadow-sm scale-[1.02]'
                      : 'bg-white text-[#5A383E] border-[#E8C2B9]/70 hover:border-[#D4AF37] hover:bg-[#FFF9F9]'
                  }`}
                >
                  {preset}{preset === 50 ? '+' : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
