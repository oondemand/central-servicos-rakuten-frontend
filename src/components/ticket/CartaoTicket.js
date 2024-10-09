// src/components/ticket/CartaoTicket.js
import React from "react";
import { Box, Text, Flex, Badge } from "@chakra-ui/react";

const CartaoTicket = ({ ticket, onClick }) => {
  const statusColor = getStatusColor(ticket.status);

  return (
    <Box p={4} rounded="md" shadow="sm" cursor="pointer" onClick={onClick}>
      <Text fontWeight="bold">{ticket.titulo}</Text>
      <Text>{ticket.descricao}</Text>
      <Flex align="center" mt={4}>
        <Badge colorScheme={statusColor} mr={2}>
          {capitalize(ticket.status)}
        </Badge>
      </Flex>
    </Box>
  );
};

const getStatusColor = (status) => {
  switch (status) {
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
