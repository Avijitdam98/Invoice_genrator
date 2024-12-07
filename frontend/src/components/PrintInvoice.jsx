import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { invoiceApi } from "../services/api";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF";
import toast from "react-hot-toast";

const PrintInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await invoiceApi.getInvoiceById(id);
        setInvoice(response.data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        toast.error("Error fetching invoice");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoice();
  }, [id, navigate]);

  if (isLoading || !invoice) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-8 bg-gradient-to-br from-white to-gray-50 shadow-2xl rounded-3xl">
      {/* Header Section */}
      <div className="mb-10 flex justify-between items-center border-b pb-6">
        <h1 className="text-4xl font-extrabold text-gray-800">Invoice Details</h1>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-3 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded-lg shadow transition-transform transform hover:scale-105"
        >
          Back
        </button>
      </div>

      {/* Actions Section */}
      <div className="mb-8 flex justify-end gap-4">
        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} />}
          fileName={`invoice-${invoice._id}.pdf`}
          className="flex items-center gap-3 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          {({ loading }) =>
            loading ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764c.54 0 .976.45.976 1v8c0 .55-.436 1-.976 1H5.236c-.54 0-.976-.45-.976-1v-8c0-.55.436-1 .976-1H10M14 10V4M14 10H10"
                  />
                </svg>
                Preparing PDF...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764c.54 0 .976.45.976 1v8c0 .55-.436 1-.976 1H5.236c-.54 0-.976-.45-.976-1v-8c0-.55.436-1 .976-1H10M14 10V4M14 10H10"
                  />
                </svg>
                Download PDF
              </>
            )
          }
        </PDFDownloadLink>
      </div>

      {/* Invoice Viewer */}
      <div className="w-full h-[800px] border border-gray-200 rounded-lg overflow-hidden shadow-md">
        <PDFViewer width="100%" height="100%" className="rounded-lg">
          <InvoicePDF invoice={invoice} />
        </PDFViewer>
      </div>

      {/* Terms and Conditions */}
      <div className="mt-10 bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Terms and Conditions
        </h2>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
          <li>
            Payment must be made within 30 days of the invoice date unless otherwise specified.
          </li>
          <li>
            Late payments may be subject to additional fees or interest as per our company policy.
          </li>
          <li>
            Goods sold are non-refundable unless stated otherwise in the contract.
          </li>
          <li>
            Any disputes regarding this invoice must be raised within 7 days of receipt.
          </li>
          <li>
            For further information, contact us at{" "}
            <a
              href="mailto:support@yourcompany.com"
              className="text-indigo-600 hover:underline"
            >
              avijitdam18@gmail.com
            </a>
            .
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-xs text-gray-500">
        <p>&copy; 2025 AvijitWorldHub. All Rights Reserved.</p>
        <p>Powered by React.js & PDFRenderer</p>
      </div>
    </div>
  );
};

export default PrintInvoice;
