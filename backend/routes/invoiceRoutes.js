const express = require("express");
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController");

const router = express.Router();

// Define routes for handling invoices
router.post("/", createInvoice); // Create a new invoice
router.get("/", getAllInvoices); // Get all invoices
router.get("/:id", getInvoiceById); // Get a specific invoice by ID
router.put("/:id", updateInvoice); // Update an invoice by ID
router.delete("/:id", deleteInvoice); // Delete an invoice by ID

module.exports = router;
