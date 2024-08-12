import {
  Box,
  Heading,
  Text,
  Button,
  Link,
  Stack,
  VStack,
  Flex,
  useColorMode,
} from "@chakra-ui/react";

import { useState } from "react";
import SignUp from "../Auth/SignUp";
import Login from "../Auth/Login";
function HomePage() {
  const { colorMode } = useColorMode();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleOpenLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  const handleOpenSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleCloseSignup = () => {
    setIsSignupOpen(false);
  };
  const handleOpenSignupFromLogin = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };
  const handleOpenLoginFromSignup = () => {
    setIsLoginOpen(true);
    setIsSignupOpen(false);
  };
  return (
    <Box textAlign="center" padding="6">
      <Login
        isOpen={isLoginOpen}
        onClose={handleCloseLogin}
        onOpenSignup={handleOpenSignupFromLogin}
      />
      <SignUp
        isOpen={isSignupOpen}
        onClose={handleCloseSignup}
        onOpenLogin={handleOpenLoginFromSignup}
      />
      <VStack textAlign="left" spacing={5} h={"300px"} mt={70}>
        <Text fontSize="7xl">Welcome to CodeNest</Text>
        <Text fontSize="2xl" color={colorMode === "light" ? "" : "gray.300"}>
          Start practicing coding exercises and improve your skills!
        </Text>
        <Button colorScheme="blue" size="md" onClick={handleOpenSignup}>
          Get Started
        </Button>
        <Text fontSize="md">
          Already have an account?
          <Link color="blue.500" onClick={handleOpenLogin}>
            Log in
          </Link>
        </Text>
      </VStack>
      <Stack mt="12" spacing={8}>
        <Heading as="h2" size="xl">
          Why CodeNest?
        </Heading>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={8}
          alignItems="center"
          justifyContent="center"
        >
          <Box maxW="300px" textAlign="center">
            <Heading as="h3" size="lg" mb="4">
              Learn by Doing
            </Heading>
            <Text>
              CodeNest provides interactive coding exercises that allow you to
              learn programming concepts through hands-on practice.
            </Text>
          </Box>
          <Box maxW="300px" textAlign="center">
            <Heading as="h3" size="lg" mb="4">
              Track Your Progress
            </Heading>
            <Text>
              Keep track of your progress as you complete exercises and achieve
              milestones on your coding journey.
            </Text>
          </Box>
          <Box maxW="300px" textAlign="center">
            <Heading as="h3" size="lg" mb="4">
              Community Support
            </Heading>
            <Text>
              Join a supportive community of learners and mentors who can help
              you overcome challenges and achieve your goals.
            </Text>
          </Box>
        </Stack>
      </Stack>
      <Flex
        maxW={"1000px"}
        border={" solid 1px"}
        borderColor={"gray.600"}
        rounded={10}
        m={"10px auto"}
        mt="12"
        justifyContent={"space-between"}
        px={5}
        py={3}
      >
        <Box>
          <Text fontSize="2xl" textAlign={"start"}>
            Get Started Today
          </Text>
          <Text>
            or
            <Link color="blue.500" onClick={handleOpenLogin} mx={1}>
              Log in
            </Link>
            if you already have an account.
          </Text>
        </Box>
        <Stack spacing={4} alignItems="center" justifyContent="center">
          <Button size="sm" onClick={handleOpenSignup}>
            Sign Up Now
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
}

export default HomePage;
