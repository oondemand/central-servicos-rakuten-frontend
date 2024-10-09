// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#f5e6ff",
    100: "#e0b3ff",
    200: "#cc80ff",
    300: "#b34dff",
    400: "#9933ff",
    500: "#8000ff",
    600: "#6600cc",
    700: "#4d0099",
    800: "#330066",
    900: "#1a0033",
  },
};

const shadows = {
  outline: "0 0 0 3px rgba(66, 153, 225, 0.6)", // Aumenta o contorno
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", // Sombra grande
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", // Sombra extra grande
};

const borders = {
  sm: "1px solid",
  md: "2px solid",
  lg: "3px solid",
};

const theme = extendTheme({
  colors,
  shadows,
  borders,
  styles: {
    global: {
      "html, body": {
        backgroundColor: "brand.50",
      },
      // Adiciona margem discreta aos componentes <Box>
      ".chakra-box": {
        margin: "2",
      },
    },
  },
});

export default theme;
