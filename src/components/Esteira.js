// src/components/Esteira.js
import React from "react";
import Etapa from "./Etapa";
import ContaPagar from "./ContaPagar";
import { useEtapa } from "../contexts/EtapaContext";
import { Box, Flex } from "@chakra-ui/react";

const Esteira = () => {
  const { listaEtapas } = useEtapa();

  return (
    <Box p={4} height="full" overflowX="auto">
      <Flex gap={4} maxW="2xl" mx="auto">
        {listaEtapas.map((etapa, index) => (
          <Box key={etapa._id} flexShrink={0}>
            <Etapa etapa={etapa} index={index} />
          </Box>
        ))}
        <Box flexShrink={0}>
          <ContaPagar />
        </Box>
      </Flex>
    </Box>
  );
};

export default Esteira;
