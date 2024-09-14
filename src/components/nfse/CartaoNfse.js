import React from "react";
import { useTicket } from "../../contexts/TicketContext";
import { formatarDocumento } from "../../utils/formatacoes";
import { useEtapa } from "../../contexts/EtapaContext";

const CartaoNfse = ({ nfse, onClick }) => {
  const { adicionarTicket } = useTicket();
  const { listaEtapas } = useEtapa();

  const handleGerarTicket = async (e) => {
    e.stopPropagation(); // Impede a propagação do evento de clique para o contêiner do cartão

    const novoTicket = {
      titulo: `${nfse.infoNfse?.prestador?.nome}: NFSe ${
        nfse.infoNfse?.numero
      } - R$ ${nfse.infoNfse?.declaracaoPrestacaoServico?.servico?.valores?.valorServicos.toFixed(
        2
      )}`, // Título do ticket
      observacao: nfse.infoNfse?.declaracaoPrestacaoServico?.servico?.discriminacao, // Descrição do ticket
      etapa: listaEtapas[0].codigo, // A etapa inicial para o novo ticket
      status: "aguardando-inicio", // O status inicial para o novo ticket
      nfse: nfse._id, // Vincular o ticket à NFSe correspondente
    };

    await adicionarTicket(novoTicket);
  };

  return (
    <div onClick={onClick} className="cartao">
      <p className="titulo">NFS-e: {nfse.infoNfse?.numero}</p>
      <div className="subtitulo">{nfse.infoNfse?.prestador?.nome}</div>
      <div className="texto-pequeno">{formatarDocumento(nfse.infoNfse?.prestador?.documento)}</div>
      <div className="texto-pequeno">
        {nfse.infoNfse?.declaracaoPrestacaoServico?.competencia} | R${" "}
        {nfse.infoNfse?.declaracaoPrestacaoServico?.servico?.valores?.valorServicos.toFixed(2)}
      </div>
      <div className="texto-truncado">
        {nfse.infoNfse?.declaracaoPrestacaoServico?.servico?.discriminacao}
      </div>
      <button onClick={handleGerarTicket} className="botao">
        Gerar Ticket
      </button>
    </div>
  );
};

export default CartaoNfse;
