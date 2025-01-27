// src/components/common/Footer.js
import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box p={4} textAlign="center" bg="gray.50" color="gray.800">
      <Text>
        &copy; Central de Serviços OonDemand vs{" "}
        {import.meta.env.VITE_SERVICE_VERSION}
      </Text>
    </Box>
  );
};

export default Footer;
