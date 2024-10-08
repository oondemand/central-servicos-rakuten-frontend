import React, { useState } from "react";
import { useTicket } from "../contexts/TicketContext";
import CartaoTicket from "./ticket/CartaoTicket";
import TicketModal from "./ticket/TicketModal"; // Importando o novo TicketModal
import "../esteira.css";

const Etapa = ({ index, etapa }) => {
  const { listaTickets, buscarTicketPorId } = useTicket();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false); // Estado para exibir o carregamento do ticket

  const handleCadastrarTicket = () => {
    setIsAddModalOpen(true);
  };

  const handleEditTicket = async (ticket) => {
    setLoadingTicket(true); // Inicia o estado de carregamento
    try {
      const fetchedTicket = await buscarTicketPorId(ticket._id); // Faz a requisição para buscar o ticket completo
     console.log(fetchedTicket,"fetchedTicket")
     
      if (fetchedTicket) {
        setSelectedTicket(fetchedTicket); // Abre o modal para edição com os dados completos do ticket
      }
    } catch (error) {
      console.error("Erro ao buscar ticket:", error);
    } finally {
      setLoadingTicket(false); // Finaliza o estado de carregamento
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setSelectedTicket(null);
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
          <CartaoTicket
            key={ticket._id}
            ticket={ticket}
            onClick={() => handleEditTicket(ticket)}
          />
        ))}

      {/* Modal para adicionar novo ticket */}
      {isAddModalOpen && (
        <TicketModal isOpen={isAddModalOpen} closeModal={closeModal} />
      )}

      {/* Modal para editar ticket existente */}
      {selectedTicket && (
        <TicketModal
          isOpen={Boolean(selectedTicket)}
          closeModal={closeModal}
          ticket={selectedTicket}
        />
      )}

      {/* Exibe um indicativo de carregamento se o ticket estiver sendo buscado */}
      {loadingTicket && <p>Carregando ticket...</p>}
    </div>
  );
};

export default Etapa;
