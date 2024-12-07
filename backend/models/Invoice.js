const mongoose = require("mongoose");

// Define the Invoice schema
const InvoiceSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true, // Ensures clientName is provided
  },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      gstRate: { type: Number, default: 18 }, // GST rate in percentage
      taxRate: { type: Number, default: 5 },  // Additional tax rate in percentage
      amount: { type: Number, required: true }
    },
  ],
  subtotal: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  taxAmount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  currency: {
    type: String,
    enum: ["INR", "USD", "EUR", "GBP"],
    default: "INR",
    required: true,
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid", "Pending"], // Enforcing the allowed status values
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  signature: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
