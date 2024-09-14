import React, { useState } from "react";
import { useTicket } from "../contexts/TicketContext";
import CartaoTicket from "./ticket/CartaoTicket";
import EditTicketModal from "./ticket/EditTicketModal";
import "../esteira.css";

const Etapa = ({ etapa }) => {
  // console.log(etapa);
  
  const { listaTickets } = useTicket();
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  return (
    <div className="etapa-coluna">
      <h2 className="text-lg font-semibold mb-4">{etapa.nome}</h2>
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
