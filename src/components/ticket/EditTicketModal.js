import React, { useState } from "react";
import { useTicket } from "../../contexts/TicketContext";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa"; // Importa o ícone de carregamento
import ResumoNfse from "../nfse/ResumoNfse";

const EditTicketModal = ({ ticket, closeModal }) => {
  const { alterarStatusTicket, editarTicket, aprovarTicket, recusarTicket } = useTicket();
  
  const [titulo, setTitulo] = useState(ticket.titulo);
  const [observacao, setObservacao] = useState(ticket.observacao);
  const [status, setStatus] = useState(ticket.status);
  const [loading, setLoading] = useState({
    save: false,
    approve: false,
    reject: false,
  });

  const handleSave = async () => {
    setLoading(prev => ({ ...prev, save: true }));
    const updatedTicket = prepareTicketData({ ...ticket, titulo, observacao, status });
    const sucesso = await editarTicket(ticket._id, updatedTicket);
    setLoading(prev => ({ ...prev, save: false }));
    if (sucesso) closeModal();
  };

  const handleApprove = async () => {
    setLoading(prev => ({ ...prev, approve: true }));
    const sucesso = await aprovarTicket(ticket._id);
    setLoading(prev => ({ ...prev, approve: false }));
    if (sucesso) closeModal();
  };

  const handleReject = async () => {
    setLoading(prev => ({ ...prev, reject: true }));
    const sucesso = await recusarTicket(ticket._id);
    setLoading(prev => ({ ...prev, reject: false }));
    if (sucesso) closeModal();
  };

  const prepareTicketData = (ticket) => {
    const { _id, createdAt, updatedAt, __v, nfse, ...cleanedTicket } = ticket;
    return {
      ...cleanedTicket,
      nfse: nfse._id,
    };
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    await alterarStatusTicket(ticket._id, newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-10">
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl flex flex-col"
        style={{ height: "95%" }}
      >
        {/* Cabeçalho fixo */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-2xl text-gray-900 dark:text-gray-100 font-semibold">
            Detalhe do Ticket
          </h2>
          <button className="text-gray-600 dark:text-gray-300" onClick={closeModal}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Corpo com rolagem */}
        <div className="overflow-y-auto p-6 flex-1 grid grid-cols-5 gap-4">
          <div className="col-span-4 form-container">
            <div className="mb-4">
              <label>Título do ticket</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label>Observação</label>
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                rows={3}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <div className="col-span-1">
            {/* Seção de Status */}
            <div className="flex flex-col space-y-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg text-white ${
                  status === "aguardando-inicio" ? "bg-yellow-500" : "bg-gray-300 dark:bg-gray-700"
                }`}
                onClick={() => handleStatusChange("aguardando-inicio")}
              >
                Aguardando Início
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg text-white ${
                  status === "trabalhando" ? "bg-green-500" : "bg-gray-300 dark:bg-gray-700"
                }`}
                onClick={() => handleStatusChange("trabalhando")}
              >
                Trabalhando
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg text-white ${
                  status === "revisao" ? "bg-red-500" : "bg-gray-300 dark:bg-gray-700"
                }`}
                onClick={() => handleStatusChange("revisao")}
              >
                Revisão
              </button>
            </div>
          </div>

          {/* Resumo da NFSe */}
          <div className="col-span-5">
            <ResumoNfse nfse={ticket.nfse} />
          </div>
        </div>

        {/* Rodapé fixo */}
        <div className="p-4 border-t border-gray-700 bg-white dark:bg-gray-900 flex justify-end space-x-4">
          <button
            onClick={closeModal}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            disabled={loading.save}
          >
            {loading.save ? <FaSpinner className="animate-spin mr-2" /> : "Salvar"}
          </button>
          <button
            onClick={handleApprove}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
            disabled={loading.approve}
          >
            {loading.approve ? <FaSpinner className="animate-spin mr-2" /> : <><FaCheck className="mr-2" /> Aprovar NFSe</>}
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            disabled={loading.reject}
          >
            {loading.reject ? <FaSpinner className="animate-spin mr-2" /> : <><FaTimes className="mr-2" /> Recusar NFSe</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTicketModal;
