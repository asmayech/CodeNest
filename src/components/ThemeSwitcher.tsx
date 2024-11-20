import { Button, useColorMode } from "@chakra-ui/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ThemeSwitcher = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button size={"sm"} onClick={toggleColorMode}>
      {colorMode === "light" ? <MdLightMode /> : <MdDarkMode />}
    </Button>
  );
};

export default ThemeSwitcher;
