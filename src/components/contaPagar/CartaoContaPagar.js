const CartaoContaPagar = ({ ticket }) => {
  return (
    <div className="cartao">
      <p className="titulo">NFS-e: {ticket.nfse.infoNfse.numero}</p>
      <p className="subtitulo">{ticket.nfse.infoNfse.prestador.nome}</p>
      <p className="texto-pequeno">{ticket.nfse.infoNfse.prestador.documento}</p>
      <p className="texto-pequeno">
        {ticket.nfse.infoNfse.declaracaoPrestacaoServico.competencia} | Valor R${" "}
        {ticket.nfse.infoNfse.declaracaoPrestacaoServico.servico.valores.valorServicos.toFixed(2)}
      </p>
      <p className="texto-truncado">
        {ticket.nfse.infoNfse.declaracaoPrestacaoServico.servico.discriminacao}
      </p>
    </div>
  );
};

export default CartaoContaPagar;
