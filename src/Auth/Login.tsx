import { useState,useEffect } from "react";
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
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  useColorMode,
  ModalFooter,
  useConst,
} from "@chakra-ui/react";
import { FaCentercode } from "react-icons/fa6";
import { useUserStore } from "../stores/user";
import {useNavigate,redirect } from 'react-router-dom';
import { confirmEmail, sendConfirmationEmail } from "../services/EmailService";
import axios from "axios";
interface LoginComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSignup: () => void;
}
//const navigate = useNavigate();

const Login: React.FC<LoginComponentProps> = ({
  isOpen,
  onClose,
  onOpenSignup,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showConfirmCode, setShowConfirmCode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  const [confirmationCode, setConfirmationCode] = useState("");

  const { user, login } = useUserStore();
  const toast = useToast();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleForgotPassword = async () => {
    try {
      await sendConfirmationEmail(formData.email);
      setShowConfirmCode(true); // Show modal to input confirmation code
      toast({
        title: "Success",
        description: "Confirmation code sent successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      toast({
        title: "Error",
        description: "Failed to send confirmation code. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleConfirmCode = async () => {
    try {
      await confirmEmail(formData.email, confirmationCode);
      setShowConfirmCode(false);
      setShowForgotPassword(false);
      setShowChangePassword(true);
    } catch (error) {
      console.error("Error confirming email:", error);
      toast({
        title: "Error",
        description: "Failed to confirm email. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword !== newPasswordConfirmation) {
        toast({
          title: "Error",
          description: "Passwords do not match.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Send request to change password
      const response = await axios.post(
        "http://localhost:4401/api/confirm/change-password",
        {
          email: formData.email,
          newPassword,
        }
      );

      // Password changed successfully
      setShowChangePassword(false);
      toast({
        title: "Success",
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
            redirect("/dashboard");
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      toast({
        title: "Success",
        description: "Logged in successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsLoggedIn(true);
      setFormData({
        email: "",
        password: "",
      })
    //  navigate(`/Profile/${user?.userId}`);


    } catch (error: any) {
      console.error("Error logging in:", error);

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
          description: "Failed to log in. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    setLoading(false);
  };
  const navigate = useNavigate();

  const [gotoProfile, SetGoToProfile] = useState(false);
  useEffect(() => {

    if (isLoggedIn) {
      setIsLoggedIn(false);
      onClose();
      navigate(`/Profile/${user?.userId}`);
      setFormData({
        email: "",
        password: "",
      });
    }
  
  }, [isLoggedIn]);


  const handleSignUpClick = () => {
    onClose();
    onOpenSignup();
  };

  const { colorMode } = useColorMode();

  return (
    <Box>
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
                    Login
                  </Text>
                  <Divider borderColor={"var(--bordercolor)"}></Divider>
                </Flex>
                <form onSubmit={handleSubmit}>
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
                    loadingText="Logging in..."
                  >
                    Login
                  </Button>
                  <Button
                    variant="link"
                    mt={2}
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </Button>
                </form>
              </Box>
              <Button variant="link" onClick={handleSignUpClick}>
                Don't have an account? Sign Up
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      >
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" backdropFilter="blur(8px)" />
        <ModalContent bg={colorMode === "light" ? "gray.100" : "gray.900"}>
          <ModalBody>
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={3}>
                Forgot Password
              </Text>
              <Text mb={5}>
                Please click on "send confirmation code" to reset your password.
              </Text>
              <Input
                type="email"
                id="forgotPasswordEmail"
                readOnly
                                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button mt={3} onClick={handleForgotPassword}>
              Send Confirmation Code
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirm Code Modal */}
      <Modal isOpen={showConfirmCode} onClose={() => setShowConfirmCode(false)}>
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" backdropFilter="blur(8px)" />
        <ModalContent bg={colorMode === "light" ? "gray.100" : "gray.900"}>
          <ModalBody>
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={3}>
                Confirm Code
              </Text>
              <Text mb={5}>
                Please enter the confirmation code sent to your email.
              </Text>
              <Input
                type="text"
                id="confirmationCode"
                placeholder="Enter confirmation code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
              />
              <Button mt={3} onClick={handleConfirmCode}>
                Confirm Code
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Changing the Password Dialog */}

      <Modal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      >
        <ModalOverlay bg="rgba(0, 0, 0, 0.5)" backdropFilter="blur(8px)" />
        <ModalContent bg={colorMode === "light" ? "gray.100" : "gray.900"}>
          <ModalBody>
            <Box>
              <Text fontSize="xl" fontWeight="bold" mb={3}>
                Change Password
              </Text>
              <FormControl mb="5" isRequired>
                <FormLabel>New Password</FormLabel>
                <Input
                  type="password"
                  id="newPassword"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </FormControl>
              <FormControl mb="5" isRequired>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type="password"
                  id="newPasswordConfirmation"
                  placeholder="Confirm your new password"
                  value={newPasswordConfirmation}
                  onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                />
              </FormControl>
              <Button mt={3} onClick={handleChangePassword}>
                Change Password
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Login;
