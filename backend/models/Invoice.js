const mongoose = require("mongoose");

// Define the Invoice schema
const InvoiceSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true, // Ensures clientName is provided
  },
  services: [
    {
      description: { type: String, required: true },
      amount: { type: Number, required: true },
    },
  ],
  total: {
    type: Number,
    required: true, // Ensures total is provided
  },
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
