// src/components/common/Header.js
import React from "react";
import { FaSearch, FaCog } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Input,
  Select,
  IconButton,
  Avatar,
  InputGroup,
  InputLeftElement,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

import { useTicket } from "../../contexts/TicketContext";
import { useBaseOmie } from "../../contexts/BaseOmieContext";
import { useAuth } from "../../contexts/AuthContext"; // Importar o contexto de autenticação

const Header = () => {
  const { listaBases, baseOmie, selecionarBase } = useBaseOmie();
  const { filtrarTickets } = useTicket();
  const { logout } = useAuth(); // Desestruturar a função de logout
  const navigate = useNavigate();

  const [termoPesquisa, setTermoPesquisa] = React.useState("");
  const [baseOmieDropdown, setBaseOmieSelecionadaDropdown] = React.useState("");

  const handleBaseOmieChange = (e) => {
    selecionarBase(e.target.value);
  };

  const handlePesquisaChange = (e) => {
    const termo = e.target.value;
    setTermoPesquisa(termo);
    filtrarTickets(termo);
  };

  const handleConfigClick = () => {
    navigate("/configuracoes");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  React.useEffect(() => {
    if (baseOmie) {
      setBaseOmieSelecionadaDropdown(baseOmie._id);
    } else {
      setBaseOmieSelecionadaDropdown("");
    }
  }, [baseOmie, listaBases]);

  return (
    <Flex shadow="md" p={4} align="center" justify="space-between">
      <Flex align="center">
        <Link to="/home">
          <Box as="span" fontSize="xl" fontWeight="bold" color="#00E2F4">
            Central de Serviços
          </Box>
        </Link>
      </Flex>

      <Box width={{ base: "full", md: "auto" }} mb={{ base: 2, md: 0 }}>
        <Select
          placeholder="Selecione uma Base Omie"
          value={baseOmieDropdown}
          onChange={handleBaseOmieChange}
          size="sm"
        >
          {listaBases.map((base) => (
            <option key={base._id} value={base._id}>
              {base.nome}
            </option>
          ))}
        </Select>
      </Box>

      <Flex align="center">
        <InputGroup display={{ base: "none", md: "flex" }}>
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.400" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Pesquise por CNPJ, NFS-e, etc..."
            value={termoPesquisa}
            onChange={handlePesquisaChange}
            size="sm"
            width="300px"
          />
        </InputGroup>

        <Tooltip label="Configurações">
          <IconButton
            aria-label="Configurações"
            icon={<FaCog />}
            colorScheme="blue"
            variant="ghost"
            size="lg"
            onClick={handleConfigClick}
            ml={{ base: 2, md: 4 }}
          />
        </Tooltip>

        <Menu>
          <MenuButton>
            <Avatar name="MF" bg="#00E2F4" color="black" size="sm" ml={2} />
          </MenuButton>
          <MenuList>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;
