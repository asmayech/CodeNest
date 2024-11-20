import axios from "axios";

const BASE_URL = "http://localhost:4401/api/usersExercises";

export const startExercise = async (userId: string, exerciseId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/start`, {
      userId,
      exerciseId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data.error || error.message);
  }
};

export const completeExercise = async (userId: string, exerciseId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/complete`, {
      userId,
      exerciseId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data.error || error.message);
  }
};
export const getUserExercises = async (userId: string, completed?: boolean) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}`, {
      params: {
        completed: completed?.toString(),
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data.error || error.message);
  }
};
