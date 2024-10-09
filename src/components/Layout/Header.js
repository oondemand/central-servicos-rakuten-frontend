// src/components/Layout/Header.js
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
    <Flex shadow="md" p={4} align="center" justify="space-between" bg="brand.900" color="white">
      <Flex align="center">
        <Link to="/home">
          <Box as="span" fontSize="xl" fontWeight="bold" color="white">
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
          colorScheme="brand"
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
            <FaSearch color="brand.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Pesquise por CNPJ, NFS-e, etc..."
            value={termoPesquisa}
            onChange={handlePesquisaChange}
            size="sm"
            width="300px"
            bg="white"
            color="black"
            _focus={{ borderColor: "brand.500", boxShadow: "outline" }}
          />
        </InputGroup>

        <Tooltip label="Configurações">
          <IconButton
            aria-label="Configurações"
            icon={<FaCog />}
            colorScheme="brand"
            variant="ghost"
            size="lg"
            onClick={handleConfigClick}
            ml={{ base: 2, md: 4 }}
          />
        </Tooltip>

        <Menu>
          <MenuButton>
            <Avatar name="MF" bg="brand.100" color="black" size="sm" ml={2} />
          </MenuButton>
          <MenuList bg="brand.100" color="black">
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;
