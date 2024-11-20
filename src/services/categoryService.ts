import axios from "axios";

const BASE_URL = "http://localhost:4401/api/categories";

// Function to get the list of categories
export const listCategories = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Function to add a new category
export const addCategory = async (category) => {
  try {
    const response = await axios.post(BASE_URL, category);
    return response.data;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
};

// Function to delete a category by ID
export const deleteCategory = async (categoryId) => {
  try {
    await axios.delete(`${BASE_URL}/${categoryId}`);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};
