import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const DigitalSignature = ({ onSave, initialSignature = null }) => {
  const sigPad = useRef(null);
  const [signatureType, setSignatureType] = useState('draw'); // 'draw' or 'type'
  const [typedSignature, setTypedSignature] = useState('');
  const [selectedFont, setSelectedFont] = useState('Homemade Apple');

  const fonts = [
    'Homemade Apple',
    'Dancing Script',
    'Great Vibes',
    'Sacramento',
    'Pacifico'
  ];

  const clearSignature = () => {
    if (signatureType === 'draw') {
      sigPad.current?.clear();
    } else {
      setTypedSignature('');
    }
  };

  const handleSave = () => {
    if (signatureType === 'draw') {
      if (sigPad.current?.isEmpty()) {
        alert('Please provide a signature');
        return;
      }
      onSave({
        type: 'draw',
        data: sigPad.current?.getTrimmedCanvas().toDataURL('image/png')
      });
    } else {
      if (!typedSignature.trim()) {
        alert('Please type your signature');
        return;
      }
      onSave({
        type: 'type',
        data: typedSignature,
        font: selectedFont
      });
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4">
      <h3 className="text-lg font-semibold mb-4">Digital Signature</h3>

      {/* Signature Type Toggle */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setSignatureType('draw')}
          className={`px-4 py-2 rounded-lg ${
            signatureType === 'draw'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Draw Signature
        </button>
        <button
          onClick={() => setSignatureType('type')}
          className={`px-4 py-2 rounded-lg ${
            signatureType === 'type'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Type Signature
        </button>
      </div>

      {/* Signature Input Area */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
        {signatureType === 'draw' ? (
          <div className="border rounded-lg bg-white">
            <SignatureCanvas
              ref={sigPad}
              canvasProps={{
                className: 'signature-canvas w-full h-40',
                style: { 
                  borderRadius: '0.5rem',
                  backgroundColor: '#fff'
                }
              }}
              backgroundColor="rgb(255, 255, 255)"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
            <input
              type="text"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              placeholder="Type your signature"
              className="w-full px-4 py-2 text-2xl border-b-2 border-gray-300 focus:border-indigo-500 outline-none bg-transparent"
              style={{ fontFamily: selectedFont }}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <button
          onClick={clearSignature}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
        >
          Save Signature
        </button>
      </div>

      {/* Preview Area */}
      {initialSignature && (
        <div className="mt-4 p-4 border rounded-lg">
          <p className="text-sm text-gray-500 mb-2">Current Signature:</p>
          {initialSignature.type === 'draw' ? (
            <img 
              src={initialSignature.data} 
              alt="Current signature" 
              className="max-h-20"
            />
          ) : (
            <p 
              style={{ 
                fontFamily: initialSignature.font,
                fontSize: '1.5rem'
              }}
            >
              {initialSignature.data}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DigitalSignature;
