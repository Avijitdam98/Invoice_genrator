import React, { useState } from 'react';
import DigitalSignature from './DigitalSignature';
import SignatureVerification from './SignatureVerification';
import { 
  generateSignatureMetadata, 
  validateSignature, 
  exportSignatureData, 
  importSignatureData 
} from '../utils/signatureUtils';

const SignatureDemo = ({ invoiceData }) => {
  const [signature, setSignature] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [verificationMode, setVerificationMode] = useState(false);

  const handleSignatureCreate = async (newSignature) => {
    try {
      // Validate the signature
      const validationResult = validateSignature(newSignature);
      if (!validationResult.isValid) {
        throw new Error(validationResult.error);
      }

      // Generate metadata for the signature
      const newMetadata = generateSignatureMetadata(
        'John Doe', // Replace with actual signer name
        JSON.stringify(invoiceData)
      );

      // Save signature and metadata
      setSignature(newSignature);
      setMetadata(newMetadata);

      // Export signature data for storage
      const exportedData = exportSignatureData(newSignature, newMetadata);
      console.log('Signature data exported:', exportedData);

      // You can now save exportedData to your backend
    } catch (error) {
      console.error('Error creating signature:', error);
      toast.error(error.message);
    }
  };

  const handleVerification = () => {
    setVerificationMode(true);
  };

  const handleImportSignature = (importedData) => {
    try {
      const result = importSignatureData(importedData);
      if (!result.isValid) {
        throw new Error(result.error);
      }

      setSignature(result.data.signature);
      setMetadata(result.data.metadata);
      toast.success('Signature imported successfully');
    } catch (error) {
      console.error('Error importing signature:', error);
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      {!verificationMode ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Digital Signature</h2>
            {signature && (
              <button
                onClick={handleVerification}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Verify Signature
              </button>
            )}
          </div>

          <DigitalSignature
            onSave={handleSignatureCreate}
            initialSignature={signature}
          />

          {signature && (
            <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <p className="text-green-700 dark:text-green-200">
                ✓ Document signed successfully
              </p>
              <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                Signed by {metadata?.signerName} on{' '}
                {new Date(metadata?.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Signature Verification</h2>
            <button
              onClick={() => setVerificationMode(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Back to Signing
            </button>
          </div>

          <SignatureVerification
            signature={signature}
            documentHash={JSON.stringify(invoiceData)}
            metadata={metadata}
          />
        </>
      )}

      {/* Example of importing a signature */}
      <div className="mt-6 p-4 border rounded-lg dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Import Existing Signature</h3>
        <input
          type="file"
          accept=".json"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const importedData = JSON.parse(event.target.result);
                  handleImportSignature(importedData);
                } catch (error) {
                  toast.error('Invalid signature file');
                }
              };
              reader.readAsText(file);
            }
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
      </div>
    </div>
  );
};

export default SignatureDemo;
