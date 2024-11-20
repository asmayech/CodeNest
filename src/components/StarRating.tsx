import { Flex } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  totalStars: number;
  selectedStars: number;
  onStarClick: (value: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  totalStars,
  selectedStars,
  onStarClick,
}) => {
  const [hoveredStars, setHoveredStars] = useState(0);

  return (
    <Flex>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHoveredStars(starValue)}
            onMouseLeave={() => setHoveredStars(0)}
            onClick={() => onStarClick(starValue)}
          >
            <FaStar
              color={
                starValue <= (hoveredStars || selectedStars) ? "yellow" : "gray"
              }
            />
          </span>
        );
      })}
    </Flex>
  );
};

export default StarRating;
