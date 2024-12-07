import crypto from 'crypto-js';

export const generateSignatureMetadata = (signerName, documentContent) => {
  const timestamp = new Date().toISOString();
  const documentHash = crypto.SHA256(documentContent).toString();
  
  // Generate a unique certificate ID
  const certificateId = crypto.lib.WordArray.random(16).toString();
  
  return {
    signerName,
    timestamp,
    documentHash,
    certificateInfo: `Cert-${certificateId}`,
    version: '1.0'
  };
};

export const validateSignature = (signature) => {
  if (!signature || !signature.data) {
    return {
      isValid: false,
      error: 'No signature data found'
    };
  }

  if (signature.type === 'draw') {
    // Validate drawn signature
    if (!signature.data.startsWith('data:image/png;base64,')) {
      return {
        isValid: false,
        error: 'Invalid signature format'
      };
    }
    
    // Check minimum size/complexity
    const base64Data = signature.data.split(',')[1];
    if (base64Data.length < 100) {
      return {
        isValid: false,
        error: 'Signature too simple or small'
      };
    }
  } else if (signature.type === 'type') {
    // Validate typed signature
    if (!signature.data.trim() || signature.data.length < 3) {
      return {
        isValid: false,
        error: 'Signature text too short'
      };
    }

    if (!signature.font) {
      return {
        isValid: false,
        error: 'No font specified for typed signature'
      };
    }
  } else {
    return {
      isValid: false,
      error: 'Invalid signature type'
    };
  }

  return {
    isValid: true
  };
};

export const verifyDocumentIntegrity = (originalHash, currentContent) => {
  const currentHash = crypto.SHA256(currentContent).toString();
  return originalHash === currentHash;
};

export const getSignatureAuditTrail = (signature, metadata) => {
  return {
    signatureId: crypto.SHA256(signature.data).toString(),
    signerName: metadata.signerName,
    signatureType: signature.type,
    timestamp: metadata.timestamp,
    certificateInfo: metadata.certificateInfo,
    documentHash: metadata.documentHash,
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent
  };
};

export const exportSignatureData = (signature, metadata) => {
  return {
    signature: {
      type: signature.type,
      data: signature.data,
      font: signature.font
    },
    metadata: {
      ...metadata,
      exportedAt: new Date().toISOString()
    },
    auditTrail: getSignatureAuditTrail(signature, metadata)
  };
};

export const importSignatureData = (data) => {
  try {
    if (!data.signature || !data.metadata || !data.auditTrail) {
      throw new Error('Invalid signature data format');
    }

    // Verify data integrity
    const signatureValidation = validateSignature(data.signature);
    if (!signatureValidation.isValid) {
      throw new Error(signatureValidation.error);
    }

    return {
      isValid: true,
      data: {
        signature: data.signature,
        metadata: data.metadata,
        auditTrail: data.auditTrail
      }
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
};
