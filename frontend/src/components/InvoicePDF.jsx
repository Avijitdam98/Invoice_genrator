import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const InvoicePDF = ({ invoice }) => {
  if (!invoice) {
    return null;
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.date}>Date: {formatDate(invoice.createdAt)}</Text>
          </View>
        </View>

        {/* Client Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.clientName}>{invoice.clientName}</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Description</Text>
            <Text style={styles.tableHeaderCell}>Quantity</Text>
            <Text style={styles.tableHeaderCell}>Price</Text>
            <Text style={styles.tableHeaderCell}>GST</Text>
            <Text style={styles.tableHeaderCell}>Tax</Text>
            <Text style={styles.tableHeaderCell}>Amount</Text>
          </View>
          {invoice.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{item.price.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{item.gstRate}%</Text>
              <Text style={styles.tableCell}>{item.taxRate}%</Text>
              <Text style={styles.tableCell}>{item.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Tax Details */}
        <View style={styles.taxSection}>
          <View style={styles.taxRow}>
            <Text>Subtotal:</Text>
            <Text>{invoice.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.taxRow}>
            <Text>GST Amount:</Text>
            <Text>{invoice.gstAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.taxRow}>
            <Text>Tax Amount:</Text>
            <Text>{invoice.taxAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.taxRow, styles.totalRow]}>
            <Text style={styles.boldText}>Total Amount:</Text>
            <Text style={styles.boldText}>{invoice.totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Signature Section */}
        {invoice.signature && (
          <View style={styles.signatureSection}>
            <Text style={styles.sectionTitle}>Authorized Signature</Text>
            <Image style={styles.signatureImage} src={invoice.signature} />
          </View>
        )}
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  date: {
    color: '#666',
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 5,
  },
  clientName: {
    fontSize: 12,
    marginBottom: 4,
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableHeaderCell: {
    flex: 1,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#374151',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: '#374151',
  },
  taxSection: {
    marginTop: 20,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 10,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    fontSize: 10,
    color: '#374151',
  },
  totalRow: {
    borderTop: '1px solid #e5e7eb',
    marginTop: 10,
    paddingTop: 10,
  },
  boldText: {
    fontFamily: 'Helvetica-Bold',
  },
  signatureSection: {
    marginTop: 30,
    borderTop: '1px solid #e5e7eb',
    paddingTop: 20,
    alignItems: 'flex-end',
  },
  signatureImage: {
    width: 150,
    height: 80,
    objectFit: 'contain',
    marginTop: 10,
  },
});

export default InvoicePDF;
