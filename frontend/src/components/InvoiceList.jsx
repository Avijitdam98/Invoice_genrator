import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPlus, HiTrash, HiCheck } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import InvoiceCard from './InvoiceCard';
import { invoiceApi } from '../services/api';
import toast from 'react-hot-toast';

const InvoiceList = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const buttonVariants = {
    hover: { 
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.9 }
  };

  const bulkActionsVariants = {
    initial: { 
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    animate: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

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
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = () => {
    navigate('/create-invoice');
  };

  const handleDeleteSelected = async () => {
    if (selectedInvoices.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedInvoices.length} selected invoices?`)) {
      try {
        await Promise.all(selectedInvoices.map(id => invoiceApi.deleteInvoice(id)));
        toast.success('Selected invoices deleted successfully');
        setSelectedInvoices([]);
        fetchInvoices();
      } catch (error) {
        console.error('Error deleting selected invoices:', error);
        toast.error('Failed to delete some invoices');
      }
    }
  };

  const handleMarkAsPaid = async () => {
    if (selectedInvoices.length === 0) return;
    
    if (window.confirm(`Mark ${selectedInvoices.length} selected invoices as paid?`)) {
      try {
        await Promise.all(selectedInvoices.map(id => 
          invoiceApi.updateInvoice(id, { status: 'paid' })
        ));
        toast.success('Selected invoices marked as paid');
        setSelectedInvoices([]);
        fetchInvoices();
      } catch (error) {
        console.error('Error updating invoices:', error);
        toast.error('Failed to update some invoices');
      }
    }
  };

  const handleSelectInvoice = (id) => {
    setSelectedInvoices(prev => {
      if (prev.includes(id)) {
        return prev.filter(invoiceId => invoiceId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(invoice => invoice._id));
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          Invoices
        </motion.h1>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleCreateInvoice}
          title="Create Invoice"
          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
        >
          <HiPlus className="h-5 w-5" />
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col md:flex-row gap-4"
      >
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        />
        <motion.select
          whileFocus={{ scale: 1.02 }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="pending">Pending</option>
          <option value="overdue">Overdue</option>
        </motion.select>
      </motion.div>

      <AnimatePresence>
        {selectedInvoices.length > 0 && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={bulkActionsVariants}
            className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex justify-between items-center"
          >
            <span className="text-gray-700 dark:text-gray-300">
              {selectedInvoices.length} invoices selected
            </span>
            <div className="flex space-x-3">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleMarkAsPaid}
                title="Mark as Paid"
                className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
              >
                <HiCheck className="h-5 w-5" />
              </motion.button>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleDeleteSelected}
                title="Delete Selected"
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full"
              >
                <HiTrash className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredInvoices.map(invoice => (
          <InvoiceCard
            key={invoice._id}
            invoice={invoice}
            onSelect={handleSelectInvoice}
            isSelected={selectedInvoices.includes(invoice._id)}
            onDelete={(id) => {
              if (window.confirm('Are you sure you want to delete this invoice?')) {
                handleDeleteSelected([id]);
              }
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default InvoiceList;
