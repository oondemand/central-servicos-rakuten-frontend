// src/components/ticket/CartaoTicket.js
import React from "react";
import { Box, Text, Flex, Badge, useColorModeValue } from "@chakra-ui/react";

const CartaoTicket = ({ ticket, onClick }) => {
  const statusColor = getStatusColor(ticket.status);
  const bg = useColorModeValue('brand.50', 'brand.700');

  return (
    <Box rounded="md" shadow="sm" cursor="pointer" onClick={onClick} bg={bg} p={2} m={2}>
      <Text fontWeight="bold" color="brand.500">{ticket.titulo}</Text>
      <Text color="gray.700">{ticket.descricao}</Text>
      <Flex align="center" mt={4}>
        <Badge colorScheme={statusColor}>
          {capitalize(ticket.status)}
        </Badge>
      </Flex>
    </Box>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "aguardando-inicio":
      return "yellow";
    case "trabalhando":
      return "green";
    case "revisao":
      return "red";
    default:
      return "blue";
  }
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default CartaoTicket;
