import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  Input,
  Textarea,
  useToast,
  Flex,
  Image,
  Tag,
  TagLabel,
  ModalContent,
  ModalOverlay,
  Modal,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  Wrap,
  InputGroup,
  InputRightElement,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../services/userService";
import {
  deleteExercise,
  listExercisesByCreatorId,
} from "../services/exerciseService"; // Import the service function
import defaultPic from "../assets/default-profile.jpg";
import { FaCentercode, FaTrashAlt } from "react-icons/fa";
import { useUserStore } from "../stores/user";
import { IoMdCode } from "react-icons/io";
import { BiRocket } from "react-icons/bi";
import { sendConfirmationEmail, confirmEmail } from "./../services/EmailService";

import {
  getUserExercises,
  startExercise,
} from "../services/userExerciseService";
interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  verified: boolean;
}

const Profile: React.FC = () => {
  const { id: userId = "" } = useParams<{ id?: string }>();
  const { user, logout } = useUserStore();
  const [gettedUser, setgettedUser] = useState<User | null>(null);
  const [updatedUserInfo, setUpdatedUserInfo] = useState<User>({
    _id: "",
    name: "",
    email: "",
    phoneNumber: "",
    location: "",
    bio: "",
    verified: false,
  });
  const [userExercises, setUserExercises] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [Verfied, setVerfied] = useState<boolean>(false);
  const [deleteExerciseId, setDeleteExerciseId] = useState<string>("");
  const [exercises, setExercises] = useState<any[]>([]);
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>();
  const navigate = useNavigate();
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSending, setIsCodeSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const toast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId);
        setgettedUser(userData);
        setUpdatedUserInfo(userData);
        setVerfied(userData.verified);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        const fetchedExercises = await listExercisesByCreatorId(userId);
        setUserExercises(fetchedExercises);
        setIsLoading(false);
        setNoResults(fetchedExercises.length === 0);
      } catch (error) {
        console.error("Error fetching user's exercises:", error);
        setIsLoading(false);
      }
    };
    fetchExercises();
  }, [userId]);
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const fetchedExercises = await getUserExercises(
          userId,
          completedFilter
        );
        console.log(fetchedExercises);
        setExercises(fetchedExercises);
      } catch (error) {
        console.error("Error fetching exercises:", error);
      }
    };
    fetchExercises();
  }, [userId, completedFilter]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleUpdateInfo = async () => {
    try {
      await updateUser(userId, updatedUserInfo);
      logout();
      toast({
        title: "Profile Updated",
        description:
          "Your profile has been successfully updated. You must Login again to start Creating Exercises",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      const updatedData = await getUserById(userId);
      setgettedUser(updatedData);
      setUpdatedUserInfo(updatedData);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating your profile.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (!gettedUser) {
    return (
      <Flex
        justifyContent={"center"}
        alignItems={"center"}
        mt={40}
        gap={5}
        flexDirection={"column"}
      >
        <Spinner size={"xl"} />
        <Text>Loading...</Text>
      </Flex>
    );
  }

  const filteredExercises = userExercises.filter((exercise) =>
    exercise.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const { colorMode } = useColorMode();
  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      await deleteExercise(exerciseId);
      setUserExercises(
        userExercises.filter((exercise) => exercise._id !== exerciseId)
      );

      toast({
        title: "Exercise Deleted",
        description: "Exercise has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteExerciseId("");
  };
  const renderDifficultyIcon = (difficulty: string) => {
    let color = "";
    switch (difficulty) {
      case "easy":
        color = "green";
        break;
      case "normal":
        color = "cyan";
        break;
      case "hard":
        color = "red";
        break;
      default:
        break;
    }
    return {
      icon: <IoMdCode />,
      color: color,
    };
  };
  const handleStartExercise = async (exerciseId: string) => {
    if (user) {
      try {
        await startExercise(user.userId, exerciseId);
        navigate(`/ExercisePage/${exerciseId}`);
        toast({
          title: "Exercise Started",
          description: "You have successfully started the exercise.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while starting the exercise.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      // window.location.href = `/ExercisePage/${exerciseId}`;
      toast({
        title: "Info",
        description: "You must be logged in to access the exercise.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };
   // Verification code actions
   const handleSendVerificationCode = async () => {
    setIsCodeSending(true);
    
    try {
      await sendConfirmationEmail(gettedUser.email);
      toast({
        title: "Code Sent",
        description: "A verification code has been sent to your email.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCodeSending(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    try {
      await confirmEmail(gettedUser.email, verificationCode);
      setIsVerified(true);
      toast({
        title: "Verified",
        description: "Your account has been successfully verified.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      updatedUserInfo.verified =true;
      setVerificationModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Verification failed. Please check your code.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <Box w={"100%"} maxW={"950px"} m={"20px auto"} justifyContent={"center"}>
      <Box gap={1} p={3}>
        <Flex flexDirection={"column"} gap={1} alignItems={"center"}>
          <Box position="relative">
            <Image src={defaultPic} w={16} h={16} rounded={"50%"} />
          </Box>
          <Text fontSize={"xl"}>{gettedUser.name}</Text>
          <Flex alignItems={"center"} gap={1}>
            {gettedUser.verified && (
              <Tag size="sm" colorScheme="orange" borderRadius="full" h={5}>
                <TagLabel>Verified</TagLabel>
              </Tag>
            )}
            {userExercises.length > 2 && (
              <Tag size="sm" colorScheme="purple" borderRadius="full" h={5}>
                <TagLabel>Pro </TagLabel>
              </Tag>
            )}
            {exercises.length > 1 && (
              <Tag size="sm" colorScheme="blue" borderRadius="full" h={5}>
                <TagLabel>Master </TagLabel>
              </Tag>
            )}
            {exercises.length > 5 && (
              <Tag size="sm" colorScheme="green" borderRadius="full" h={5}>
                <TagLabel>Champion</TagLabel>
              </Tag>
            )}
          </Flex>
          {gettedUser.bio && (
            <Text
              color={colorMode === "light" ? "gray.600" : "gray.400"}
              fontSize={"lg"}
              maxW={300}
              textAlign={"center"}
            >
              {gettedUser.bio}
            </Text>
          )}
        </Flex>
        <Flex
          w={300}
          m={"auto"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          bg={colorMode === "light" ? "gray.200" : "gray.700"}
          p={1}
          mt={2}
          rounded={10}
        >
          {gettedUser.email && (
            <Text
              fontSize={"lg"}
              color={colorMode === "light" ? "gray.700" : "gray.300"}
            >
              {gettedUser.email}
            </Text>
          )}
          {gettedUser.phoneNumber && (
            <Text
              fontSize={"lg"}
              color={colorMode === "light" ? "gray.700" : "gray.300"}
            >
              {gettedUser.phoneNumber}
            </Text>
          )}
          {gettedUser.location && (
            <Text color={colorMode === "light" ? "gray.700" : "gray.400"}>
              {gettedUser.location}
            </Text>
          )}
        </Flex>
        {user != null && user.userId === userId && (
          <Flex
            gap={3}
            alignItems={"center"}
            w={300}
            m={"20px auto"}
            justifyContent={"center"}
          >
            <Button onClick={onOpen} size={"sm"} colorScheme="orange">
              Edit
            </Button>
            {
          gettedUser?.verified 
    ? null
    : (
      <Button onClick={() => setVerificationModalOpen(true)} size="sm" colorScheme="orange">
        Verify
      </Button>
    )
}

          </Flex>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mt={"100px"}>
          <ModalHeader> Edit Profil</ModalHeader>
          <ModalCloseButton />
          <Box p={5}>
            <Box mb={4}>
              <Input
                type="text"
                name="name"
                placeholder="User name"
                value={updatedUserInfo.name}
                onChange={handleChange}
              />
            </Box>
            <Box mb={4}>
              <Input
                type="email"
                name="email"
                placeholder="User email"
                value={updatedUserInfo.email}
                onChange={handleChange}
              />
            </Box>
            <Box mb={4}>
              <Input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={updatedUserInfo.phoneNumber}
                onChange={handleChange}
              />
            </Box>
            <Box mb={4}>
              <Input
                type="text"
                name="location"
                placeholder="Location"
                value={updatedUserInfo.location}
                onChange={handleChange}
              />
            </Box>
            <Box mb={4}>
              <Textarea
                name="bio"
                placeholder="Bio"
                value={updatedUserInfo.bio}
                onChange={handleChange}
              />
            </Box>
            <Button onClick={handleUpdateInfo}>Update Profile</Button>
          </Box>
        </ModalContent>
      </Modal>
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Created Exercises</Tab>
          <Tab>Exercise Progress</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {Verfied ? (
              <Box>
                <InputGroup size="md" mt={3}>
                  <Input
                    placeholder="Search section"
                    value={searchQuery}
                    onChange={handleSearch}
                  />
                  <InputRightElement w={"70px"}>
                    <Button
                      size="xs"
                      color={colorMode === "light" ? "black" : "white"}
                      px={2}
                    >
                      Search
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {isLoading ? (
                  <Flex justifyContent={"center"} alignItems={"center"} mt={40}>
                    <Spinner size="xl" />
                  </Flex>
                ) : (
                  <>
                    {noResults ? (
                      <Flex
                        justifyContent={"center"}
                        alignItems={"center"}
                        flexDirection={"column"}
                        mt={40}
                        gap={6}
                      >
                        <FaCentercode size={40} color="gray.500" />
                        <Text fontSize="xl">No exercises found</Text>
                      </Flex>
                    ) : (
                      <Wrap flexDirection={"column"} mt={3}>
                        {filteredExercises.map((exercise) => (
                          <Flex
                            key={exercise._id}
                            border={"solid 1px"}
                            borderColor={"gray.600"}
                            rounded={10}
                            w={300}
                            minH={190}
                            p={3}
                            flexDirection={"column"}
                            justifyContent={"space-between"}
                            gap={2}
                          >
                            <Box>
                              <Text fontSize={"lg"} fontWeight={"bold"}>
                                {exercise.title}
                              </Text>
                              <Badge
                                colorScheme={
                                  renderDifficultyIcon(exercise.difficulty)
                                    .color
                                }
                                maxW={"max-content"}
                                maxH={"20px"}
                                display={"flex"}
                                alignItems={"center"}
                                gap={1}
                                my={1}
                              >
                                {renderDifficultyIcon(exercise.difficulty).icon}

                                {exercise.difficulty}
                              </Badge>
                              <Text
                                color={
                                  colorMode === "light"
                                    ? "gray.600"
                                    : "gray.300"
                                }
                              >
                                {exercise.description}
                              </Text>
                            </Box>
                            <Flex
                              justifyContent={"space-between"}
                              alignItems={"end"}
                            >
                              <Button
                                size={"sm"}
                                onClick={() =>
                                  handleStartExercise(exercise._id)
                                }
                              >
                                Open Exercise
                              </Button>

                              {user &&
                                user.userId == exercise.createdBy._id && (
                                  <Flex gap={2}>
                                    <Button
                                      size="xs"
                                      as={RouterLink}
                                      to={`/EditExercisePage/${exercise._id}`}
                                    >
                                      Edit
                                    </Button>

                                    <Popover>
                                      <PopoverTrigger>
                                        <Button colorScheme="red" size="xs">
                                          <FaTrashAlt />
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent w={160}>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader>
                                          Confirm Delete
                                        </PopoverHeader>
                                        <PopoverBody>
                                          <Flex
                                            justifyContent="flex-end"
                                            mt={4}
                                            gap={2}
                                          >
                                            <Button
                                              size="sm"
                                              colorScheme="red"
                                              onClick={() =>
                                                handleDeleteExercise(
                                                  exercise._id
                                                )
                                              }
                                            >
                                              Yes
                                            </Button>
                                            <Button
                                              size="sm"
                                              onClick={
                                                handleCloseDeleteConfirmation
                                              }
                                            >
                                              No
                                            </Button>
                                          </Flex>
                                        </PopoverBody>
                                      </PopoverContent>
                                    </Popover>
                                  </Flex>
                                )}
                            </Flex>
                          </Flex>
                        ))}
                      </Wrap>
                    )}
                  </>
                )}
              </Box>
            ) : user != null && user.userId === userId ? (
              <Flex
                border={"solid 1px"}
                borderColor={"gray.600"}
                h={"140px"}
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"column"}
                rounded={10}
                p={4}
              >
                <Text fontSize="xl" fontWeight={"bold"}>
                  You are not a verified user.
                </Text>
                <Button onClick={onOpen} colorScheme="cyan" size={"md"} mt={3}>
                  Complete Profile
                </Button>
              </Flex>
            ) : (
              <Flex justifyContent={"center"} mt={20}>
                <Text fontSize={"xl"}>This User doesn't have Exercises</Text>
              </Flex>
            )}
          </TabPanel>
          <TabPanel>
            <Flex alignItems={"center"} justifyContent={"space-between"} mb={4}>
              <Text fontSize={"lg"} fontWeight={"bold"}>
                Exercises Progress
              </Text>
              <Select
                w={"30%"}
                value={
                  completedFilter === undefined
                    ? "all"
                    : completedFilter.toString()
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "all") {
                    setCompletedFilter(undefined);
                  } else {
                    setCompletedFilter(value === "true");
                  }
                }}
              >
                <option value="all">All Exercises</option>
                <option value="true">Completed</option>
                <option value="false">Not Completed</option>
              </Select>
            </Flex>
            {exercises.length === 0 ? (
              <Flex
                justifyContent={"center"}
                flexDirection={"column"}
                mt={10}
                alignItems={"center"}
                fontSize={"4xl"}
                gap={2}
              >
                <FaCentercode />
                <Text fontSize={"xl"}>No exercises found</Text>
              </Flex>
            ) : (
              <Wrap>
                {exercises.map((exerciser: any) => (
                  <Flex
                    key={exerciser._id}
                    border={"solid 1px"}
                    borderColor={"gray.600"}
                    p={3}
                    rounded={7}
                    w={250}
                    h={120}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    gap={1}
                  >
                    {exerciser.completedAt ? (
                      <Badge w={"max-content"} colorScheme="green">
                        Completed
                      </Badge>
                    ) : (
                      <Badge w={"max-content"} colorScheme="blue">
                        In Progress
                      </Badge>
                    )}
                    <Text fontWeight={"bold"}>
                      {exerciser &&
                        exerciser.exercise &&
                        exerciser.exercise.title &&
                        exerciser.exercise.title}
                    </Text>
                    <Button
                      size={"sm"}
                      onClick={() =>
                        handleStartExercise(exerciser.exercise._id)
                      }
                    >
                      Open Exercise
                    </Button>
                  </Flex>
                ))}
              </Wrap>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal isOpen={verificationModalOpen} onClose={() => setVerificationModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verify Your Account</ModalHeader>
          <ModalCloseButton />
          <Box p={5}>
            <Button
              onClick={handleSendVerificationCode}
              isLoading={isCodeSending}
              colorScheme="blue"
              mb={4}
            >
              Send Code to Email
            </Button>
            <Input
              placeholder="Enter Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              mb={4}
            />
            <Button
              onClick={handleVerifyCode}
              isLoading={isVerifying}
              colorScheme="green"
            >
              Verify
            </Button>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Profile;
