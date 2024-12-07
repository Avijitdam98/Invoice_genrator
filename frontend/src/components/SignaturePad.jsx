import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = ({ onSave }) => {
  const sigPadRef = useRef();

  const clear = () => {
    sigPadRef.current.clear();
  };

  const save = () => {
    if (!sigPadRef.current.isEmpty()) {
      const signatureData = sigPadRef.current.toDataURL();
      onSave(signatureData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-300 rounded-lg">
        <SignatureCanvas
          ref={sigPadRef}
          canvasProps={{
            className: "w-full h-48 rounded-lg",
          }}
          backgroundColor="white"
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={clear}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={save}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
