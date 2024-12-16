// src/components/PrivateRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Spinner, Center, Flex } from "@chakra-ui/react";

const PrivateRoute = () => {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <Center h="100vh">
        <Flex direction="column" align="center">
          <Spinner color="brand.500" size="xl" />
          <p>Por favor, Aguarde...</p>
        </Flex>
      </Center>
    );
  }
  
  if(usuario && (usuario.tipo === "central" || usuario.tipo === "admin")){
    return <Outlet/>
  }

  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
