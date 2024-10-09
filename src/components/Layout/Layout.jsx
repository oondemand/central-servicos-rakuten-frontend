// src/components/Layout/Layout.jsx
import React from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <Box minH="100vh">
      <Header />
      <Box
        mt="16" // Espaço para o Header fixo
        p="4"
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
