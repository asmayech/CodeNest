import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Input,
  Button,
  useToast,
  InputGroup,
  InputRightElement,
  Spinner,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { listCategories, addCategory, deleteCategory } from "../services/categoryService"; // Import category service functions
import { FaTrash } from "react-icons/fa";

interface Category {
  _id: string;
  name: string;
}

const ListCategories: React.FC = () => {
  const [newCategory, setNewCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await listCategories();
        setCategories(response);
        setNoResults(response.length === 0);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching categories.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleAddCategory = async () => {
    if (!newCategory) return;

    try {
      setLoading(true);
      const category = await addCategory({ name: newCategory });
      setCategories([...categories, category]);
      toast({
        title: "Success",
        description: "Category added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewCategory("");
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the category.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string): Promise<void> => {
    try {
      setLoading(true);
      await deleteCategory(categoryId);
      setCategories(categories.filter((category) => category._id !== categoryId));
      toast({
        title: "Success",
        description: "Category deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the category.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box w={"100%"} maxW={"1300px"} m={"auto"} p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        List of Categories
      </Text>
      
      {/* Input to add a new category */}
      <InputGroup size="md" mt={3}>
        <Input
          borderColor={"gray.700"}
          placeholder="Enter new category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <InputRightElement w={"70px"}>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={handleAddCategory}
          >
            Add
          </Button>
        </InputRightElement>
      </InputGroup>

      {loading ? (
        <Flex justifyContent={"center"} alignItems={"center"} mt={40}>
          <Spinner size="xl" />
        </Flex>
      ) : noResults ? (
        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          mt={40}
          gap={6}
        >
          <Text fontSize="xl">No categories found</Text>
        </Flex>
      ) : (
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>Category Name</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {categories.map((category) => (
              <Tr key={category._id}>
                <Td>{category.name}</Td>
                <Td>
                  <Popover>
                    <PopoverTrigger>
                      <Button
                        size="sm"
                        colorScheme="red"
                        leftIcon={<FaTrash />}
                      >
                        Delete
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Confirm Delete</PopoverHeader>
                      <PopoverBody>
                        Are you sure you want to delete this category?
                        <Flex justify="flex-end" mt={2}>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDeleteCategory(category._id)}
                            mr={2}
                          >
                            Yes
                          </Button>
                          <Button size="sm">No</Button>
                        </Flex>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default ListCategories;
