const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    enum: ['INR', 'USD', 'EUR', 'GBP'],
    default: 'INR',
  },
  taxRate: {
    type: Number,
    default: 10,
  },
  invoicePrefix: {
    type: String,
    default: 'INV-',
  },
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  autoBackup: {
    type: Boolean,
    default: true,
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("Settings", SettingsSchema);
