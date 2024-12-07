import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceApi } from '../services/api';
import SignaturePad from './SignaturePad';
import { toast } from 'react-hot-toast';

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clientName, setClientName] = useState('');
  const [status, setStatus] = useState('Unpaid');
  const [items, setItems] = useState([{
    description: '',
    quantity: 1,
    price: 0,
    gstRate: 18,
    taxRate: 5,
    amount: 0
  }]);
  const [signature, setSignature] = useState(null);

  // Fetch invoice data if in edit mode
  useEffect(() => {
    const fetchInvoice = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await invoiceApi.getInvoiceById(id);
        const invoice = response.data;

        setClientName(invoice.clientName || '');
        setStatus(invoice.status || 'Unpaid');
        setSignature(invoice.signature || null);
        
        if (invoice.items && invoice.items.length > 0) {
          setItems(invoice.items.map(item => ({
            description: item.description || '',
            quantity: item.quantity || 1,
            price: item.price || 0,
            gstRate: item.gstRate || 18,
            taxRate: item.taxRate || 5,
            amount: calculateItemAmount(item)
          })));
        }
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Failed to load invoice');
        navigate('/invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, navigate]);

  const calculateItemAmount = (item) => {
    const baseAmount = item.quantity * item.price;
    const gstAmount = baseAmount * (item.gstRate / 100);
    const taxAmount = baseAmount * (item.taxRate / 100);
    return baseAmount + gstAmount + taxAmount;
  };

  const handleItemChange = (index, field, value) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
      newItems[index].amount = calculateItemAmount(newItems[index]);
      return newItems;
    });
  };

  const addItem = () => {
    setItems(prev => [...prev, {
      description: '',
      quantity: 1,
      price: 0,
      gstRate: 18,
      taxRate: 5,
      amount: 0
    }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      toast.error('Cannot remove the last item');
      return;
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    return items.reduce((totals, item) => {
      const baseAmount = item.quantity * item.price;
      const gstAmount = baseAmount * (item.gstRate / 100);
      const taxAmount = baseAmount * (item.taxRate / 100);
      
      return {
        subtotal: totals.subtotal + baseAmount,
        gstAmount: totals.gstAmount + gstAmount,
        taxAmount: totals.taxAmount + taxAmount,
        total: totals.total + baseAmount + gstAmount + taxAmount
      };
    }, { subtotal: 0, gstAmount: 0, taxAmount: 0, total: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clientName.trim()) {
      toast.error('Please enter client name');
      return;
    }

    if (items.some(item => !item.description.trim())) {
      toast.error('Please fill in all item descriptions');
      return;
    }

    try {
      setSaving(true);
      
      // Calculate all totals
      const totals = calculateTotals();
      
      const invoiceData = {
        clientName,
        status,
        items: items.map(item => ({
          description: item.description,
          quantity: Number(item.quantity),
          price: Number(item.price),
          gstRate: Number(item.gstRate),
          taxRate: Number(item.taxRate),
          amount: Number(item.quantity) * Number(item.price)
        })),
        subtotal: totals.subtotal,
        gstAmount: totals.gstAmount,
        taxAmount: totals.taxAmount,
        totalAmount: totals.total,
        signature,
        currency: 'INR'
      };

      if (id) {
        await invoiceApi.updateInvoice(id, invoiceData);
        toast.success('Invoice updated successfully');
      } else {
        await invoiceApi.createInvoice(invoiceData);
        toast.success('Invoice created successfully');
      }

      navigate('/invoices');
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast.error(id ? 'Failed to update invoice' : 'Failed to create invoice');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          {id ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>

        {/* Client Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Client Name
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          />
        </div>

        {/* Status Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Invoice Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              + Add Item
            </button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GST Rate %
                </label>
                <select
                  value={item.gstRate}
                  onChange={(e) => handleItemChange(index, 'gstRate', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tax Rate %
                </label>
                <select
                  value={item.taxRate}
                  onChange={(e) => handleItemChange(index, 'taxRate', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                </select>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="absolute -right-2 -top-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-8 border-t dark:border-gray-700 pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">GST:</span>
                <span className="font-medium">₹{totals.gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                <span className="font-medium">₹{totals.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t dark:border-gray-700 pt-3">
                <span className="font-semibold">Total:</span>
                <span className="font-bold">₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Signature</h3>
          <SignaturePad
            value={signature}
            onChange={setSignature}
          />
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : (id ? 'Update Invoice' : 'Create Invoice')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default InvoiceForm;
