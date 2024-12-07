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
      <div className="flex justify-center items-center h-64 bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <div className="mb-8 flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Invoice Details</h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md shadow"
        >
          Back
        </button>
      </div>

      {/* Actions Section */}
      <div className="mb-6 flex justify-end gap-4">
        <PDFDownloadLink
          document={<InvoicePDF invoice={invoice} />}
          fileName={`invoice-${invoice._id}.pdf`}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md"
        >
          {({ loading }) =>
            loading ? (
              <>
                <span className="animate-pulse">Preparing PDF...</span>
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
      <div className="w-full h-[800px] border-2 border-gray-200 rounded-lg overflow-hidden shadow-md">
        <PDFViewer width="100%" height="100%" className="rounded-lg">
          <InvoicePDF invoice={invoice} />
        </PDFViewer>
      </div>
    </div>
  );
};

export default PrintInvoice;
