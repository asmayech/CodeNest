import React from "react";
import { Flex, Text, Link, Divider, Box, useColorMode } from "@chakra-ui/react";

const Footer: React.FC = () => {
  const { colorMode } = useColorMode();

  return (
    <Box>
      <Divider />

      <Flex
        bg={colorMode === "light" ? "gray.100" : "gray.700"}
        py="4"
        px="6"
        m="auto"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Text>
          &copy; {new Date().getFullYear()} CodeNest. All rights reserved.
        </Text>
        <Text>
          Made with ❤️ by
          <Link href="https://www.facebook.com/asma.ayech.3" isExternal ml={1}>
            Asma Ben Ayech
          </Link>
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
