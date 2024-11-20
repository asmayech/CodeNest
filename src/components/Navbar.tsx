import {
  Box,
  Flex,
  Button,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  useColorMode,
} from "@chakra-ui/react";
import { FaCentercode } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import Login from "../Auth/Login";
import { useEffect, useState } from "react";
import SignUp from "../Auth/SignUp";
import { useUserStore } from "../stores/user";
import { TbUserCode } from "react-icons/tb";
import { MdLogout, MdVerified } from "react-icons/md";
import { BiRocket } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import ThemeSwitcher from "./ThemeSwitcher";

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const isLoggedIn = localStorage.getItem("token") !== null;
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/')
  };

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
  const handleSearch = () => {
    const inputElement = document.querySelector("input");
    if (inputElement instanceof HTMLInputElement) {
      const searchTerm = inputElement.value;
      navigate(`/ListExercisePage?search=${searchTerm}`);
    }
  };
  const { colorMode } = useColorMode();

  return (
    <Box
      bg={colorMode === "light" ? "" : "gray.700"}
      borderBottom={colorMode === "light" ? "solid 1px" : ""}
      borderColor={colorMode === "light" ? "gray.200" : ""}
      py="2"
      px="3"
    >
      <Flex mx="auto" alignItems="center" justifyContent="space-between">
        <Flex alignItems={"center"} gap={1}>
          <NavLink to="/">
            <Button variant="ghost" size={"md"} gap={2}>
              <FaCentercode fontSize={"20px"} />
              <Text fontSize="xl" fontWeight="bold" mr="4">
                CodeNest
              </Text>
            </Button>
          </NavLink>
          {
            user?         '' :<NavLink to="/">
          
            <Button variant="ghost" size={"md"}>
              <Text>Home</Text>
            </Button>
          </NavLink>
          }

          <NavLink to="/ListExercisePage">
            <Button variant="ghost" size={"md"}>
              <Text>Exercises</Text>
            </Button>
          </NavLink>
          <NavLink to="/AboutUs">
            <Button variant="ghost" size={"md"}>
              <Text>About us </Text>
            </Button>
          </NavLink>
          <NavLink to="/ContactUs">
            <Button variant="ghost" size={"md"}>
              <Text>Contact</Text>
            </Button>
          </NavLink>
          <NavLink to="/NewExercisePage">
            {user && (user.isAdmin || user.verified) && (
              <Button size={"md"} rightIcon={<BiRocket color="orange" />}>
                <Text>Create Exercise</Text>
              </Button>
            )}
          </NavLink>

          <NavLink to="/ListUsers">
            {user && user.isAdmin && (
              <Button size={"md"}>
                <Text>Users List</Text>
              </Button>
            )}
          </NavLink>
          <NavLink to="/Category">
            {user && user.isAdmin && (
              <Button size={"md"}>
                <Text>Exercices category</Text>
              </Button>
            )}
          </NavLink>
        </Flex>
        <InputGroup size="md" w={450}>
          <Input
            borderColor={colorMode === "light" ? "gray.200" : "gray.500"}
            placeholder="Search section"
            _placeholder={{ color: "gray.400" }}
          />
          <InputRightElement w={"70px"}>
            <Button
              size="xs"
              mr={-6}
              color={colorMode === "light" ? "black" : "white"}
              px={2}
              onClick={handleSearch}
            >
              <FaSearch />
            </Button>
          </InputRightElement>
        </InputGroup>
        <Flex alignItems="center" gap={2}>
          {!isLoggedIn ? (
            <>
              <Button size={"sm"} variant="ghost" onClick={handleOpenLogin}>
                login
              </Button>
              <Button size={"sm"} onClick={handleOpenSignup}>
                Sign In
              </Button>
            </>
          ) : (
            <>
              <NavLink to={`/Profile/${user ? user.userId : ""}`}>
                <Button
                  border={"solid 1px"}
                  borderColor={colorMode === "light" ? "gray.100" : "gray.600"}
                  rounded="5px"
                  h="35px"
                  p={"5px 10px"}
                  gap={2}
                  alignItems="center"
                  justifyContent="center"
                  fontSize="md"
                >
                  {user && user.isAdmin && <MdVerified color="pink" />}
                  {user && user.verified && !user.isAdmin && (
                    <MdVerified color="cyan" />
                  )}
                  {user && !user.isAdmin && !user.verified && <TbUserCode />}

                  <Text>{user ? user.userName : "User Name"}</Text>
                </Button>
              </NavLink>
              <Button
                color={"red.300"}
                onClick={handleLogout}
                size={"sm"}
                fontSize={"20px"}
              >
                <MdLogout />
              </Button>
            </>
          )}
          <ThemeSwitcher />
        </Flex>
      </Flex>
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
    </Box>
  );
}

export default Navbar;
