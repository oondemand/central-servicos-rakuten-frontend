import React from "react";
import { useTicket } from "../contexts/TicketContext";
import CartaoContaPagar from "./contaPagar/CartaoContaPagarOmie";

const ContaPagar = () => {
  const { listaTickets } = useTicket();

  return (
    <div className="contas-pagar">
      <h2 className="text-lg font-semibold mb-4">Contas a Pagar</h2>
      {listaTickets
        .filter((ticket) => ticket.etapa === "conta-pagar")
        .map((ticket) => (
          <CartaoContaPagar key={ticket._id} ticket={ticket} />
        ))}
    </div>
  );
};

export default ContaPagar;
