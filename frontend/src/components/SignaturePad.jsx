import React, { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignaturePad = ({ value, onChange, className }) => {
  const signaturePadRef = useRef(null);

  useEffect(() => {
    if (signaturePadRef.current && value) {
      signaturePadRef.current.fromDataURL(value);
    }
  }, [value]);

  const clear = () => {
    signaturePadRef.current.clear();
    onChange(null);
  };

  const save = () => {
    if (!signaturePadRef.current.isEmpty()) {
      const dataUrl = signaturePadRef.current.toDataURL();
      onChange(dataUrl);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <SignatureCanvas
          ref={signaturePadRef}
          canvasProps={{
            className: 'w-full h-40',
            style: {
              background: 'transparent',
            }
          }}
          backgroundColor="transparent"
          onEnd={save}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={clear}
          className="px-3 py-1.5 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
