import React, { useState } from "react";
import { SearchIcon, SettingsIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Input,
  IconButton,
  Avatar,
  InputGroup,
  InputRightElement,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Image,
} from "@chakra-ui/react";

import { useTicket } from "../../contexts/TicketContext";
import { useAuth } from "../../contexts/AuthContext"; // Importar o contexto de autenticação

const Header = () => {
  const { filtrarTickets } = useTicket();
  const { logout } = useAuth(); // Desestruturar a função de logout
  const navigate = useNavigate();

  const [termoPesquisa, setTermoPesquisa] = useState("");

  const handlePesquisaChange = (e) => {
    const termo = e.target.value;
    setTermoPesquisa(termo);
    filtrarTickets(termo);
  };

  const handleConfigClick = () => {
    navigate("/auth/configuracoes", { viewTransition: true });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Flex
      shadow="md"
      px="6"
      py="2.5"
      align="center"
      justify="space-between"
      bg="white"
      color="white"
    >
      <Flex align="center" gap="20">
        <Link to="/auth/home">
          <Box as="span" fontSize="xl" fontWeight="bold" color="brand.500">
            <Image src="/logo_rakuten_purple.png" alt="RAKUTEN" h="35px" />
          </Box>
        </Link>

        <Flex gap="8" color="brand.400" fontWeight="medium">
          <Link to="/auth/servicos">
            <Text>Serviços</Text>
          </Link>

          <Link to="/auth/prestadores">
            <Text>Prestadores</Text>
          </Link>

          <Link to="/auth">
            <Text>Esteira</Text>
          </Link>
        </Flex>
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
              <Text color="black">Logout</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;
