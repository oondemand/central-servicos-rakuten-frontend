import React, { useState, useEffect } from "react";
import { useNFSe } from "../contexts/NfseContext";
import CartaoNfse from "./nfse/CartaoNfse";
import EditNfseModal from "./nfse/EditNfseModal";

const CaixaEntrada = () => {
  const { listaNfses, carregarNfse } = useNFSe();
  const [selectedNfse, setSelectedNfse] = useState(null);
  const [showCadastrarModal, setShowCadastrarModal] = useState(false);

  useEffect(() => {
    carregarNfse();
  }, [carregarNfse]);

  const handleEditNfse = (nfse) => {
    setSelectedNfse(nfse);
    setShowCadastrarModal(false); // Garantir que ao editar, não estamos em modo de criação
  };

  const handleCadastrarNfse = () => {
    setSelectedNfse(null); // Resetar para garantir que o modal está em modo de criação
    setShowCadastrarModal(true);
  };

  return (
    <div className="caixa-entrada">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Caixa de entrada</h2>
        <button
          onClick={handleCadastrarNfse}
          className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {listaNfses.map((nfse) => (
          <CartaoNfse key={nfse._id} nfse={nfse} onClick={() => handleEditNfse(nfse)} />
        ))}
      </div>

      {(selectedNfse || showCadastrarModal) && (
        <EditNfseModal
          nfse={selectedNfse}
          closeModal={() => {
            setSelectedNfse(null);
            setShowCadastrarModal(false);
          }}
        />
      )}
    </div>
  );
};

export default CaixaEntrada;
