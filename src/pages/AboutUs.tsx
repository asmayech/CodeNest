import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Icon,
  HStack,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
} from "@chakra-ui/react";
import { FaCode, FaHandsHelping, FaBookReader, FaUsers } from "react-icons/fa";

const AboutUs: React.FC = () => {
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box px={6} py={10} maxW="800px" mx="auto">
      <Heading as="h1" mb={6} color={textColor}>
        About Us
      </Heading>
      <VStack spacing={8} align="flex-start">
        <Text fontSize="xl" color={textColor}>
          Welcome to CodeNest - your go-to platform for coding exercises and
          learning resources!
        </Text>
        <Text color={textColor}>
          CodeNest is designed to help aspiring developers improve their coding
          skills through a variety of hands-on exercises and tutorials. Whether
          you're a beginner looking to learn the basics of programming or an
          experienced developer seeking to sharpen your skills, CodeNest has
          something for everyone.
        </Text>
        <Text color={textColor}>
          Our platform offers a wide range of exercises covering different
          programming languages, frameworks, and concepts. From simple coding
          challenges to advanced projects, you'll find plenty of opportunities
          to practice and enhance your coding abilities.
        </Text>
        <Text color={textColor}>
          In addition to exercises, CodeNest provides comprehensive tutorials,
          articles, and resources to support your learning journey. Our goal is
          to empower individuals with the knowledge and skills they need to
          succeed in the world of software development.
        </Text>
        <Text color={textColor}>
          We believe that learning to code should be fun, interactive, and
          accessible to all. That's why we've created CodeNest - a welcoming
          community where learners of all levels can come together to learn,
          grow, and inspire each other.
        </Text>
      </VStack>

      <Box mt={10}>
        <Divider my={6} />

        <Text color={textColor} fontSize="lg" fontWeight="bold" mb={2}>
          How do I get started on CodeNest?
        </Text>
        <Text color={textColor}>
          To get started on CodeNest, simply sign up for an account if you
          haven't already. Once you're logged in, you can explore the available
          exercises, tutorials, and resources. Choose a programming language or
          topic that interests you and begin your learning journey!
        </Text>
        <Text color={textColor} fontSize="lg" fontWeight="bold" mt={6} mb={2}>
          Is there a community forum on CodeNest?
        </Text>
        <Text color={textColor}>
          Yes, CodeNest has a vibrant community forum where users can ask
          questions, share insights, and engage in discussions with fellow
          developers. It's a great place to connect with others, seek help, and
          collaborate on projects.
        </Text>
        <Text color={textColor} fontSize="lg" fontWeight="bold" mt={6} mb={2}>
          Are there any restrictions on using CodeNest?
        </Text>
        <Text color={textColor}>
          CodeNest is open to anyone who wants to learn and improve their coding
          skills. However, we expect all users to adhere to our community
          guidelines and code of conduct. Any behavior that violates these
          guidelines may result in account suspension or termination.
        </Text>
      </Box>
      <Box mt={10}>
        <Divider my={6} />
        <Heading as="h2" mb={4} color={textColor}>
          FAQs
        </Heading>
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  How do I get started on CodeNest?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              To get started on CodeNest, simply sign up for an account if you
              haven't already. Once you're logged in, you can explore the
              available exercises, tutorials, and resources. Choose a
              programming language or topic that interests you and begin your
              learning journey!
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Is there a community forum on CodeNest?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Yes, CodeNest has a vibrant community forum where users can ask
              questions, share insights, and engage in discussions with fellow
              developers. It's a great place to connect with others, seek help,
              and collaborate on projects.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Are there any restrictions on using CodeNest?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              CodeNest is open to anyone who wants to learn and improve their
              coding skills. However, we expect all users to adhere to our
              community guidelines and code of conduct. Any behavior that
              violates these guidelines may result in account suspension or
              termination.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  What programming languages are supported on CodeNest?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Currently, CodeNest supports a wide range of programming languages
              including JavaScript, Python, Java, C++, and more. We are
              continuously expanding our language support to provide a diverse
              learning experience for our users.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Can I access CodeNest on mobile devices?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Yes, CodeNest is fully responsive and can be accessed on both
              desktop and mobile devices. You can practice coding exercises,
              read tutorials, and interact with the community on the go.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
      <Text mt={10} color={textColor}>
        Thank you for taking the time to learn more about CodeNest. We're
        thrilled to have you as part of our community! Feel free to explore the
        platform, engage with other members, and embark on your coding journey.
        Welcome to CodeNest!
      </Text>
      <HStack mt={10} spacing={8} justifyContent={"center"}>
        <Icon as={FaCode} boxSize={10} color={textColor} />
        <Icon as={FaHandsHelping} boxSize={10} color={textColor} />
        <Icon as={FaBookReader} boxSize={10} color={textColor} />
        <Icon as={FaUsers} boxSize={10} color={textColor} />
      </HStack>
    </Box>
  );
};

export default AboutUs;
