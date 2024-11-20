import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

import {
  Badge,
  Box,
  Button,
  Flex,
  Text,
  useToast,
  Tooltip,
  Spinner,
  useColorMode,
} from "@chakra-ui/react";
import { FaHandPointRight, FaRegLightbulb } from "react-icons/fa6";
import { FaSadTear } from "react-icons/fa";
import { getExerciseById } from "../services/exerciseService";
import { useUserStore } from "../stores/user";
import { completeExercise } from "../services/userExerciseService";
import NextExerciseComponent from "../components/NextExercise";

const ExercisePage = () => {
  const { id = "" } = useParams<{ id?: string }>();
  const { user } = useUserStore();

  const [exercise, setExercise] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const initialCode = exercise ? exercise.starterCode : "";
  const [code, setCode] = useState(initialCode);

  const [result, setResult] = useState("there is no result yet !");
  const [isOutputChecked, setIsOutputChecked] = useState(false);
  const [isCodeCompiled, setIsCodeCompiled] = useState(false);
  const [IsOpen, setIsOpen] = useState(false);
  const [triesLeft, setTriesLeft] = useState(5);
  const [showSolutionBtn, setShowSolutionBtn] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const exerciseData = await getExerciseById(id);
        setExercise(exerciseData);
        setCode(initialCode);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching exercise:", error);
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  const compileCode = async () => {
    setIsCodeCompiled(true);

    if (!code.trim()) {
        setResult("Error: Code is empty!");
        return;
    }

    try {
        setResult("");

        let apiUrl;
        const language = exercise.programming_language.toLowerCase(); // Convert to lowercase

        switch (language) {
            case 'python':
                apiUrl = 'http://localhost:4401/api/run-python';//checked
                break;
            case 'c':
              apiUrl = 'http://localhost:4401/api/run-c';//checked
              break;    
            case 'javascript':
                apiUrl = 'http://localhost:4401/api/run-javascript';//checked
                break;
            case 'java':
                apiUrl = 'http://localhost:4401/api/run-java';//checked
                break;
            case 'c++':
                apiUrl = 'http://localhost:4401/api/run-cpp';
                break;
            case 'c#':
                apiUrl = 'http://localhost:4401/api/run-csharp';
                break;
            case 'ruby':
                apiUrl = 'http://localhost:4401/api/run-ruby';
                break;
            case 'php':
                apiUrl = 'http://localhost:4401/api/run-php';
                break;
            case 'typescript':
                apiUrl = 'http://localhost:4401/api/run-typescript';
                break;
            case 'rust':
                apiUrl = 'http://localhost:4401/api/run-rust';
                break;
            default:
                setResult("Error: Unsupported programming language!");
                return;
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        });

        const data = await response.json();
        if (response.ok) {
            setResult(data.output);
        } else {
            setResult(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error("Error calling the backend:", error);
        setResult("Error: Unable to execute code.");
    }
};


  const checkOutput = () => {
    if (result === exercise?.expectedOutput) {
      SaveUserProgress();
      setIsOpen(true);
    } else {
      toast({
        title: "Error!",
        description: "Your output does not match the expected output.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
    if (triesLeft != 0) {
      setTriesLeft(triesLeft - 1);
    }
    setIsOutputChecked(true);
  };

  const SaveUserProgress = async () => {
    if (user) {
      try {
        await completeExercise(user.userId, id);
        toast({
          title: "Exercise Completed",
          description:
            "Congratulations! You have successfully completed the exercise.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      } catch (error) {
        console.error("Error completing exercise:", error);
        toast({
          title: "Error",
          description: "An error occurred while completing the exercise.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };



  if (isLoading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} mt={40}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!exercise) {
    return (
      <Flex
        h={500}
        justifyContent={"center"}
        alignItems={"center"}
        flexDirection="column"
      >
        <FaSadTear style={{ fontSize: "4rem", marginBottom: "1rem" }} />
        <Text fontSize="xl" fontWeight="bold" mb={2}>
          Error: Exercise not found
        </Text>
      </Flex>
    );
  }
  const showSolution = () => {
    setShowSolutionBtn(true);
  };
  const { colorMode } = useColorMode();

  return (
    <Flex w={"100%"} m={"5px auto"} p={2} h={"calc(100vh - 125px)"} gap={2}>
      <Box
        w={"25%"}
        p={5}
        border={"solid"}
        borderColor={colorMode === "light" ? "gray.300" : "gray.700"}
        rounded={10}
      >
        <Badge colorScheme="orange">{exercise.programming_language}</Badge>
        <Text fontSize={"xl"} fontWeight={"bold"} mb={2}>
          Exercise
        </Text>
        <Badge colorScheme="purple">{exercise.category}</Badge>
        <Text fontSize={"xl"}>{exercise.title}</Text>
        <Text mb={3} color={"gray.400"}>  
          {exercise.description}
        </Text>
        <Box my={5}>
          <Badge variant="outline" colorScheme="blue" mb={1} p={"2px 7px"}>
            Question
          </Badge>
          <Text
            mb={2}
            fontSize={"xl"}
            display={"flex"}
            alignItems={"center"}
            gap={2}
          >
            <FaHandPointRight size={"15px"} />
            {exercise.tasks}
          </Text>
        </Box>
        <Box mb={5}>
          <Badge variant="outline" colorScheme="red" mb={1} p={"2px 7px"}>
            Expected Output
          </Badge>
          <Text mb={2}>{exercise.expectedOutput}</Text>
        </Box>
        {showSolutionBtn && (
          <Box>
            <Badge variant="outline" colorScheme="green" mb={1} p={"2px 7px"}>
              Solution
            </Badge>
            <Text mb={2}>{exercise.solution}</Text>
          </Box>
        )}
      </Box>
      <Box w={"50%"} position={"relative"} h={"100%"} bg={"#011627"}>
        <LiveProvider code={code}>
          <Box height="calc(100% - 40px)" overflow="auto">
            <Box
              border={"solid 1px"}
              borderColor={"cyan.900"}
              mx={2}
              rounded={5}
              overflow={"hidden"}
            >
              <LiveEditor onChange={(newCode) => { 
                //console.log(newCode); // Debug the code change
                setCode(newCode);
              }} />

            </Box>
          </Box>
          <Box m={2}>
            <LiveError />
          </Box>
          <LivePreview />
        </LiveProvider>
        <Button
          position={"absolute"}
          top={2}
          right={2}
          colorScheme="blue"
          size={"sm"}
          onClick={compileCode}
          zIndex={10}
        >
          Run Code
        </Button>
      </Box>

      <Box
        w={"25%"}
        p={5}
        border={"solid"}
        borderColor={colorMode === "light" ? "gray.300" : "gray.700"}
        rounded={10}
        position={"relative"}
      >
        <Text fontSize={"xl"} fontWeight={"bold"} mb={2}>
          Output
        </Text>
        {isCodeCompiled && (
          <Button
            position={"absolute"}
            top={2}
            right={2}
            colorScheme="purple"
            size={"sm"}
            onClick={() => {
              compileCode();
              checkOutput();
            }}
            zIndex={10}
          >
            Validate {triesLeft}/5
            
          </Button>
        )}
        {triesLeft === 0 && (
          <Tooltip label="Show solution" placement="bottom">
            <Button
              position={"absolute"}
              top={2}
              right={"115px"}
              colorScheme="green"
              size={"sm"}
              onClick={showSolution}
              zIndex={1000}
            >
              <FaRegLightbulb />
            </Button>
          </Tooltip>
        )}
        {result}
      </Box>
      <NextExerciseComponent exerciseId={id} isOpen={IsOpen} />
    </Flex>
  );
};

export default ExercisePage;
