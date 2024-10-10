// src/pages/HomePage.js
import React from "react";
import Esteira from "../components/Esteira";
import { Flex, Box } from "@chakra-ui/react";

const HomePage = () => {
  return (
    <Flex direction="column">
      <Box flex="1" display="flex">
        <Esteira />
      </Box>
    </Flex>
  );
};

export default HomePage;
