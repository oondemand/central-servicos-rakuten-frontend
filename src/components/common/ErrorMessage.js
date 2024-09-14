// src/components/ErrorMessage.js

import React, { useState } from 'react';

const ErrorMessage = ({ message, details }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
      <p className="font-bold">Erro</p>
      <p>{message}</p>
      {details && (
        <>
          <button
            className="mt-2 underline"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Esconder Detalhes' : 'Mostrar Detalhes'}
          </button>
          {showDetails && <pre className="mt-2 bg-gray-200 p-2">{details}</pre>}
        </>
      )}
    </div>
  );
};

export default ErrorMessage;
