// src/components/common/Footer.js
import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box p={4} textAlign="center" bg="brand.500" color="white">
      <Text>&copy; 2024 Central de Serviços. Todos os direitos reservados.</Text>
    </Box>
  );
};

export default Footer;
