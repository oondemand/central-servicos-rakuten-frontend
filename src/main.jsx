import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import theme from "./theme"; // Certifique-se de importar seu tema personalizado

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ToastContainer />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
