// CartaoContaPagarOmie.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Spinner,
  Badge,
  useColorModeValue,
  Button,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import api from "../../services/api";
import { RepeatIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";

const MotionText = motion(Text);

const ContaPagarBox = ({ children, ...rest }) => {
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
      {...rest}
    >
      {children}
    </Box>
  );
};

const CartaoContaPagarOmie = ({ ticket }) => {
  const [contaPagar, setContaPagar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContaPagar = async () => {
    setLoading(true);

    try {
      const response = await api.get(`/contas-pagar/${ticket.contaPagarOmie}`, {
        timeout: 5000,
      });

      setContaPagar(response.data);
      setLoading(false);
      setError(false);
      return;
    } catch (error) {
      console.log("Erro ao buscar conta a pagar:", error);
      setError(error.response.data.erro);
    }

    setLoading(false);
  };

  useEffect(() => {
    ticket.contaPagarOmie ? fetchContaPagar() : setLoading(false);
  }, [ticket.contaPagarOmie]);

  const bg = useColorModeValue("gray.200", "gray.600");
  const errorBg = useColorModeValue("red.100", "red.600");
  const warningBg = useColorModeValue("yellow.100", "yellow.600");
  const successBg = useColorModeValue("green.100", "green.600");

  // tickets sem serviço não geram conta a pagar (isso evita um bug)
  if (ticket.servicos.length === 0) {
    return;
  }

  const valorTotalServicos = ticket.servicos.reduce(
    (cur, acc) => cur + acc.valorTotal,
    0
  );

  if (error === "PAYABLE ACCOUNT NOT FOUND") {
    return;
  }

  if (loading) {
    return (
      <ContaPagarBox>
        <Text fontWeight="bold">{ticket.titulo}</Text>
        <Text>Valor: R$ {valorTotalServicos.toFixed(2)}</Text>
        <Text>Vencimento: ...</Text>
        <Box display="flex" gap="2">
          Status:{" "}
          <MotionText
            animate={{ opacity: [0.5, 1, 1, 0.5] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            CARREGANDO
          </MotionText>
        </Box>
      </ContaPagarBox>
    );
  }

  if (error) {
    return (
      <ContaPagarBox position="relative">
        <Text fontWeight="bold">{ticket.titulo}</Text>
        <Text>Valor: R$ {valorTotalServicos.toFixed(2)}</Text>
        <Text>Vencimento: ...</Text>
        <Text>Status: FALHA NA CONEXÃO</Text>
        <IconButton
          onClick={() => {
            fetchContaPagar();
          }}
          position="absolute"
          bottom="2"
          right="3"
          size="xs"
          rounded="full"
        >
          <RepeatIcon />
        </IconButton>
      </ContaPagarBox>
    );
  }

  return (
    <ContaPagarBox>
      <Text fontWeight="bold">{ticket.titulo}</Text>
      <Text>Documento: {contaPagar?.numero_documento || "..."}</Text>
      {contaPagar?.valor_documento == valorTotalServicos ? (
        <Text>Valor: R$ {contaPagar?.valor_documento?.toFixed(2)}</Text>
      ) : (
        <Flex gap="2">
          Valor:<Text as="s">R$ {valorTotalServicos.toFixed(2)}</Text>
          <Text>R$S {contaPagar?.valor_documento?.toFixed(2)}</Text>
        </Flex>
      )}
      <Text>Vencimento: {contaPagar.data_vencimento}</Text>
      <Text>Status: {contaPagar?.status_titulo}</Text>
    </ContaPagarBox>
  );
};

export default CartaoContaPagarOmie;
