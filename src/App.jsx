import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import { Servicos } from "./pages/Servicos";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ConfigPage = lazy(() => import("./pages/ConfigPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AlterarSenha = lazy(() => import("./pages/AlterarSenha"));

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <ToastContainer />
        <ErrorBoundary>
          <Suspense fallback={<Spinner size="xl" />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/alterar-senha" element={<AlterarSenha />} />
              <Route path="/auth" element={<PrivateRoute />}>
                <Route element={<Layout />}>
                  <Route path="home" element={<HomePage />} />
                  <Route path="configuracoes" element={<ConfigPage />} />
                  <Route path="servicos" element={<Servicos />} />
                </Route>
              </Route>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
