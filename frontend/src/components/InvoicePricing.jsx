import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const TAX_RATES = {
  'IN-MH': { // Maharashtra
    'GST': 18,
    'CGST': 9,
    'SGST': 9
  },
  'IN-DL': { // Delhi
    'GST': 18,
    'CGST': 9,
    'SGST': 9
  },
  // Add more states/regions as needed
};

const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
};

const InvoicePricing = ({ 
  subtotal, 
  location = 'IN-MH',
  onPriceUpdate,
  initialDiscount = { type: DISCOUNT_TYPES.PERCENTAGE, value: 0 }
}) => {
  const [discountType, setDiscountType] = useState(initialDiscount.type);
  const [discountValue, setDiscountValue] = useState(initialDiscount.value);
  const [taxRate, setTaxRate] = useState(TAX_RATES[location]?.GST || 0);
  const [showSplitTax, setShowSplitTax] = useState(true);

  useEffect(() => {
    calculateTotal();
  }, [subtotal, discountType, discountValue, taxRate]);

  const calculateDiscount = () => {
    if (discountType === DISCOUNT_TYPES.PERCENTAGE) {
      return (subtotal * discountValue) / 100;
    }
    return Math.min(discountValue, subtotal);
  };

  const calculateTotal = () => {
    const discountAmount = calculateDiscount();
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * taxRate) / 100;
    const total = afterDiscount + taxAmount;

    onPriceUpdate({
      subtotal,
      discountAmount,
      taxAmount,
      total,
      taxDetails: showSplitTax ? {
        CGST: taxAmount / 2,
        SGST: taxAmount / 2
      } : { GST: taxAmount }
    });
  };

  const handleDiscountTypeChange = (e) => {
    setDiscountType(e.target.value);
    setDiscountValue(0); // Reset value when changing type
  };

  const handleDiscountValueChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    if (discountType === DISCOUNT_TYPES.PERCENTAGE && value > 100) {
      toast.error('Discount percentage cannot exceed 100%');
      return;
    }
    if (discountType === DISCOUNT_TYPES.FIXED && value > subtotal) {
      toast.error('Discount amount cannot exceed subtotal');
      return;
    }
    setDiscountValue(value);
  };

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Pricing Details</h3>
      
      {/* Discount Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Discount
        </label>
        <div className="flex space-x-2">
          <select
            value={discountType}
            onChange={handleDiscountTypeChange}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value={DISCOUNT_TYPES.PERCENTAGE}>Percentage (%)</option>
            <option value={DISCOUNT_TYPES.FIXED}>Fixed Amount</option>
          </select>
          <input
            type="number"
            value={discountValue}
            onChange={handleDiscountValueChange}
            min="0"
            max={discountType === DISCOUNT_TYPES.PERCENTAGE ? "100" : subtotal}
            step="0.01"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>

      {/* Tax Section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tax Location
        </label>
        <select
          value={location}
          onChange={(e) => {
            const newLocation = e.target.value;
            setTaxRate(TAX_RATES[newLocation]?.GST || 0);
          }}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
        >
          {Object.keys(TAX_RATES).map((loc) => (
            <option key={loc} value={loc}>
              {loc.split('-')[1]} ({TAX_RATES[loc].GST}% GST)
            </option>
          ))}
        </select>
      </div>

      {/* Split Tax Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="splitTax"
          checked={showSplitTax}
          onChange={(e) => setShowSplitTax(e.target.checked)}
          className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700"
        />
        <label htmlFor="splitTax" className="text-sm text-gray-700 dark:text-gray-300">
          Split GST into CGST/SGST
        </label>
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-600 dark:text-red-400">
            <span>Discount:</span>
            <span>-₹{calculateDiscount().toFixed(2)}</span>
          </div>
          {showSplitTax ? (
            <>
              <div className="flex justify-between">
                <span>CGST ({taxRate/2}%):</span>
                <span>₹{((subtotal - calculateDiscount()) * (taxRate/2) / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST ({taxRate/2}%):</span>
                <span>₹{((subtotal - calculateDiscount()) * (taxRate/2) / 100).toFixed(2)}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between">
              <span>GST ({taxRate}%):</span>
              <span>₹{((subtotal - calculateDiscount()) * taxRate / 100).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
            <span>Total:</span>
            <span>₹{(subtotal - calculateDiscount() + ((subtotal - calculateDiscount()) * taxRate / 100)).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePricing;
