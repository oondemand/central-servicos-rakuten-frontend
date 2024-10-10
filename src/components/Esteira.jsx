// src/components/Esteira.js
import React from "react";
import Etapa from "./Etapa";
import EtapaIntegracaoOmie from "./EtapaIntegracaoOmie";
import { useEtapa } from "../contexts/EtapaContext";
import { Box, Flex } from "@chakra-ui/react";

const Esteira = () => {
  const { listaEtapas } = useEtapa();

  return (
    <Box height="full" overflowX="auto">
      <Flex width="100%" gap={4}>
        {listaEtapas.map((etapa, index) => (
          <Box key={etapa._id} flexShrink={0} width="220px">
            <Etapa etapa={etapa} index={index} />
          </Box>
        ))}
        <Box flexShrink={0} width="220px">
          <EtapaIntegracaoOmie />
        </Box>
      </Flex>
    </Box>
  );
};

export default Esteira;
