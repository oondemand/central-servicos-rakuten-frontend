// src/pages/HomePage.js
import React from "react";
import Esteira from "../components/Esteira";
import { Flex, Box } from "@chakra-ui/react";

const HomePage = () => {
  return (
    <Flex direction="column" minH="100vh">
      <Box flex="1" p={4} display="flex">
        <Esteira />
      </Box>
    </Flex>
  );
};

export default HomePage;
