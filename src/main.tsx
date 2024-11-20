import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ColorModeScript } from "@chakra-ui/react";
import theme from "./theme.ts";

const initialColorMode = theme.config.initialColorMode;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={initialColorMode} />
    <App />
  </React.StrictMode>
);
