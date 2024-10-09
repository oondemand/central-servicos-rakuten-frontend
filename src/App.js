// src/App.js
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Layout from "./components/Layout/Layout";
import PrivateRoute from "./components/PrivateRoute.js";
import { AuthProvider } from "./contexts/AuthContext.js";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ConfigPage = lazy(() => import("./pages/ConfigPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
