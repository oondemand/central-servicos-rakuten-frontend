import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { AuthContextProvider } from "./contexts/AuthContext";
import { NotificacaoProvider } from "./contexts/NotificacaoContext";

import NotificacaoUsuario from "./components/common/NotificacaoUsuario";
import AuthRoute from "./components/common/AuthRoute"; // Usando o AuthRoute

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ConfigPage from "./pages/ConfigPage";

function App() {
  document.documentElement.classList.add("dark");

  return (
    <AuthContextProvider>
      <NotificacaoProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <NotificacaoUsuario /> {/* Adicionando o componente de exibição de notificações */}
            <Routes>
              <Route path="/" element={<LoginPage />} />

              {/* Agrupa todas as rotas privadas dentro de AuthRoute */}
              <Route path="/" element={<AuthRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/configuracoes" element={<ConfigPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </BrowserRouter>
      </NotificacaoProvider>
    </AuthContextProvider>
  );
}

export default App;
