import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  HiUser, 
  HiMail, 
  HiPhone, 
  HiCurrencyRupee, 
  HiCalendar,
  HiLocationMarker,
  HiDocument,
  HiClock
} from 'react-icons/hi';

const InvoiceDetails = ({ invoice, isOpen, onClose }) => {
  const statusColors = {
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <motion.div 
      variants={itemVariants}
      className="flex items-start space-x-3"
    >
      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
        <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-base font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl shadow-xl"
            variants={modalVariants}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Invoice #{invoice.invoiceNumber}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Created on {format(new Date(invoice.createdAt), 'MMMM dd, yyyy')}
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[invoice.status]}`}
              >
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </motion.div>
            </div>

            {/* Client Information */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              variants={itemVariants}
            >
              <InfoItem
                icon={HiUser}
                label="Client Name"
                value={invoice.clientName}
              />
              <InfoItem
                icon={HiMail}
                label="Email"
                value={invoice.clientEmail}
              />
              <InfoItem
                icon={HiPhone}
                label="Phone"
                value={invoice.clientPhone}
              />
              <InfoItem
                icon={HiLocationMarker}
                label="Address"
                value={invoice.clientAddress}
              />
            </motion.div>

            {/* Invoice Details */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              variants={itemVariants}
            >
              <InfoItem
                icon={HiCurrencyRupee}
                label="Total Amount"
                value={formatCurrency(invoice.amount)}
              />
              <InfoItem
                icon={HiCalendar}
                label="Due Date"
                value={format(new Date(invoice.dueDate), 'MMMM dd, yyyy')}
              />
              <InfoItem
                icon={HiDocument}
                label="Invoice Items"
                value={`${invoice.items?.length || 0} items`}
              />
              <InfoItem
                icon={HiClock}
                label="Payment Terms"
                value={invoice.paymentTerms || 'Net 30'}
              />
            </motion.div>

            {/* Items Table */}
            <motion.div
              variants={itemVariants}
              className="mt-6 border dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Item</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Rate</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {invoice.items?.map((item, index) => (
                    <motion.tr
                      key={index}
                      variants={itemVariants}
                      className="bg-white dark:bg-gray-800"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{formatCurrency(item.rate)}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{formatCurrency(item.amount)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Actions */}
            <motion.div 
              className="flex justify-end space-x-4 mt-8"
              variants={itemVariants}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={onClose}
              >
                Close
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={() => window.print()}
              >
                Print Invoice
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InvoiceDetails;
