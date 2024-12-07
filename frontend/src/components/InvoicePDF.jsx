import React from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import QRCode from "qrcode";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f9fafb",
    padding: 40,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#d1d5db",
    paddingBottom: 10,
  },
  companyName: {
    fontSize: 26,
    color: "#1f2937",
    fontWeight: "bold",
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  invoiceInfo: {
    marginTop: 10,
    fontSize: 12,
    color: "#6b7280",
  },
  clientSection: {
    marginVertical: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  clientName: {
    fontSize: 12,
    color: "#4b5563",
  },
  table: {
    display: "flex",
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginVertical: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    padding: 8,
  },
  tableCell: {
    fontSize: 10,
    color: "#4b5563",
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderTopWidth: 2,
    borderColor: "#e5e7eb",
  },
  totalCell: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  qrSection: {
    marginTop: 30,
    alignItems: "center",
    textAlign: "center",
  },
  qrImage: {
    width: 100,
    height: 100,
  },
  qrText: {
    marginTop: 10,
    fontSize: 10,
    color: "#6b7280",
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 10,
  },
  signatureSection: {
    marginTop: 30,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 20,
    alignItems: 'flex-end'
  },
  signatureImage: {
    width: 150,
    height: 80,
    objectFit: 'contain',
    marginTop: 10
  }
});

const InvoicePDF = ({ invoice }) => {
  const [qrCodeUrl, setQrCodeUrl] = React.useState("");

  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `₹${formatter.format(amount)}`;
  };

  React.useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = `upi://pay?pa=your-upi-id@upi&pn=AvijitWorldHub&am=${invoice.total}&cu=INR`;
        const url = await QRCode.toDataURL(qrData, {
          width: 100,
          margin: 2,
          errorCorrectionLevel: 'H'
        });
        setQrCodeUrl(url);
      } catch (err) {
        console.error("Error generating QR code:", err);
      }
    };
    generateQRCode();
  }, [invoice.total]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>InvoiceGen</Text>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceInfo}>Invoice ID: {invoice._id}</Text>
            <Text style={styles.invoiceInfo}>Date: {new Date(invoice.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Client Section */}
        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.clientName}>{invoice.clientName}</Text>
        </View>

        {/* Services Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Description</Text>
            <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>Amount (₹)</Text>
          </View>
          {invoice.services.map((service, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{service.description}</Text>
              <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                {formatCurrency(service.amount)}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={[styles.totalCell, { flex: 2 }]}>Total</Text>
            <Text style={[styles.totalCell, { flex: 1, textAlign: 'right' }]}>
              {formatCurrency(invoice.total)}
            </Text>
          </View>
        </View>

        {/* QR Code Section */}
        {qrCodeUrl && (
          <View style={styles.qrSection}>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#1f2937" }}>
              Scan to Pay
            </Text>
            <Image src={qrCodeUrl} style={styles.qrImage} />
            <Text style={styles.qrText}>
              UPI ID: avijitdam98@ybl | Amount: ₹{invoice.total.toFixed(2)}
            </Text>
          </View>
        )}

        {/* Signature Section */}
        {invoice.signature && (
          <View style={styles.signatureSection}>
            <Text style={styles.sectionTitle}>Authorized Signature</Text>
            <Image style={styles.signatureImage} src={invoice.signature} />
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for choosing AvijitWorldHub!
        </Text>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
