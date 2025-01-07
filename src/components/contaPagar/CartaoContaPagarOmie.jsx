// CartaoContaPagarOmie.js
import React, { useState, useEffect } from "react";
import { Box, Text, Spinner, Badge, useColorModeValue } from "@chakra-ui/react";
import api from "../../services/api";

const CartaoContaPagarOmie = ({ ticket }) => {
  const [contaPagar, setContaPagar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContaPagar = async () => {
      let tentativas = 1;
      let maxTentativas = 3;

      while (tentativas < maxTentativas) {
        try {
          const response = await api.get(
            `/contas-pagar/${ticket.contaPagarOmie}`
          );

          setContaPagar(response.data);
          setLoading(false);
          return;
        } catch (error) {
          tentativas++;
          console.log("Erro ao buscar conta a pagar:", error);
          if (tentativas < maxTentativas) {
            console.log("esperando");
            await new Promise((resolve) => setTimeout(resolve, 30000));
          }
        }
      }

      setError("Ouve um erro ao buscar conta a pagar.");
      setLoading(false);
    };

    ticket.contaPagarOmie ? fetchContaPagar() : setLoading(false);
  }, [ticket.contaPagarOmie]);

  const bg = useColorModeValue("gray.200", "gray.600");
  const errorBg = useColorModeValue("red.100", "red.600");
  const warningBg = useColorModeValue("yellow.100", "yellow.600");
  const successBg = useColorModeValue("green.100", "green.600");

  if (loading) {
    return (
      <Box p={4} bg={bg} my={2} rounded="md" shadow="sm">
        <Spinner />
      </Box>
    );
  }

  // if (error) {
  //   return (
  //     <Box p={4} bg={errorBg} my={2} rounded="md" shadow="md">
  //       <Text color="red.500">{error}</Text>
  //     </Box>
  //   );
  // }

  // tickets sem serviço não geram conta a pagar (isso evita um bug)
  if (ticket.servicos.length === 0) {
    return;
  }

  if (!contaPagar || error) {
    return (
      <Box p={4} bg={warningBg} my={2} rounded="md" shadow="sm">
        <Text fontWeight="bold">{ticket.titulo}</Text>
        <Text>Carregando conta a pagar...</Text>
      </Box>
    );
  }

  return (
    <Box
      rounded="lg"
      shadow="md"
      cursor="pointer"
      bg="brand.50"
      p={2}
      my={2}
      borderWidth="1px"
      borderColor="brand.200"
      color="brand.900"
    >
      <Text fontWeight="bold">{ticket.titulo}</Text>
      <Text>Documento: {contaPagar?.numero_documento}</Text>
      <Text>Valor: R$ {contaPagar?.valor_documento?.toFixed(2)}</Text>
      <Text>Vencimento: {contaPagar?.data_vencimento}</Text>
      <Text>{contaPagar?.status_titulo}</Text>
    </Box>
  );
};

export default CartaoContaPagarOmie;
