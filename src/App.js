// src/App.js
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import CombinedProvider from "./contexts/CombinedProvider"; // Importa o combinador
import ErrorBoundary from "./components/common/ErrorBoundary"; // Importa o ErrorBoundary
import Layout from "./components/Layout/Layout";
import PrivateRoute from "./components/PrivateRoute.js";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ConfigPage = lazy(() => import("./pages/ConfigPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage")); // Crie uma página 404

function App() {
  return (
    <CombinedProvider>
      <ErrorBoundary>
        <Suspense fallback={<Spinner size="xl" />}>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<LoginPage />} />

            {/* Rotas Protegidas */}
            <Route path="/" element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="home" element={<HomePage />} />
                <Route path="configuracoes" element={<ConfigPage />} />
              </Route>
            </Route>

            {/* Rota padrão */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </CombinedProvider>
  );
}

export default App;
