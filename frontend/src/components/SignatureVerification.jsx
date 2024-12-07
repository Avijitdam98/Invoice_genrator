import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import crypto from 'crypto-js';

const SignatureVerification = ({ signature, documentHash, metadata }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const verifySignature = async () => {
    setIsVerifying(true);
    try {
      // Check if signature exists
      if (!signature || !signature.data) {
        throw new Error('No signature found');
      }

      // Verify signature timestamp
      const signatureTime = new Date(metadata.timestamp);
      const currentTime = new Date();
      if (signatureTime > currentTime) {
        throw new Error('Invalid signature timestamp');
      }

      // Verify document hasn't been modified
      const currentHash = crypto.SHA256(documentHash).toString();
      if (currentHash !== metadata.documentHash) {
        throw new Error('Document has been modified after signing');
      }

      // Additional checks for drawn signatures
      if (signature.type === 'draw') {
        // Verify signature image data
        if (!signature.data.startsWith('data:image/png;base64,')) {
          throw new Error('Invalid signature format');
        }
      }

      // Set verification result
      setVerificationResult({
        isValid: true,
        signer: metadata.signerName,
        timestamp: metadata.timestamp,
        certificateInfo: metadata.certificateInfo
      });

      toast.success('Signature verified successfully');
    } catch (error) {
      setVerificationResult({
        isValid: false,
        error: error.message
      });
      toast.error(`Signature verification failed: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const getSignatureStatus = () => {
    if (!verificationResult) return 'Not Verified';
    return verificationResult.isValid ? 'Valid' : 'Invalid';
  };

  const getStatusColor = () => {
    if (!verificationResult) return 'text-gray-500';
    return verificationResult.isValid ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Signature Verification</h3>

      {/* Signature Preview */}
      <div className="mb-4 p-4 border rounded-lg dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Signature Preview:</p>
        {signature?.type === 'draw' ? (
          <img
            src={signature.data}
            alt="Signature"
            className="max-h-20 border rounded p-2"
          />
        ) : (
          <p
            className="text-xl"
            style={{
              fontFamily: signature?.font || 'cursive'
            }}
          >
            {signature?.data || 'No signature available'}
          </p>
        )}
      </div>

      {/* Verification Status */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Status:</p>
        <p className={`font-semibold ${getStatusColor()}`}>
          {getSignatureStatus()}
        </p>
      </div>

      {/* Verification Details */}
      {verificationResult && verificationResult.isValid && (
        <div className="mb-4 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-gray-600 dark:text-gray-400">Signer:</p>
            <p>{verificationResult.signer}</p>
            
            <p className="text-gray-600 dark:text-gray-400">Signed On:</p>
            <p>{new Date(verificationResult.timestamp).toLocaleString()}</p>
            
            <p className="text-gray-600 dark:text-gray-400">Certificate:</p>
            <p className="truncate" title={verificationResult.certificateInfo}>
              {verificationResult.certificateInfo}
            </p>
          </div>
        </div>
      )}

      {/* Verification Error */}
      {verificationResult && !verificationResult.isValid && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
          <p className="text-sm">{verificationResult.error}</p>
        </div>
      )}

      {/* Verify Button */}
      <button
        onClick={verifySignature}
        disabled={isVerifying}
        className={`w-full py-2 px-4 rounded-lg font-medium ${
          isVerifying
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
        }`}
      >
        {isVerifying ? (
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
    </div>
  );
};

export default SignatureVerification;
