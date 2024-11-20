import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Icon,
  Input,
  Textarea,
  Button,
  useColorModeValue,
  Link,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";

const ContactUs: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();
  const BASE_URL = "http://localhost:4401/api/contact/send-email";

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (email && subject && content) {
        const response = await axios.post(BASE_URL, {
          topic: subject,
          gmail: email,
          content: content,
        });
        if (response.status === 200) {
          setSubmitted(true);
          toast({
            title: "Message Submitted",
            description: "Your message has been successfully submitted.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error("Failed to send email");
        }
      } else {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error submitting message:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting your message.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box px={6} py={10} maxW="800px" mx="auto">
      <Heading as="h1" mb={6} color={textColor}>
        Contact Us
      </Heading>
      <VStack spacing={6} align="flex-start">
        <Flex>
          <Icon as={FaEnvelope} boxSize={5} color={textColor} />
          <Text ml={3} color={textColor}>
            Email:{" "}
            <Link href="mailto:info@codenest.com" color="blue.500">
              ***@***.***
            </Link>
          </Text>
        </Flex>
        <Flex>
          <Icon as={FaPhone} boxSize={5} color={textColor} />
          <Text ml={3} color={textColor}>
            Phone:{" "}
            <Link href="tel:+** *** ***" color="blue.500">
              +216 ** *** ***
            </Link>
          </Text>
        </Flex>
        <Flex>
          <Icon as={FaMapMarkerAlt} boxSize={5} color={textColor} />
          <Text ml={3} color={textColor}>
            Address: *** Tousie Ben Arous, Mourouj
          </Text>
        </Flex>
        <Text color={textColor}>
          Have a question or feedback? Feel free to reach out to us using the
          contact information provided above. We'd love to hear from you!
        </Text>
        <Text color={textColor} fontWeight="bold">
          Contact the Admin:
        </Text>
        <Input
          placeholder="Your Email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <Input
          placeholder="Subject"
          value={subject}
          onChange={handleSubjectChange}
          required
        />
        <Textarea
          placeholder="Your Message"
          value={content}
          onChange={handleContentChange}
          size="sm"
          required
        />
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          disabled={!email || !subject || !content}
        >
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default ContactUs;
