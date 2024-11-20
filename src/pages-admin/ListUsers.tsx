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
import { listUsers, deleteUser } from "../services/userService";
import { FaCentercode, FaTrash } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  verified: boolean;
  isAdmin: boolean;
}

const ListUsers: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [noResults, setNoResults] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await listUsers(search);
        setUsers(response);
        setNoResults(response.length === 0);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching users.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [search, toast]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await listUsers(search);
      setUsers(response);
      setNoResults(response.length === 0);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "An error occurred while fetching users.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    try {
      setLoading(true);
      await deleteUser(userId);
      setUsers(users.filter((user) => user._id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the user.",
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
        List of Users
      </Text>
      <InputGroup size="md" mt={3}>
        <Input
          borderColor={"gray.700"}
          placeholder="Type to search for users"
          value={search}
          onChange={handleSearchChange}
        />
        <InputRightElement w={"70px"}>
          <Button
            size="xs"
            bg={"gray.700"}
            mr={1}
            color={"white"}
            px={2}
            onClick={() => setSearch("")}
          >
            Clear
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
          <FaCentercode size={40} color="gray.500" />
          <Text fontSize="xl">No User found</Text>
        </Flex>
      ) : (
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone Number</Th>
              <Th>Location</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user._id}>
                <Td>
                  <Flex alignItems={"center"} gap={1}>
                    {user.verified && <MdVerified color="cyan" />}
                    {user.isAdmin && <RiAdminFill color="pink" />}
                    {user.name}
                  </Flex>
                </Td>
                <Td>{user.email}</Td>
                <Td>{user.phoneNumber || "-"}</Td>
                <Td>{user.location || "-"}</Td>
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
                        Are you sure you want to delete this user?
                        <Flex justify="flex-end" mt={2}>
                          <Button
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDeleteUser(user._id)}
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

export default ListUsers;
