const Settings = require('../models/Settings');

// Get settings
exports.getSettings = async (req, res) => {
  try {
    // Get the first settings document or create default settings if none exists
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        companyName: 'Your Company',
        email: 'contact@company.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Street',
        currency: 'INR',
        taxRate: 10,
        invoicePrefix: 'INV-',
        emailNotifications: true,
        autoBackup: true,
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      // If no settings exist, create new settings
      const newSettings = await Settings.create(req.body);
      return res.json(newSettings);
    }
    // Update existing settings
    Object.assign(settings, req.body);
    settings.updatedAt = Date.now();
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
