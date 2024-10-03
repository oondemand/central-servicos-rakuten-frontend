import React, { useState } from "react";
import { useTicket } from "../contexts/TicketContext";
import CartaoTicket from "./ticket/CartaoTicket";
import EditTicketModal from "./ticket/EditTicketModal";
import "../esteira.css";

const Etapa = ({ index, etapa }) => {
  // console.log(etapa);

  const { listaTickets } = useTicket();
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleCadastrarTicket = () => {
    setSelectedTicket({}); // Resetar para garantir que o modal está em modo de criação
  };

  const handleEditTicket = (index, ticket) => {
    setSelectedTicket(ticket);
  };
  return (
    <div className="etapa-coluna">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{etapa.nome}</h2>
          {index === 0 && (
            <button
              onClick={handleCadastrarTicket}
              className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-full transition-colors duration-200 ml-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {listaTickets
        .filter((ticket) => ticket.etapa === etapa.codigo)
        .map((ticket) => (
          <CartaoTicket key={ticket._id} ticket={ticket} onClick={() => handleEditTicket(ticket)} />
        ))}

      {selectedTicket && (
        <EditTicketModal ticket={selectedTicket} closeModal={() => setSelectedTicket(null)} />
      )}
    </div>
  );
};

export default Etapa;
