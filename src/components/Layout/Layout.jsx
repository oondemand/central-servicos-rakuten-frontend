import { Box, Flex } from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import CombinedProvider from "../../contexts/CombinedProvider";

function Layout() {
  return (
    <CombinedProvider>
      <Flex direction="column" minHeight="100vh" bg="brand.50">
        <Header />
        <Box flex="1" p={4}>
          <Outlet />
        </Box>
        <Footer />
      </Flex>
    </CombinedProvider>
  );
}

export default Layout;