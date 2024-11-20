import axios from "axios";

const BASE_URL = "http://localhost:4401/api/users";

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  verified: boolean;
  isAdmin: boolean;
}

export const getUserById = async (userId: string): Promise<any> => {
  const response = await axios.get(`${BASE_URL}/${userId}`);
  return response.data;
};

export const updateUser = async (
  userId: string,
  userData: Partial<User>
): Promise<void> => {
  await axios.put(`${BASE_URL}/updateInfo/${userId}`, userData);
}; 
export const listUsers = async (search?: string): Promise<User[]> => {
  const response = await axios.get(BASE_URL, {
    params: { search },
  });
  return response.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  console.log(userId);
  await axios.delete(`${BASE_URL}/${userId}`);
};
