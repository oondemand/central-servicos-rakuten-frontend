import React, { useState, useEffect } from "react";
import api from "../../api/apiService";

const CartaoContaPagar = ({ ticket }) => {
  const [contaPagar, setContaPagar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const fetchContaPagar = async () => {
      try {
        const response = await api.get(`/contas-pagar/${ticket.contaPagarOmie}`);
        setContaPagar(response.data);
        setError(null);
      } catch (err) {
        console.error("Erro ao buscar conta a pagar:", err);
        setError("Erro ao buscar conta a pagar. Tentando novamente em 30 segundos...");
        setTimeout(() => {
          setRetry((prevRetry) => prevRetry + 1);
        }, 30000);
      } finally {
        setLoading(false);
      }
    };

    if (ticket.contaPagarOmie) {
      fetchContaPagar();
    } else {
      setLoading(false);
    }
  }, [ticket.contaPagarOmie, retry]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!contaPagar) {
    return <div>Conta a pagar não encontrada.</div>;
  }

  return (
    <div className="cartao">
      <p className="titulo">NFS-e: {ticket.nfse.infoNfse.numero}</p>
      <p className="subtitulo">Documento: {contaPagar.numero_documento}</p>
      <p className="texto-pequeno">Valor: R$ {contaPagar.valor_documento.toFixed(2)}</p>
      <p className="texto-pequeno">Vencimento: {contaPagar.data_vencimento}</p>
      <p className="texto-pequeno">Status: {contaPagar.status_titulo}</p>
    </div>
  );
};

export default CartaoContaPagar;
