import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { invoiceApi } from '../services/api';
import InvoiceCard from './InvoiceCard';
import SearchAndFilter from './SearchAndFilter';
import { HiCheck, HiTrash } from 'react-icons/hi';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await invoiceApi.getAllInvoices();
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (invoiceId) => {
    setInvoices(prevInvoices => prevInvoices.filter(inv => inv._id !== invoiceId));
  };

  const handleSelect = (invoiceId) => {
    setSelectedInvoices(prev => {
      if (prev.includes(invoiceId)) {
        return prev.filter(id => id !== invoiceId);
      }
      return [...prev, invoiceId];
    });
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice._id));
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedInvoices.length) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedInvoices.length} selected invoices?`)) {
      try {
        setIsProcessing(true);
        await Promise.all(selectedInvoices.map(id => invoiceApi.deleteInvoice(id)));
        setInvoices(prev => prev.filter(invoice => !selectedInvoices.includes(invoice._id)));
        setSelectedInvoices([]);
        toast.success('Selected invoices deleted successfully');
      } catch (error) {
        console.error('Error deleting invoices:', error);
        toast.error('Failed to delete some invoices');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleMarkAsPaid = async () => {
    if (!selectedInvoices.length) return;

    if (window.confirm(`Mark ${selectedInvoices.length} selected invoices as paid?`)) {
      try {
        setIsProcessing(true);
        await Promise.all(selectedInvoices.map(id => 
          invoiceApi.updateInvoice(id, { status: 'paid' })
        ));
        
        setInvoices(prev => prev.map(invoice => {
          if (selectedInvoices.includes(invoice._id)) {
            return { ...invoice, status: 'paid' };
          }
          return invoice;
        }));
        
        setSelectedInvoices([]);
        toast.success('Selected invoices marked as paid');
      } catch (error) {
        console.error('Error updating invoices:', error);
        toast.error('Failed to update some invoices');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    // Safely convert search term to lowercase
    const search = searchTerm.toLowerCase().trim();
    
    // If no search term, only apply status filter
    if (!search) {
      return filterStatus === 'all' ? true : invoice.status?.toLowerCase() === filterStatus;
    }

    // Search across multiple fields
    const searchableFields = [
      invoice.clientName,
      invoice._id,
      invoice.status,
      invoice.items?.map(item => item.description).join(' '),
      String(invoice.total || invoice.totalAmount || ''),
      new Date(invoice.createdAt).toLocaleDateString(),
    ].map(field => String(field || '').toLowerCase());

    // Check if any field matches the search term
    const matchesSearch = searchableFields.some(field => field.includes(search));

    // Apply status filter if needed
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && invoice.status?.toLowerCase() === filterStatus.toLowerCase();
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />
        {selectedInvoices.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedInvoices.length} selected
            </span>
            <button
              onClick={handleMarkAsPaid}
              disabled={isProcessing}
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <HiCheck className="w-5 h-5" />
              <span>Mark as Paid</span>
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={isProcessing}
              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
              <HiTrash className="w-5 h-5" />
              <span>Delete Selected</span>
            </button>
          </div>
        )}
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterStatus !== 'all'
              ? 'No invoices match your search criteria'
              : 'No invoices found. Create your first invoice!'}
          </p>
        </div>
      ) : (
        <>
          {filteredInvoices.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={selectedInvoices.length === filteredInvoices.length}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:focus:ring-blue-600"
              />
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Select All
              </label>
            </div>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredInvoices.map(invoice => (
              <InvoiceCard
                key={invoice._id}
                invoice={invoice}
                onDelete={handleDelete}
                isSelected={selectedInvoices.includes(invoice._id)}
                onSelect={() => handleSelect(invoice._id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default InvoiceList;
