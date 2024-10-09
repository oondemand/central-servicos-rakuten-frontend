// src/components/common/ErrorBoundary.js
import React from "react";
import { Box, Text, Button } from "@chakra-ui/react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  resetError = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box textAlign="center" mt={20}>
          <Text fontSize="2xl" mb={4}>Algo deu errado.</Text>
          <Button onClick={this.resetError} colorScheme="blue">
            Tentar Novamente
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
