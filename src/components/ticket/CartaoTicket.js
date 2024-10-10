import { Box, Text, Flex, Badge, useColorModeValue, Icon } from "@chakra-ui/react";
import { MdLens } from "react-icons/md";
import React from "react";

const CartaoTicket = ({ ticket, onClick }) => {
  const statusColor = getStatusColor(ticket.status);

  return (
    <Box
      rounded="lg"
      shadow="md"
      cursor="pointer"
      onClick={onClick}
      bg="brand.50"
      p={2}
      my={2}
      borderWidth="1px"
      borderColor="brand.200"
    >
      <Text fontWeight="bold" color="brand.900" fontSize="lg" mb={1}>
        {ticket.titulo}
      </Text>
      <Text color="brand.700" fontSize="sm" mt={2} noOfLines={2}>
        {ticket.observacao}
      </Text>
      <Flex align="center" mt={4} justify="flex-end">
        <Flex align="center">
          <Icon as={MdLens} color={getStatusColor(ticket.status)} boxSize={2} mr={1} />
          <Text fontSize="sm" color="brand.900" fontWeight="bold">
            {capitalize(ticket.status)}
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "aguardando-inicio":
      return "yellow.500";
    case "trabalhando":
      return "green.500";
    case "revisao":
      return "red.500";
    default:
      return "blue.500";
  }
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default CartaoTicket;
