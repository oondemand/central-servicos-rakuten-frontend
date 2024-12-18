import {
  Select,
  Box,
  List,
  ListItem,
  Input,
  Text,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { listarPrestadores } from "../../services/prestadorService";

export const PrestadorFilter = () => {
  const [prestadores, setPrestadores] = useState([]);
  const [prestadoreFiltrados, setPrestadoresFiltrados] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { setFieldValue } = useFormikContext();

  const fecthPrestadores = async () => {
    try {
      const prestadores = await listarPrestadores();

      if (prestadores && prestadores.length > 0) {
        setPrestadores(prestadores);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fecthPrestadores();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const prestadoresFiltrados = prestadores.filter((prestador) => {
      const prestadoresEncontrados = prestador.nome
        .toLowerCase()
        .includes(value.trim().toLowerCase());

      const documento = prestador.documento
        .toString()
        .toLowerCase()
        .includes(value.trim().toString().toLowerCase());

      const sci = prestador.sid
        .toString()
        .toLowerCase()
        .includes(value.trim().toString().toLowerCase());

      const email = prestador.email
        ? prestador.email
            .toString()
            .toLowerCase()
            .includes(value.trim().toString().toLowerCase())
        : false;

      return prestadoresEncontrados || documento || sci || email;
    });

    setPrestadoresFiltrados(prestadoresFiltrados);
  };

  const handleOptionClick = (prestador) => {
    setFieldValue("email", prestador.email || "");
    setFieldValue("nome", prestador.nome);
    setFieldValue("prestadorId", prestador._id);

    setInputValue(prestador.nome + " - " + prestador.sid);
    setPrestadoresFiltrados([]);
  };

  return (
    <Box position="relative">
      <VStack align="start" mb="2" gap="1">
        <Text>Selecione um prestador</Text>
        <Input
          w="full"
          placeholder="Digite um nome..."
          value={inputValue}
          onChange={handleInputChange}
        />
      </VStack>
      {prestadoreFiltrados.length > 0 && (
        <List
          position="absolute"
          top="100%"
          left="0"
          width="100%"
          bg="white"
          border="1px solid #ddd"
          borderRadius="md"
          boxShadow="sm"
          zIndex="10"
          maxHeight="300px" // Altura máxima da lista
          overflowY="auto" // Scroll vertical quando necessário
        >
          {prestadoreFiltrados.map((prestador, index) => {
            return (
              <ListItem
                key={prestador._id}
                p={2}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => handleOptionClick(prestador)}
              >
                {prestador.nome} - {prestador.sid} - {prestador.documento}{" "}
                {prestador.email ? " - " + prestador.email : ""}
              </ListItem>
            );
          })}
        </List>
      )}
    </Box>
  );
};
