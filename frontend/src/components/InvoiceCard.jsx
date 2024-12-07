import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { invoiceApi } from '../services/api';
import { HiPrinter, HiPencil, HiTrash } from 'react-icons/hi';

const InvoiceCard = ({ invoice, onDelete, isSelected, onSelect }) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/invoices/edit/${invoice._id}`);
  };

  const handlePrint = () => {
    navigate(`/invoices/print/${invoice._id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        setIsDeleting(true);
        await invoiceApi.deleteInvoice(invoice._id);
        toast.success('Invoice deleted successfully');
        onDelete(invoice._id);
      } catch (error) {
        console.error('Error deleting invoice:', error);
        toast.error('Failed to delete invoice');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Calculate totals from items
  const calculateTotals = () => {
    if (!invoice.items || !Array.isArray(invoice.items)) {
      return { subtotal: 0, gstAmount: 0, taxAmount: 0, totalAmount: 0 };
    }

    const subtotal = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const gstAmount = invoice.items.reduce((sum, item) => sum + ((item.quantity * item.price) * item.gstRate / 100), 0);
    const taxAmount = invoice.items.reduce((sum, item) => sum + ((item.quantity * item.price) * item.taxRate / 100), 0);
    const totalAmount = subtotal + gstAmount + taxAmount;

    return { subtotal, gstAmount, taxAmount, totalAmount };
  };

  const totals = calculateTotals();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600"
        />
      </div>

      <div className="flex justify-between items-start mb-4 pl-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {invoice.clientName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Invoice #{invoice._id.slice(-6)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {format(new Date(invoice.createdAt), 'MMM dd, yyyy')}
          </p>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(invoice.status)}`}>
            {invoice.status || 'Pending'}
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(totals.totalAmount)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            GST: {formatCurrency(totals.gstAmount)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tax: {formatCurrency(totals.taxAmount)}
          </p>
        </div>
      </div>

      <div className="border-t dark:border-gray-700 pt-4 mt-4">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p className="text-gray-600 dark:text-gray-400">
              {invoice.items?.length || 0} items
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
              title="View PDF"
            >
              <HiPrinter className="w-5 h-5" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-full transition-colors"
              title="Edit Invoice"
            >
              <HiPencil className="w-5 h-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete Invoice"
            >
              <HiTrash className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
