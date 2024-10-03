import React from "react";
import { Outlet, Navigate } from "react-router-dom";

import { BaseOmieProvider } from "../../contexts/BaseOmieContext";
import { TicketProvider } from "../../contexts/TicketContext";
import { useAuth } from "../../contexts/AuthContext"; // Importa o contexto de autenticação

const AuthRoute = () => {
  const { user, loading } = useAuth(); // Verifica se o usuário está autenticado

  // Exibe um carregamento enquanto verifica a autenticação
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Redireciona para a página de login se o usuário não estiver autenticado
  if (!user && !loading) {
    return <Navigate to="/" />;
  }

  // Renderiza os Providers e o Outlet (para as rotas internas)
  return (
    <BaseOmieProvider>
      <TicketProvider>
          <Outlet /> {/* Renderiza as rotas filhas */}
      </TicketProvider>
    </BaseOmieProvider>
  );
};

export default AuthRoute;
