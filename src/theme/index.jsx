// src/theme/index.js
import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#FAF3FF",  // Tom claro (branco suave)
    100: "#d3d3e0", // Interpolado entre 50 e 500
    200: "#D9B0F9", // Interpolado entre 50 e 500
    300: "#9f9fc6", // Interpolado entre 50 e 500
    400: "#8528CE", // Interpolado entre 50 e 500
    500: "#8528CE", // Tom predominante (roxo vibrante)
    600: "#7200e6", // Interpolado entre 500 e 700
    700: "#5e00b3", // Tom médio
    800: "#4a0080", // Interpolado entre 700 e 900
    900: "#2e0033", // Tom escuro (roxo profundo)
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
        backgroundColor: "#FFFFFF", // Cor de fundo branco suave
      },
      // Adiciona margem discreta aos componentes <Box>
      ".chakra-box": {
        margin: "2",
      },
      "input, textarea, select": {
        borderColor: "brand.300",
        _hover: {
          borderColor: "brand.400",
        },
        _focus: {
          borderColor: "brand.500",
          boxShadow: "0 0 0 1px brand.500",
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
    Input: {
      variants: {
        outline: {
          field: {
            _focus: {
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px rgba(128, 0, 255, 0.6)",
            },
          },
        },
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            _focus: {
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px rgba(128, 0, 255, 0.6)",
            },
          },
        },
      },
    },
    IconButton: {
      baseStyle: {
        _hover: {
          bg: "brand.600",
        },
      },
    },
  },
});

export default theme;