import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import crypto from 'crypto-js';

const SignatureVerification = () => {
  const [file, setFile] = useState(null);
  const [signature, setSignature] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const fileData = JSON.parse(event.target.result);
          setFile(fileData);
        } catch (error) {
          toast.error('Invalid file format');
        }
      };
      reader.readAsText(uploadedFile);
    }
  };

  const handleSignatureUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSignature(event.target.result);
      };
      reader.readAsDataURL(uploadedFile);
    }
  };

  const verifySignature = async () => {
    setLoading(true);
    try {
      if (!file || !signature) {
        throw new Error('Please upload both invoice and signature files');
      }

      // Verify file hash
      const currentHash = crypto.SHA256(JSON.stringify(file.content)).toString();
      const originalHash = file.metadata.documentHash;

      if (currentHash !== originalHash) {
        throw new Error('Document has been modified after signing');
      }

      // Verify signature
      if (signature !== file.signature.data) {
        throw new Error('Invalid signature');
      }

      // Check timestamp
      const signatureTime = new Date(file.metadata.timestamp);
      if (signatureTime > new Date()) {
        throw new Error('Invalid signature timestamp');
      }

      setVerificationStatus({
        valid: true,
        details: {
          signer: file.metadata.signerName,
          timestamp: file.metadata.timestamp,
          certificateId: file.metadata.certificateInfo
        }
      });
      toast.success('Signature verified successfully');
    } catch (error) {
      setVerificationStatus({
        valid: false,
        error: error.message
      });
      toast.error(`Verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Verify Digital Signature</h1>

        {/* File Upload Section */}
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Signed Invoice
                </label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {file && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Invoice file loaded
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Upload Signature Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {signature && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Signature loaded
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={verifySignature}
            disabled={loading || !file || !signature}
            className={`w-full py-3 px-4 rounded-lg font-medium ${
              loading || !file || !signature
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify Signature'
            )}
          </button>

          {/* Verification Results */}
          {verificationStatus && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                verificationStatus.valid
                  ? 'bg-green-50 dark:bg-green-900'
                  : 'bg-red-50 dark:bg-red-900'
              }`}
            >
              {verificationStatus.valid ? (
                <div className="space-y-2">
                  <p className="text-green-700 dark:text-green-200 font-medium">
                    ✓ Signature is valid
                  </p>
                  <div className="text-sm text-green-600 dark:text-green-300">
                    <p>Signer: {verificationStatus.details.signer}</p>
                    <p>
                      Signed on:{' '}
                      {new Date(
                        verificationStatus.details.timestamp
                      ).toLocaleString()}
                    </p>
                    <p>
                      Certificate ID: {verificationStatus.details.certificateId}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-red-700 dark:text-red-200">
                  ✗ {verificationStatus.error}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignatureVerification;
