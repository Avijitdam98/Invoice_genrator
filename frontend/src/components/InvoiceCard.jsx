import React from 'react';
import { motion } from 'framer-motion';
import { 
  HiDocumentText, 
  HiCurrencyRupee, 
  HiCalendar, 
  HiUser,
  HiPencil,
  HiPrinter,
  HiTrash
} from 'react-icons/hi';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const InvoiceCard = ({ invoice, onSelect, isSelected, onDelete }) => {
  const navigate = useNavigate();

  const statusColors = {
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    unpaid: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    hover: {
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.9 }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  const getStatus = (invoice) => {
    if (invoice.status?.toLowerCase() === 'paid') return 'paid';
    if (invoice.status?.toLowerCase() === 'unpaid') return 'unpaid';
    if (!invoice.dueDate) return 'unpaid';
    
    const now = new Date();
    const dueDate = new Date(invoice.dueDate);
    
    if (isNaN(dueDate.getTime())) return 'unpaid';
    return now > dueDate ? 'overdue' : 'unpaid';
  };

  const status = getStatus(invoice);

  if (!invoice) return null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-white dark:bg-gray-800 rounded-xl p-6 cursor-pointer border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <motion.div
            variants={iconVariants}
            className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg"
          >
            <HiDocumentText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              #{invoice._id?.slice(-6) || 'No ID'}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <HiUser className="w-4 h-4 mr-1" />
              {invoice.clientName || 'No Client Name'}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.input
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(invoice._id)}
            className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
          />
          <motion.span
            whileHover={{ scale: 1.05 }}
            className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <HiCurrencyRupee className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm font-medium">Amount</p>
            <p className="text-lg font-semibold">{formatCurrency(invoice.total || invoice.totalAmount || 0)}</p>
          </div>
        </div>
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <HiCalendar className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-sm font-medium">Due Date</p>
            <p className="text-base">
              {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-4 h-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full overflow-hidden"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ 
            width: status === 'paid' ? '100%' : 
                   status === 'unpaid' ? '50%' : '75%'
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full"
        />
      </motion.div>

      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate(`/edit-invoice/${invoice._id}`)}
          className="p-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          title="Edit Invoice"
        >
          <HiPencil className="h-5 w-5" />
        </motion.button>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => navigate(`/invoice/print/${invoice._id}`)}
          className="p-2 text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
          title="Print Invoice"
        >
          <HiPrinter className="h-5 w-5" />
        </motion.button>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => onDelete(invoice._id)}
          className="p-2 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
          title="Delete Invoice"
        >
          <HiTrash className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InvoiceCard;
