import React from "react";

const ResumoNfse = ({ nfse }) => {
  const {
    infoNfse: {
      numero,
      codigoVerificacao,
      dataEmissao,
      prestador,
      tomador,
      declaracaoPrestacaoServico,
    },
  } = nfse;

  const formatarData = (data) => {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="mt-8 px-6 py-4 bg-gray-800 text-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 border-b border-gray-600 pb-2">Resumo da NFSe</h3>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Informações Gerais</h4>
        <p className="mb-1"><strong>Número da NFSe:</strong> {numero}</p>
        <p className="mb-1"><strong>Código de Verificação:</strong> {codigoVerificacao}</p>
        <p className="mb-1"><strong>Data de Emissão:</strong> {formatarData(dataEmissao)}</p>
        <p className="mb-1"><strong>Competência:</strong> {declaracaoPrestacaoServico.competencia}</p>
      </div>

      <div className="border-t border-gray-600 pt-4 mb-6">
        <h4 className="text-lg font-semibold mb-2">Informações do Prestador</h4>
        <p className="mb-1"><strong>Nome:</strong> {prestador.nome}</p>
        <p className="mb-1"><strong>Documento:</strong> {prestador.documento}</p>
      </div>

      <div className="border-t border-gray-600 pt-4 mb-6">
        <h4 className="text-lg font-semibold mb-2">Informações do Tomador</h4>
        <p className="mb-1"><strong>Nome:</strong> {tomador.nome}</p>
        <p className="mb-1"><strong>Documento:</strong> {tomador.documento}</p>
      </div>

      <div className="border-t border-gray-600 pt-4 mb-6">
        <h4 className="text-lg font-semibold mb-2">Serviço Prestado</h4>
        <p className="mb-1"><strong>Item da Lista de Serviços:</strong> {declaracaoPrestacaoServico.servico.itemListaServico}</p>
        <p className="mb-1"><strong>Código de Tributação do Município:</strong> {declaracaoPrestacaoServico.servico.codigoTributacaoMunicipio}</p>
        <p className="mb-1"><strong>Discriminação:</strong> {declaracaoPrestacaoServico.servico.discriminacao}</p>
        <p className="mb-1"><strong>Município de Incidência:</strong> {declaracaoPrestacaoServico.servico.municipioIncidencia}</p>
      </div>

      <div className="border-t border-gray-600 pt-4 mb-6">
        <h4 className="text-lg font-semibold mb-2">Valores</h4>
        <p className="mb-1"><strong>Valor dos Serviços:</strong> R$ {declaracaoPrestacaoServico.servico.valores.valorServicos}</p>
        <p className="mb-1"><strong>Alíquota:</strong> {declaracaoPrestacaoServico.servico.valores.aliquota}%</p>
        <p className="mb-1"><strong>Valor do ISS:</strong> R$ {declaracaoPrestacaoServico.servico.valores.valorIss}</p>
      </div>

      <div className="border-t border-gray-600 pt-4">
        <h4 className="text-lg font-semibold mb-2">Outras Informações</h4>
        <p className="mb-1"><strong>ISS Retido:</strong> {declaracaoPrestacaoServico.servico.issRetido ? "Sim" : "Não"}</p>
        <p className="mb-1"><strong>Optante pelo Simples Nacional:</strong> {declaracaoPrestacaoServico.optanteSimplesNacional ? "Sim" : "Não"}</p>
        <p className="mb-1"><strong>Incentivo Fiscal:</strong> {declaracaoPrestacaoServico.incentivoFiscal ? "Sim" : "Não"}</p>
      </div>
    </div>
  );
};

export default ResumoNfse;
