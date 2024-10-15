import { Box, Text, Flex, Icon } from "@chakra-ui/react";
import { MdLens } from "react-icons/md";
import React from "react";

const CartaoTicket = ({ ticket, onClick }) => {
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
      <Text fontWeight="bold" color="brand.900" fontSize="md" mb={1}>
        <Icon as={MdLens} color={getStatusColor(ticket.status)} boxSize={2} mr={1} />
        {ticket.titulo}
      </Text>
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
