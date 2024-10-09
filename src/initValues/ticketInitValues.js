// src/initValues/ticketInitValues.js

import { format } from "date-fns";

export const ticketInitValues = (isEditMode, ticket) => ({
  titulo: isEditMode ? (ticket?.titulo || "") : "",
  observacao: isEditMode ? (ticket?.observacao || "") : "",
  prestador: {
    nome: isEditMode && ticket?.prestador ? (ticket.prestador.nome || "") : "",
    tipo: isEditMode && ticket?.prestador ? (ticket.prestador.tipo || "") : "",
    documento: isEditMode && ticket?.prestador ? (ticket.prestador.documento || "") : "",
    email: isEditMode && ticket?.prestador ? (ticket.prestador.email || "") : "",
    status: isEditMode && ticket?.prestador ? (ticket.prestador.status || "ativo") : "ativo",
    comentariosRevisao: isEditMode && ticket?.prestador ? (ticket.prestador.comentariosRevisao || "") : "",
  },
  servico: {
    descricao: isEditMode && ticket?.servico ? (ticket.servico.descricao || "") : "",
    valor: isEditMode && ticket?.servico ? (ticket.servico.valor || "") : "",
    data: isEditMode && ticket?.servico && ticket.servico.data 
      ? format(new Date(ticket.servico.data), 'yyyy-MM-dd') 
      : "",
    status: isEditMode && ticket?.servico ? (ticket.servico.status || "ativo") : "ativo",
  },
});
