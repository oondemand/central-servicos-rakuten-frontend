import React, { useEffect, useState } from "react";
import { default as SelectReact } from "react-select";
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
  InputRightElement,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";

import { useTicket } from "../../contexts/TicketContext";
import { useBaseOmie } from "../../contexts/BaseOmieContext";
import { useAuth } from "../../contexts/AuthContext"; // Importar o contexto de autenticação

const Header = () => {
  const [baseOmieSelecionado, setBaseOmieSelecionado] = useState(null);
  // const { listaBases, baseOmie, selecionarBase } = useBaseOmie();
  const { filtrarTickets } = useTicket();
  const { logout } = useAuth(); // Desestruturar a função de logout
  const navigate = useNavigate();

  const [termoPesquisa, setTermoPesquisa] = useState("");
  // const [baseOmieDropdown, setBaseOmieSelecionadaDropdown] = useState("");

  // const handleBaseOmieChange = (e) => {
  //   selecionarBase(e.target.value);
  // };

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

  const handleBaseOmie = (selectedOption) => {
    setBaseOmieSelecionado(selectedOption); // Atualiza o estado com a opção selecionada
  };

  // useEffect(() => {
  //   if (listaBases.length > 0) {
  //     selecionarBase(listaBases[0]._id);
  //     setBaseOmieSelecionadaDropdown(listaBases[0]._id);
  //   }
  // }, [listaBases]);

  return (
    <Flex
      shadow="md"
      px={6}
      py={4}
      align="center"
      justify="space-between"
      bg="white"
      color="white"
      boxShadow={"0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)"}
    >
      <Flex align="center" gap={14}>
        <Link to="/auth/home">
          <Box as="span" fontSize="xl" fontWeight="bold" color="brand.500">
            <img src="/logo_rakuten_purple.png" alt="RAKUTEN" />
          </Box>
        </Link>
      </Flex>

      <Flex align="center">
        <InputGroup display={{ base: "none", md: "flex" }}>
          <Input
            type="text"
            placeholder="Busque por CNPJ..."
            value={termoPesquisa}
            onChange={handlePesquisaChange}
            size="sm"
            width="300px"
            variant="outline"
            focusBorderColor="brand.500"
            borderColor="gray.300"
            borderRadius="md"
            color="brand.600"
            _placeholder={{
              color: "brand.600",
            }}
          />

          <InputRightElement pointerEvents="none">
            <SearchIcon color="brand.600" style={{ marginTop: "-7px" }} />
          </InputRightElement>
        </InputGroup>

        <Tooltip label="Configurações">
          <IconButton
            aria-label="Configurações"
            icon={<SettingsIcon boxSize="27px" />}
            variant="ghost"
            size="lg"
            onClick={handleConfigClick}
            ml={{ base: 2, md: 4 }}
            color="brand.500"
          />
        </Tooltip>

        <Menu>
          <MenuButton>
            <Avatar bg="gray.400" size="sm" ml={2} />
          </MenuButton>
          <MenuList bg="brand.50">
            <MenuItem onClick={handleLogout}>
              <p></p>
              <Text color="black">Logout</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;
