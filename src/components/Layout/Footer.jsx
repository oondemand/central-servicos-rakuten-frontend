// src/components/common/Footer.js
import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box p={4} textAlign="center" bg="gray.50" color="gray.800">
      <Text>&copy; 2024 Central de Serviços. Todos os direitos reservados.</Text>
    </Box>
  );
};

export default Footer;
