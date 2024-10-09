// src/theme/index.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e3f9e5',
      100: '#c1eacb',
      200: '#a3d9af',
      300: '#7bc58e',
      400: '#57b56e',
      500: '#3a914e',
      600: '#2f7d3d',
      700: '#256b2e',
      800: '#1c5620',
      900: '#143213',
    },
  },
  fonts: {
    heading: 'Roboto, sans-serif',
    body: 'Open Sans, sans-serif',
  },
  // Outras personalizações
});

export default theme;
