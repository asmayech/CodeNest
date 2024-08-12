import axios from "axios";

const BASE_URL = "http://localhost:4401/api/exercises";
const BASE_REVIEW_URL = "http://localhost:4401/api/reviews";

interface Exercise {
  createdBy: string;
  _id?: string;
  title: string;
  category: string;
  description: string;
  starterCode: string;
  expectedOutput: string;
  tasks: string;
  exampleCode: string;
  solution: string;
  difficulty: string;
}
interface Review {
  _id?: string;
  user: string;
  exercise: string;
  text: string;
  rating: number;
}

export const createExercise = async (exercise: Exercise): Promise<Exercise> => {
  try {
    const response = await axios.post(`${BASE_URL}`, exercise);
    return response.data.exercise;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};
export const getExerciseById = async (
  exerciseId: string
): Promise<Exercise> => {
  try {
    const response = await axios.get(`${BASE_URL}/${exerciseId}`);
    return response.data.exercise;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

export const listExercises = async (
  search?: string,
  category?: string,
  difficulty?: string
): Promise<Exercise[]> => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: { search, category, difficulty },
    });
    return response.data.exercises;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

export const editExercise = async (
  exerciseId: string,
  updatedExercise: Exercise
): Promise<Exercise> => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${exerciseId}`,
      updatedExercise
    );
    return response.data.exercise;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

export const deleteExercise = async (exerciseId: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/${exerciseId}`);
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

export const createReview = async (review: Review): Promise<Review> => {
  try {
    const response = await axios.post(`${BASE_REVIEW_URL}`, review);
    return response.data.review;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};
export const listReviews = async (
  exerciseId: string,
  sortBy: string
): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_REVIEW_URL}/${exerciseId}`, {
      params: { sortBy },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};
export const editReview = async (
  reviewId: string,
  updatedReview: any
): Promise<any> => {
  try {
    const response = await axios.put(
      `${BASE_REVIEW_URL}/${reviewId}`,
      updatedReview
    );
    return response.data.review;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_REVIEW_URL}/${reviewId}`);
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};
export const listExercisesByCreatorId = async (
  creatorId: string,
  search?: string
): Promise<Exercise[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/creator/${creatorId}`, {
      params: { search },
    });
    return response.data.exercises;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};

export const getExercisesByCategoryId = async (
  exerciseId: string
): Promise<any> => {
  try {
    const response = await axios.get(`${BASE_URL}/related/${exerciseId}`);
    return response.data.relatedExercises;
  } catch (error: any) {
    throw new Error(error.response.data.error);
  }
};
