import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Spinner,
  Flex,
  Badge,
  InputGroup,
  InputRightElement,
  Input,
  Select,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"; // Import useLocation
import { deleteExercise, listExercises } from "../services/exerciseService";
import { FaCentercode, FaTrashAlt } from "react-icons/fa";
import { useUserStore } from "../stores/user";
import { MdVerified } from "react-icons/md";
import { IoMdCode } from "react-icons/io";
import { startExercise } from "../services/userExerciseService";

function ListExercisePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exercises, setExercises] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [noResults, setNoResults] = useState<boolean>(false);
  const [deleteExerciseId, setDeleteExerciseId] = useState<string>("");
  const toast = useToast();
  const { user } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchValue = searchParams.get("search") || "";
    setSearchTerm(searchValue);
  }, [location.search]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const fetchedExercises = await listExercises(
        searchTerm,
        selectedCategory,
        selectedDifficulty
      );
      setExercises(fetchedExercises);
      setNoResults(fetchedExercises.length === 0);
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
    setIsLoading(false);
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      await deleteExercise(exerciseId);
      setExercises(exercises.filter((exercise) => exercise._id !== exerciseId));
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
  const { colorMode } = useColorMode();

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

  return (
    <Box px={6} w={"100%"} m={"20px auto"} maxW={"1000px"}>
      <Box mb={5}>
        <Text fontSize="2xl" fontWeight="bold">
          List of Exercises
        </Text>
        <Text>
          Find and add up to ten pairs in this view to display them at once.
        </Text>
        <Flex w={"100%"} gap={2}>
          <InputGroup size="md" mt={3}>
            <Input
              borderColor={"gray.700"}
              placeholder="Type to search for exercise"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputRightElement w={"70px"}>
              <Button
                size="xs"
                bg={"gray.700"}
                mr={1}
                color={"white"}
                px={2}
                onClick={handleSearch}
              >
                Search
              </Button>
            </InputRightElement>
          </InputGroup>
          <Select
            size="md"
            mt={3}
            borderColor={"gray.700"}
            w={"30%"}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="Data Analysis">Data Analysis</option>
            <option value="Array Manipulation">Array Manipulation</option>
            <option value="Math">Math</option>
            <option value="String Manipulation">String Manipulation</option>
            <option value="Looping">Looping</option>
          </Select>
          <Select
            size="md"
            mt={3}
            borderColor={"gray.700"}
            w={"30%"}
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="">Select difficulty</option>
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </Select>
        </Flex>
      </Box>
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
            <Flex gap={4} align="stretch" flexDirection={"column"}>
              {exercises.map((exercise) => (
                <Box
                  key={exercise._id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="md"
                  _hover={{ shadow: "lg" }}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Flex flexDirection={"column"}>
                    <Flex alignItems={"center"} gap={1}>
                      {exercise.createdBy.isAdmin && (
                        <MdVerified color="pink" />
                      )}
                      {exercise.createdBy.verified &&
                        !exercise.createdBy.isAdmin && (
                          <MdVerified color="cyan" />
                        )}
                      <RouterLink
                        to={`/Profile/${exercise.createdBy._id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Text
                          fontWeight="bold"
                          _hover={{ textDecoration: "underline" }}
                        >
                          {exercise.createdBy.name}
                        </Text>
                      </RouterLink>
                    </Flex>

                    <Flex alignItems={"center"} gap={2}>
                      <Heading as="h2" size="md" mb={2}>
                        {exercise.title}
                      </Heading>
                      <Badge
                        colorScheme={
                          renderDifficultyIcon(exercise.difficulty).color
                        }
                        maxW={"max-content"}
                        maxH={"20px"}
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                      >
                        {renderDifficultyIcon(exercise.difficulty).icon}

                        {exercise.difficulty}
                      </Badge>


                      <Badge
                        colorScheme={
                          "orange"
                        }
                        maxW={"max-content"}
                        maxH={"20px"}
                        display={"flex"}
                        alignItems={"center"}
                        gap={1}
                      >
                        {exercise.programming_language}
                      </Badge>


                    </Flex>
                    <Badge
                      colorScheme="purple"
                      maxW={"max-content"}
                      maxH={"20px"}
                      mb={2}
                    >
                      {exercise.category}
                    </Badge>
                    <Text
                      fontSize="sm"
                      mb={2}
                      color={colorMode === "light" ? "gray.900" : "gray.300"}
                    >
                      {exercise.description}
                    </Text>
                  </Flex>
                  <Flex
                    gap={2}
                    justifyContent={"space-between"}
                    alignItems={"end"}
                  >
                    <Flex gap={2} mt={2}>
                      <Button
                        colorScheme="blue"
                        as={RouterLink}
                        size="sm"
                        onClick={() => handleStartExercise(exercise._id)}
                      >
                        Start Exercise
                      </Button>
                      <Button
                        as={RouterLink}
                        to={`/ExerciseForumPage/${exercise._id}`}
                        size="sm"
                      >
                        Reviews
                      </Button>
                    </Flex>
                    {user && user.userId == exercise.createdBy._id && (
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
                            <PopoverHeader>Confirm Delete</PopoverHeader>
                            <PopoverBody>
                              <Flex justifyContent="flex-end" mt={4} gap={2}>
                                <Button
                                  size="sm"
                                  colorScheme="red"
                                  onClick={() =>
                                    handleDeleteExercise(exercise._id)
                                  }
                                >
                                  Yes
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={handleCloseDeleteConfirmation}
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
                </Box>
              ))}
            </Flex>
          )}
        </>
      )}
    </Box>
  );
}

export default ListExercisePage;
