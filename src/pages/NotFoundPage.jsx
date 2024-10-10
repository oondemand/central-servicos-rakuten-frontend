// src/pages/NotFoundPage.js
import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box textAlign="center" mt={20}>
      <Heading>404 - Página Não Encontrada</Heading>
      <Text mt={4}>A página que você está procurando não existe.</Text>
      <Button as={Link} to="/auth/home" colorScheme="brand.500" mt={6}>
        Voltar para Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;