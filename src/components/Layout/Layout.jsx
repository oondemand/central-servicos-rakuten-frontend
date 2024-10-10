import { Box, Flex } from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import CombinedProvider from "../../contexts/CombinedProvider";

function Layout() {
  return (
    <CombinedProvider>
      <Flex direction="column" minHeight="100vh" overflow="hidden">
        <Box position="fixed" top="0" left="0" right="0" zIndex="1000">
          <Header />
        </Box>
        <Box flex="1" p={8} mt="90px" mb="70px" overflow="auto" width="100vw" height="calc(100vh - 140px)" paddingBottom="0">
          <Outlet />
        </Box>
        <Box position="fixed" bottom="0" left="0" right="0" zIndex="1000">
          <Footer />
        </Box>
      </Flex>
    </CombinedProvider>
  );
}

export default Layout;