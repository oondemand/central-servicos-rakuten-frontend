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
      color="brand.900"
      _hover={{ background: 'brand.75' }} 
    >
      <Flex alignItems="center" fontWeight="bold" fontSize="md" mb={1}>
        <Flex alignItems="center" justifyContent="center"  height={5}>
          <Icon
            as={MdLens}
            color={getStatusColor(ticket.status)}
            mr={1}
          />
        </Flex>

        <Text fontWeight={500} fontSize={"md"} color={"#3D1C4F"}>{ticket.titulo}</Text>
      </Flex>
    </Box>
  );
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "aguardando-inicio":
      return "yellow.400";
    case "trabalhando":
      return "green.400";
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
