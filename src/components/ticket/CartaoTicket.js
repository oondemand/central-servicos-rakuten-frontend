import React from "react";

const CartaoTicket = ({ ticket, onClick }) => {
    const statusColor = ticket.status === "aguardando-inicio" ? "yellow-500" :
                      ticket.status === "trabalhando" ? "green-500" :
                      ticket.status === "revisao" ? "red-500" :
                      "blue-500"; // Cor padrão caso o status não corresponda a nenhum dos especificados

  return (
    <div className="cartao" onClick={onClick}>
      <p className="titulo">NFS-e: {ticket.titulo}</p>
      <p className="texto-pequeno">{ticket.descricao}</p>
      <div className="flex items-center mt-4">
        <span className={`inline-block w-2.5 h-2.5 rounded-full bg-${statusColor} mr-2`}></span>
        <p className="status-texto">{ticket.status}</p>
      </div>
    </div>
  );
};

export default CartaoTicket;
