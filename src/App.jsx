// src/App.js
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ConfigPage = lazy(() => import("./pages/ConfigPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <AuthProvider>
      <ToastContainer />
      <ErrorBoundary>
        <Suspense fallback={<Spinner size="xl" />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth" element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="home" element={<HomePage />} />
                <Route path="configuracoes" element={<ConfigPage />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
