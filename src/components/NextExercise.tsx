import { Box, Button, Flex, Text, Badge, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getExercisesByCategoryId } from "../services/exerciseService";
import { useNavigate } from "react-router-dom";
import { startExercise } from "../services/userExerciseService";
import { useUserStore } from "../stores/user";
import { IoClose } from "react-icons/io5";

const NextExerciseComponent: React.FC<{
  exerciseId: string;
  isOpen: boolean;
}> = ({ exerciseId, isOpen }) => {
  const [relatedExercises, setRelatedExercises] = useState([]);
  const [Open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUserStore();
  const toast = useToast();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const fetchRelatedExercises = async () => {
      try {
        const exercises = await getExercisesByCategoryId(exerciseId);
        setRelatedExercises(exercises);
      } catch (error) {
        console.error("Error fetching related exercises:", error);
      }
    };

    fetchRelatedExercises();
  }, [exerciseId]);

  const handleCloseModalAndNavigateToList = () => {
    setOpen(false);
    navigate(`/ListExercisePage`);
  };

  const handleStartExercise = async (exerciseId: string) => {
    if (user) {
      try {
        await startExercise(user.userId, exerciseId);
        window.location.href = `/ExercisePage/${exerciseId}`;
        toast({
          title: "Exercise Started",
          description: "You have successfully started the exercise.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setOpen(false);
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
      navigate(`/ListExercisePage`);
      toast({
        title: "Info",
        description: "You must be logged in to access the exercise.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  function handleclose(): void {
    setOpen(false);
    console.log("its closed eee!!");
  }

  return (
    <>
      {Open && (
        <Box
          bg="rgba(0, 0, 0, 0.7)"
          w="99vw"
          m="auto"
          position={"absolute"}
          bottom={0}
          rounded={5}
          display={"flex"}
          flexDirection={"column"}
          gap={5}
          py={3}
        >
          <Button
            position={"absolute"}
            top={4}
            right={4}
            size={"sm"}
            px={-3}
            fontSize={"2xl"}
            onClick={handleclose}
          >
            <IoClose />
          </Button>
          <Flex
            textAlign="center"
            color="white"
            display="flex"
            justifyContent="center"
            alignItems="end"
            gap={2}
          >
            <Text color="green.500" fontSize="2xl">
              🎉Congratulations!
            </Text>
            Discover more exercises in this category
          </Flex>
          <Box m={"auto"}>
            <Flex justify={"center"} align="center" w={"90%"} h={200}>
              <Carousel
                showThumbs={false}
                showArrows={true}
                showStatus={false}
                showIndicators={false}
                width={"750px"}
                centerMode
                centerSlidePercentage={35}
              >
                {relatedExercises.length === 0
                  ? [
                      <Text key="no-exercises" textAlign="center" color="white">
                        No exercises found in this category.
                      </Text>,
                    ]
                  : relatedExercises.map((exercise: any) => (
                      <Flex
                        key={exercise._id}
                        w="250px"
                        h="190px"
                        borderRadius="lg"
                        border={" solid 1px"}
                        borderColor={"gray.600"}
                        mr={3}
                        p={3}
                        flexDirection={"column"}
                        justifyContent={"space-between"}
                        bg={"gray.800"}
                      >
                        <Flex flexDirection={"column"}>
                          <Text
                            textAlign={"start"}
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textAlign: "start",
                            }}
                          >
                            {exercise.title}
                          </Text>
                          <Badge
                            colorScheme="purple"
                            maxW={"max-content"}
                            maxH={"20px"}
                            mb={2}
                          >
                            {exercise.category}
                          </Badge>
                          <Text
                            textAlign={"start"}
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textAlign: "start",
                            }}
                            color={"gray.400"}
                          >
                            {exercise.description}
                          </Text>
                        </Flex>
                        <Button
                          size={"sm"}
                          onClick={() => {
                            handleStartExercise(exercise._id);
                          }}
                        >
                          Start Exercise
                        </Button>
                      </Flex>
                    ))}
              </Carousel>
            </Flex>
            <Flex justifyContent="center" mt={3}>
              <Button
                colorScheme="purple"
                mr={3}
                onClick={() => {
                  handleCloseModalAndNavigateToList();
                }}
              >
                Explore more exercises
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
};

export default NextExerciseComponent;
