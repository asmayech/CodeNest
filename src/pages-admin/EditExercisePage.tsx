import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { editExercise, getExerciseById } from "../services/exerciseService";

interface Exercise {
  _id: string;
  title: string;
  category: string;
  description: string;
  starterCode: string;
  expectedOutput: string;
  tasks: string;
  exampleCode: string;
  solution: string;
  difficulty: string;
  programming_language:string;
}

const EditExercisePage: React.FC = () => {
  const { id = "" } = useParams<{ id?: string }>();
  const [exerciseData, setExerciseData] = useState<any>({
    _id: "",
    title: "",
    category: "",
    description: "",
    starterCode: "",
    expectedOutput: "",
    tasks: "",
    exampleCode: "",
    solution: "",
    difficulty: "",
    programming_language:"",
  });
  const [errors, setErrors] = useState<Partial<Exercise>>({});
  const toast = useToast();

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const exercise = await getExerciseById(id);
        setExerciseData(exercise);
      } catch (error: any) {
        console.error("Error fetching exercise:", error.message);
      }
    };
    fetchExercise();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setExerciseData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Partial<Exercise> = {};
    Object.keys(exerciseData).forEach((key) => {
      if (!exerciseData[key as keyof Exercise]) {
        newErrors[key as keyof Exercise] = `${key} is required`;
      }
    });

    try {
      await editExercise(id, exerciseData);
      toast({
        title: "Exercise Updated",
        description: "The exercise has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setErrors({});
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} w={"100%"} maxW={"1000px"} m={"auto"}>
      <Text fontSize={"xl"} fontWeight={"bold"} mb={3}>
        Edit Exercise
      </Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired isInvalid={!!errors.title}>
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={exerciseData.title}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.category}>
            <FormLabel>Category</FormLabel>
            <Select
              name="category"
              value={exerciseData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Data Analysis">Data Analysis</option>
              <option value="Array Manipulation">Array Manipulation</option>
              <option value="Math">Math</option>
              <option value="String Manipulation">String Manipulation</option>
              <option value="Looping">Looping</option>
            </Select>
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.difficulty}>
          <FormLabel>Programming Language</FormLabel>
  <Select
    name="programming_language"
    value={exerciseData.programming_language}
    onChange={handleChange}
    style={{
      overflowY: 'auto',  // enables vertical scrolling
      maxHeight: '150px !important'  // adjust to fit 4 options at a time
    }}
  >
    <option value="">Select programming language</option>
    <option value="javascript">JavaScript</option>//verified
    <option value="python">Python</option>//verified
    <option value="java">Java</option>//verified
    <option value="c++">C++</option>//verified
    <option value="c">C</option>//verified
    <option value="ruby">Ruby</option>//verified
    <option value="php">PHP</option>//verified
    <option value="typescript">TypeScript</option>//verified
    <option value="rust">Rust</option>
  </Select>
</FormControl>

          <FormControl isRequired isInvalid={!!errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={exerciseData.description}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.starterCode}>
            <FormLabel>Starter Code</FormLabel>
            <Textarea
              name="starterCode"
              value={exerciseData.starterCode}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.expectedOutput}>
            <FormLabel>Expected Output</FormLabel>
            <Input
              name="expectedOutput"
              value={exerciseData.expectedOutput}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.tasks}>
            <FormLabel>Tasks</FormLabel>
            <Textarea
              name="tasks"
              value={exerciseData.tasks}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.exampleCode}>
            <FormLabel>Example Code</FormLabel>
            <Textarea
              name="exampleCode"
              value={exerciseData.exampleCode}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired isInvalid={!!errors.solution}>
            <FormLabel>Solution</FormLabel>
            <Textarea
              name="solution"
              value={exerciseData.solution}
              onChange={handleChange}
            />
          </FormControl>
          <Button type="submit" colorScheme="blue">
            Update
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default EditExercisePage;
