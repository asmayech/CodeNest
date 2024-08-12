import { Box, ChakraProvider, Flex } from "@chakra-ui/react";

import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Flex flexDirection={"column"}>
          <Navbar />
          <Box minH={"calc(100vh - 120px)"}>
            <Routing />
          </Box>
          <Footer />
        </Flex>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
