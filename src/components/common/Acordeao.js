import React, { useState } from 'react';

const Acordeao = ({ titulo, children, aberto = true }) => {
  const [isOpen, setIsOpen] = useState(aberto);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-2">
      <div
        onClick={toggleAccordion}
        className="cursor-pointer w-full text-left p-2 bg-teal-600 text-white font-semibold rounded-lg focus:outline-none flex justify-between items-center"
      >
        <span>{titulo}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </div>
      {isOpen && (
        <div className="p-3 bg-gray-800 rounded-b-lg">
          {children}
        </div>
      )}
    </div>
  );
};

export default Acordeao;
