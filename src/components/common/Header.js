import React, { useEffect, useState } from "react";
import { FaSearch, FaCog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { useTicket } from "../../contexts/TicketContext"; // Importar o contexto de Ticket
import { useNFSe } from "../../contexts/NfseContext"; // Importar o contexto de NFS-e
import { useBaseOmie } from "../../contexts/BaseOmieContext";

const Header = () => {
  const { listaBases, selecionarBase, baseSelecionada } = useBaseOmie();
  const { filtrarTickets } = useTicket(); // Usar a função de filtro do contexto de tickets
  const { filtrarNfses } = useNFSe(); // Usar a função de filtro do contexto de NFS-e

  const [termoPesquisa, setTermoPesquisa] = useState(""); // Estado para o campo de pesquisa
  const [baseSelecionadaDropdown, setEmpresaSelecionadaDropdown] = useState(""); // Estado para a base selecionada no dropdown

  const navigate = useNavigate();

  const handleEmpresaChange = (e) => {
    selecionarBase(e.target.value); // Atualiza a base selecionada no contexto
  };

  const handlePesquisaChange = (e) => {
    const termo = e.target.value;
    setTermoPesquisa(termo);
    filtrarTickets(termo); // Filtrar tickets conforme o usuário digita
    filtrarNfses(termo); // Filtrar NFS-e conforme o usuário digita
  };

  const handleConfigClick = () => {
    navigate("/configuracoes");
  };

  // Efeito para atualizar o valor do dropdown sempre que a base selecionada mudar
  useEffect(() => {
    if (baseSelecionada) {
      setEmpresaSelecionadaDropdown(baseSelecionada.cnpj); // Sincroniza o valor do dropdown
    } else {
      setEmpresaSelecionadaDropdown(""); // Limpa o valor do dropdown se não houver base selecionada
    }
  }, [baseSelecionada]);

  return (
    <header className="bg-gray-900 text-gray-100 shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link to="/home" className="text-xl font-bold" style={{ color: "#00E2F4" }}>
          Central de Serviços
        </Link>
      </div>
      <div>
        {/* Dropdown para seleção da base */}
        <select
          value={baseSelecionadaDropdown} // Valor controlado pelo estado do dropdown
          onChange={handleEmpresaChange}
          className="border border-gray-700 rounded p-2 bg-gray-800 text-gray-100"
        >
          <option value="">Selecione uma Empresa</option>
          {listaBases.map((base) => (
            <option key={base._id} value={base.cnpj}>
              {base.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquise por cnpj, nfse etc..."
            className="border border-gray-700 rounded p-2 w-80 pl-10 bg-gray-800 text-gray-100"
            value={termoPesquisa}
            onChange={handlePesquisaChange} // Atualiza conforme o usuário digita
          />
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
        </div>

        <FaCog className="text-xl cursor-pointer text-[#00E2F4]" onClick={handleConfigClick} />

        <div className="w-8 h-8 bg-[#00E2F4] rounded-full flex items-center justify-center">
          <span className="text-black text-sm font-semibold">mf</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
