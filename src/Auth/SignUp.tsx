import { useState } from "react";
import {
  Box,
  Flex,
  Input,
  Button,
  FormControl,
  FormLabel,
  Text,
  Divider,
  useToast,
  ModalOverlay,
  Modal,
  ModalBody,
  ModalContent,
  useColorMode,
} from "@chakra-ui/react";
import { FaCentercode } from "react-icons/fa6";
import { useUserStore } from "../stores/user";

interface LoginComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}
const SignUp: React.FC<LoginComponentProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { signUp } = useUserStore();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(formData);
      toast({
        title: "Success",
        description: "User created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        toast({
          title: "Error",
          description: error.response.data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "An error occurred while creating the user.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    setLoading(false);
  };

  const handleLoginClick = () => {
    onClose();
    onOpenLogin();
  };
  const { colorMode } = useColorMode();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" backdropFilter="blur(8px)" />
      <ModalContent bg={colorMode === "light" ? "gray.100" : "gray.900"}>
        <ModalBody>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            my={10}
            rounded={20}
            flexDirection={"column"}
            gap={10}
          >
            <Flex alignItems={"center"} gap={2}>
              <FaCentercode fontSize={"30px"} />

              <Text fontSize="3xl">Code Nest</Text>
            </Flex>
            <Box maxWidth="400px" width="100%">
              <Flex my={5} gap={2} alignItems={"center"}>
                <Divider borderColor={"var(--bordercolor)"}></Divider>
                <Text w={"200px"} textAlign={"center"}>
                  Sign Up
                </Text>
                <Divider borderColor={"var(--bordercolor)"}></Divider>
              </Flex>
              <form onSubmit={handleSubmit}>
                <FormControl mb="5" isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl mb="5" isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl mb="5" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </FormControl>
                <Button
                  color={"var(--chakra-colors-chakra-body-text)"}
                  bg={"var(--maincolor)"}
                  _hover={{
                    bg: "var(--hover-maincolor)",
                    color: "var(--chakra-colors-chakra-body-text)",
                  }}
                  mt={5}
                  w={"100%"}
                  type="submit"
                  isLoading={loading}
                  loadingText="Signing up..."
                >
                  Sign Up
                </Button>
              </form>
            </Box>
            <Button variant="link" onClick={handleLoginClick}>
              Already have an account ? Login
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SignUp;
