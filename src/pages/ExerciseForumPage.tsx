import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Button,
  useToast,
  Spinner,
  Flex,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  Textarea,
} from "@chakra-ui/react";
import { MdVerified } from "react-icons/md";
import { useUserStore } from "../stores/user";
import { useParams } from "react-router-dom";
import {
  listReviews,
  createReview,
  deleteReview,
  editReview, // Import editReview
} from "../services/exerciseService"; // Import editReview
import StarRating from "../components/StarRating";
import { RiAdminFill } from "react-icons/ri";

const ExerciseForumPage = () => {
  const { id: exerciseId = "" } = useParams<{ id?: string }>();
  const [loading, setLoading] = useState(false);
  const [createBtnloading, setCreateBtnloading] = useState(false);
  const [comment, setComment] = useState("");
  const [editedComment, setEditedComment] = useState<any[]>([]);

  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const { user } = useUserStore();
  const toast = useToast();
  const [exercise, setExercise] = useState<any>({});
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalReviews: 0,
    averageRating: 0,
    totalComments: 0,
  });
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editLoadingStates, setEditLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const {
          exercise,
          reviews,
          totalReviews,
          averageRating,
          totalComments,
        } = await listReviews(exerciseId, sortBy);
        setExercise(exercise);
        setReviews(reviews);
        setStats({ totalReviews, averageRating, totalComments });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [exerciseId, sortBy, toast]);
  const handleAddComment = async () => {
    try {
      if (!comment.trim()) {
        throw new Error("Comment is required.");
      }
      setCreateBtnloading(true);
      if (!user) {
        throw new Error("User is not authenticated.");
      }
      await createReview({
        user: user.userId,
        exercise: exerciseId,
        text: comment,
        rating: rating,
      });
      toast({
        title: "Comment added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setComment("");
      const {
        exercise,
        reviews: updatedReviews,
        totalReviews,
        averageRating,
        totalComments,
      } = await listReviews(exerciseId, sortBy);
      setExercise(exercise);
      setReviews(updatedReviews);
      setStats({ totalReviews, averageRating, totalComments });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCreateBtnloading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      toast({
        title: "Review deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      const {
        exercise,
        reviews: updatedReviews,
        totalReviews,
        averageRating,
        totalComments,
      } = await listReviews(exerciseId, sortBy);
      setExercise(exercise);
      setReviews(updatedReviews);
      setStats({ totalReviews, averageRating, totalComments });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleEditComment = async (reviewId: any) => {
    try {
      setEditLoadingStates((prevLoadingStates) => ({
        ...prevLoadingStates,
        [reviewId]: true,
      }));
      await editReview(reviewId, { text: editedComment[reviewId] });
      toast({
        title: "Comment updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setEditCommentId(null);
      const updatedReviews = reviews.map((review) =>
        review._id === reviewId
          ? { ...review, text: editedComment[reviewId] }
          : review
      );
      setReviews(updatedReviews);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setEditLoadingStates((prevLoadingStates) => ({
        ...prevLoadingStates,
        [reviewId]: false,
      }));
    }
  };

  return (
    <Box w={"100%"} maxW={"1100px"} m={"auto"} p={4}>
      {loading ? (
        <Flex justifyContent={"center"} alignItems={"center"} mt={40}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Box mt={4}>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              {exercise.title}
            </Text>
            <Text>{exercise.description}</Text>
          </Box>
          <Box mt={4} p={3}>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Exercise Stats
            </Text>
            <Flex alignItems="start" gap={3}>
              <Stat borderWidth="1px" borderRadius="md" p={3}>
                <StatLabel>Total Reviews</StatLabel>
                <StatNumber>{stats.totalReviews}</StatNumber>
              </Stat>
              <Stat borderWidth="1px" borderRadius="md" p={3}>
                <StatLabel>Average Rating</StatLabel>
                <StatNumber>{stats.averageRating.toFixed(1)}</StatNumber>
              </Stat>
              <Stat borderWidth="1px" borderRadius="md" p={3}>
                <StatLabel>Total Comments</StatLabel>
                <StatNumber>{stats.totalComments}</StatNumber>
              </Stat>
            </Flex>
          </Box>
          <Flex justifyContent={"space-between"} alignItems={"center"} py={3}>
            <Text fontSize={"xl"}>Filter Section</Text>
            <Select
              size="md"
              mt={3}
              borderColor={"gray.700"}
              w={"20%"}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest Reviews</option>
              <option value="oldest">Oldest Reviews</option>
            </Select>
          </Flex>
          {user && (
            <Flex flexDirection={"column"} gap={1} mb={3}>
              <Text fontSize={"sm"}>
                Comment as {user ? user.userName : "Random"}
              </Text>
              <StarRating
                totalStars={5}
                selectedStars={rating}
                onStarClick={(newRating) => setRating(newRating)}
              />
              <Textarea
                placeholder="Write your comment here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />

              <Button
                size={"sm"}
                onClick={handleAddComment}
                disabled={!comment.trim()}
              >
                {createBtnloading ? <Spinner size="sm" /> : "Add Comment"}
              </Button>
            </Flex>
          )}
          {reviews.length === 0 ? (
            <Box textAlign="center" p={4}>
              <Text fontSize="lg">
                There are no reviews for this exercise yet.
              </Text>
            </Box>
          ) : (
            reviews.map((review) => (
              <Box
                p={3}
                borderWidth="1px"
                borderRadius="md"
                mb={2}
                key={review._id}
              >
                <Flex alignItems={"center"} gap={1}>
                  {review.user.isAdmin && <MdVerified color="pink" />}
                  {review.user.verified && !review.user.isAdmin && (
                    <MdVerified color="cyan" />
                  )}
                  <Text fontWeight="bold">{review.user.name}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {new Date(review.date).toLocaleDateString()}
                  </Text>
                </Flex>

                {editCommentId === review._id ? (
                  <Textarea
                    w={"100%"}
                    value={
                      editedComment[review._id] !== undefined
                        ? editedComment[review._id]
                        : review.text
                    }
                    onChange={(e) =>
                      setEditedComment((prevEditedComment) => ({
                        ...prevEditedComment,
                        [review._id]: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <Text ml={2}>{review.text}</Text>
                )}
                {user?.userId === review.user._id && (
                  <Flex
                    gap={2}
                    ml={2}
                    justifyContent={"end"}
                    alignItems={"center"}
                    mt={2}
                  >
                    {editCommentId === review._id ? (
                      <Button
                        size={"xs"}
                        colorScheme="blue"
                        variant={"outline"}
                        onClick={() => {
                          handleEditComment(review._id);
                          setEditCommentId(null);
                        }}
                        disabled={editLoadingStates[review._id]}
                      >
                        {editLoadingStates[review._id] ? (
                          <Spinner size="xs" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    ) : (
                      <Button
                        size={"xs"}
                        onClick={() => setEditCommentId(review._id)}
                        disabled={editCommentId !== null}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      size={"xs"}
                      colorScheme="red"
                      onClick={() => handleDeleteReview(review._id)}
                    >
                      Delete
                    </Button>
                  </Flex>
                )}
              </Box>
            ))
          )}
        </>
      )}
    </Box>
  );
};

export default ExerciseForumPage;
