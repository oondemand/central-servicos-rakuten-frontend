import React from "react";
import { SearchIcon, SettingsIcon } from "@chakra-ui/icons";
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
    navigate("/auth/configuracoes");
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
    <Flex shadow="md" p={4} align="center" justify="space-between" bg="brand.50" color="white">
      <Flex align="center">
        <Link to="/auth/home">
          <Box as="span" fontSize="xl" fontWeight="bold" color="brand.500">
            Central de Serviços Rakuten
          </Box>
        </Link>
      </Flex>

      <Box width={{ base: "full", md: "auto" }} mb={{ base: 2, md: 0 }}>
        <Select
          placeholder="Selecione a Base Omie"
          value={baseOmieDropdown}
          onChange={handleBaseOmieChange}
          size="sm"
          variant="outline"
          focusBorderColor="brand.500"
          borderColor="gray.300"
          borderRadius="md"
          color="brand.600"
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
            <SearchIcon color="brand.600" style={{ marginTop: '-7px' }} />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Buscar por CNPJ, NFS-e, etc..."
            value={termoPesquisa}
            onChange={handlePesquisaChange}
            size="sm"
            width="300px"
            variant="outline"
            focusBorderColor="brand.500"
            borderColor="gray.300"
            borderRadius="md"
            color="brand.600"
          />
        </InputGroup>

        <Tooltip label="Configurações">
          <IconButton
            aria-label="Configurações"
            icon={<SettingsIcon />}
            variant="ghost"
            size="lg"
            onClick={handleConfigClick}
            ml={{ base: 2, md: 4 }}
            color="brand.500"
          />
        </Tooltip>

        <Menu>
          <MenuButton>
            <Avatar name="MF" bg="brand.500" size="sm" ml={2} />
          </MenuButton>
          <MenuList bg="brand.50">
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;
