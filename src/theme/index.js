// src/theme/index.js
import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#faf5ff",  // Tom claro
    100: "#e9d8fd", // Interpolado entre 50 e 700
    200: "#d6bcfa", // Interpolado entre 50 e 700
    300: "#b794f4", // Interpolado entre 50 e 700
    400: "#9f7aea", // Interpolado entre 50 e 700
    500: "#805ad5", // Interpolado entre 50 e 700
    600: "#6b46c1", // Interpolado entre 50 e 700
    700: "#5a3e8e", // Tom médio
    800: "#44337a", // Interpolado entre 700 e 900
    900: "#3d1c4f", // Tom escuro
    // Adicionando subpaletas para estados específicos, se necessário
    error: {
      50: "#ffe3e3",
      100: "#ffbdbd",
      200: "#ff9999",
      300: "#ff7575",
      400: "#ff5252",
      500: "#ff2f2f",
      600: "#e60000",
      700: "#b30000",
      800: "#800000",
      900: "#4d0000",
    },
    success: {
      50: "#e3ffe3",
      100: "#b3ffb3",
      200: "#80ff80",
      300: "#4dff4d",
      400: "#33ff33",
      500: "#00ff00",
      600: "#00cc00",
      700: "#009900",
      800: "#006600",
      900: "#003300",
    },
    warning: {
      50: "#fff4e6",
      100: "#ffe0b3",
      200: "#ffcc80",
      300: "#ffb34d",
      400: "#ff9933",
      500: "#ff8000",
      600: "#cc6600",
      700: "#994d00",
      800: "#663300",
      900: "#331a00",
    },
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

const fonts = {
  heading: `'Segoe UI', sans-serif`,
  body: `'Segoe UI', sans-serif`,
};

const theme = extendTheme({
  colors,
  shadows,
  borders,
  fonts,
  styles: {
    global: {
      "html, body": {
        backgroundColor: "white",
      },
      // Adiciona margem discreta aos componentes <Box>
      ".chakra-box": {
        margin: "2",
      },
      "input, textarea, select": {
        borderColor: "gray.300",
        _hover: {
          borderColor: "gray.400",
        },
        _focus: {
          borderColor: "gray.500",
          boxShadow: "0 0 0 1px gray.500",
        },
      },
    },
  },
  components: {
    Button: {
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === "brand" ? "brand.500" : props.bg,
          color: props.colorScheme === "brand" ? "white" : props.color,
          _hover: {
            bg: props.colorScheme === "brand" ? "brand.600" : props.bg,
          },
        }),
      },
    },
    // Você pode adicionar personalizações para outros componentes aqui
  },
});

export default theme;
