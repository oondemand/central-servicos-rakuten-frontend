// src/theme/index.js
import { extendTheme } from "@chakra-ui/react";
import { color } from "framer-motion";

const colors = {
  brand: {
    50: "#FAF3FF", // Tom claro (branco suave)
    100: "#EAD1FC", // Interpolado entre 50 e 500
    200: "#D9B0F9", // Interpolado entre 50 e 500
    300: "#C08AEF", // Interpolado entre 50 e 500
    400: "#8528CE", // Interpolado entre 50 e 500
    500: "#8528CE", // Tom predominante (roxo vibrante)
    600: "#7200e6", // Interpolado entre 500 e 700
    700: "#5e00b3", // Tom médio
    800: "#4a0080", // Interpolado entre 700 e 900
    900: "#2e0033", // Tom escuro (roxo profundo)
  },

  gray: {
    400: "#A0AEC0",
  },

  blue: {
    400: "#0BC5EA"
  }
};

const shadows = {
  outline: "0 0 0 3px rgba(128, 0, 255, 0.6)", // Aumenta o contorno para combinar com a cor primária
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
        backgroundColor: "#FFFFFF",
      },
      ".chakra-box": {
        margin: "2",
      },
      "input, textarea, select": {
        borderColor: "gray.400",
        color: "brand.500",
        _expanded: {
          bg: "brand.100",
          option: {
            bg: "brand.100",
            _hover: {
              bg: "brand.200",
            },
            _selected: {
              bg: "brand.300",
            },
          },
        },
      },
    },
  },
  components: {
    Button: {
      variants: {
        solid: (props) => ({
          bg: props.colorScheme === "brand" ? "brand.500" : props.bg,
          color: props.colorScheme === "brand" ? "brand.50" : props.color,
          _hover: {
            bg: props.colorScheme === "brand" ? "brand.600" : props.bg,
          },
        }),
      },
    },
    // Você pode adicionar personalizações para outros componentes aqui
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: "gray.400",
            _focus: {
              borderColor: "gray.500",
              boxShadow: "0 0 0 1px rgba(133, 40, 206, 0.6)",
            },
          },
        },
      },
    },
    IconButton: {
      baseStyle: {
        _hover: {
          bg: "brand.500",
        },
      },
    },
  },
});

export default theme;
