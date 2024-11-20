import axios from "axios";
import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:4401/api";

interface User {
  userName: string;
  userId: string;
  isAdmin: boolean;
  verified: boolean;
}

interface UserStore {
  user: User | null;
  login: (loginData: LoginData) => Promise<void>;
  signUp: (signUpData: SignUpData) => Promise<void>;
  logout: () => void;
}

interface LoginData {
  email: string;
  password: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export const useUserStore = create<UserStore>((set) => ({
  user: getUserFromLocalStorage(),

  login: async (loginData: LoginData) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, loginData);
      if (response.status === 200) {
        const { token } = response.data;

        const decodedToken: any = jwtDecode(token);

        const user: User = {
          userName: decodedToken.name,
          userId: decodedToken.userId,
          isAdmin: decodedToken.isAdmin,
          verified: decodedToken.verified,
        };

        localStorage.setItem("token", token);
        set({ user });
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
    
  },
  signUp: async (signUpData: SignUpData) => {
    try {
      const response = await axios.post(`${BASE_URL}/users/signup`, signUpData);
      if (response.status === 201) {
        await useUserStore.getState().login({
          email: signUpData.email,
          password: signUpData.password,
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expiresIn");
    set({ user: null });
  },
}));

function getUserFromLocalStorage(): User | null {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken: any = jwtDecode(token);
    return {
      userName: decodedToken.name,
      userId: decodedToken.userId,
      isAdmin: decodedToken.isAdmin,
      verified: decodedToken.verified,
    };
  }
  return null;
}
