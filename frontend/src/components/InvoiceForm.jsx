import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { invoiceApi } from "../services/api";
import SignaturePad from './SignaturePad';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(!!id);
  const [formData, setFormData] = useState({
    clientName: "",
    services: [{ description: "", amount: "0.00" }],
    total: "0.00",
    status: "Pending",
    dueDate: new Date().toISOString().split('T')[0],
    signature: null
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateTotal = (services) => {
    return services.reduce((sum, service) => {
      const amount = parseFloat(service.amount) || 0;
      return sum + amount;
    }, 0).toFixed(2);
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await invoiceApi.getInvoiceById(id);
          const invoice = response.data;
          
          // Calculate total from services
          const total = invoice.services.reduce(
            (sum, service) => sum + (parseFloat(service.amount) || 0),
            0
          ).toFixed(2);

          setFormData({
            clientName: invoice.clientName || "",
            services: invoice.services?.map(service => ({
              description: service.description || "",
              amount: (parseFloat(service.amount) || 0).toFixed(2)
            })) || [{ description: "", amount: "0.00" }],
            total: total,
            status: invoice.status || "Pending",
            dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] 
                                   : new Date().toISOString().split('T')[0],
            signature: invoice.signature
          });
        } catch (error) {
          console.error("Error fetching invoice:", error);
          toast.error("Failed to fetch invoice details");
          navigate("/invoices");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchInvoice();
  }, [id, navigate]);

  const handleServiceChange = (index, field, value) => {
    const newServices = [...formData.services];
    
    if (field === "amount") {
      // Remove non-numeric characters except decimal
      value = value.replace(/[^\d.]/g, '');
      
      // Ensure only one decimal point
      const parts = value.split('.');
      if (parts.length > 2) return;
      
      // Limit to 2 decimal places
      if (parts[1] && parts[1].length > 2) return;
      
      // Convert empty to zero
      value = value || "0.00";
    }
    
    newServices[index] = { ...newServices[index], [field]: value };
    
    setFormData({
      ...formData,
      services: newServices,
      total: calculateTotal(newServices)
    });
  };

  const addService = () => {
    const newServices = [...formData.services, { description: "", amount: "0.00" }];
    setFormData({
      ...formData,
      services: newServices,
      total: calculateTotal(newServices)
    });
  };

  const removeService = (index) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      services: newServices,
      total: calculateTotal(newServices)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.clientName.trim()) {
        toast.error("Client name is required");
        return;
      }

      if (!formData.services.some(service => service.description.trim())) {
        toast.error("At least one service with description is required");
        return;
      }

      // Calculate final total
      const total = formData.services.reduce(
        (sum, service) => sum + (parseFloat(service.amount) || 0),
        0
      ).toFixed(2);

      const submitData = {
        clientName: formData.clientName.trim(),
        services: formData.services.map(service => ({
          description: service.description.trim(),
          amount: parseFloat(service.amount) || 0
        })),
        total: parseFloat(total),
        totalAmount: parseFloat(total), // For backward compatibility
        status: formData.status,
        dueDate: formData.dueDate,
        signature: formData.signature
      };

      if (id) {
        await invoiceApi.updateInvoice(id, submitData);
        toast.success("Invoice updated successfully");
      } else {
        await invoiceApi.createInvoice(submitData);
        toast.success("Invoice created successfully");
      }
      navigate("/invoices");
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error(error.response?.data?.message || "Failed to save invoice");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl p-10 mx-auto mt-12 space-y-10 bg-white dark:bg-gray-800 shadow-md rounded-2xl"
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
        {id ? "Edit Invoice" : "Create Invoice"}
      </h2>

      <div className="space-y-8">
        {/* Client Name */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Client Name
          </label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) =>
              setFormData({ ...formData, clientName: e.target.value })
            }
            className="block w-full px-4 py-3 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 border rounded-lg shadow-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter client's name"
            required
          />
        </div>

        {/* Services */}
        <div className="space-y-4">
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-200">Services</label>
          {formData.services.map((service, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={service.description}
                  onChange={(e) =>
                    handleServiceChange(index, "description", e.target.value)
                  }
                  placeholder="Service description"
                  className="w-full px-4 py-2 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
              </div>
              <div className="w-32">
                <input
                  type="text"
                  value={service.amount}
                  onChange={(e) =>
                    handleServiceChange(index, "amount", e.target.value)
                  }
                  placeholder="Amount"
                  className="w-full px-4 py-2 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                  required
                />
              </div>
              {formData.services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addService}
            className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            Add Service
          </button>
        </div>

        {/* Total Amount */}
        <div className="mt-6">
          <div className="flex justify-between items-center py-4 border-t border-gray-200 dark:border-gray-600">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Total Amount:</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-200">
              {formatCurrency(parseFloat(formData.total))}
            </span>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="block w-full px-4 py-3 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border rounded-lg shadow-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            className="block w-full px-4 py-3 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 border rounded-lg shadow-sm border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Signature Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">Digital Signature</h3>
          <SignaturePad
            onSave={(signatureData) => setFormData(prev => ({ ...prev, signature: signatureData }))}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="px-5 py-3 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-3 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {id ? "Update Invoice" : "Create Invoice"}
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
