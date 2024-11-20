const express = require("express");
const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
const { exec } = require("child_process"); // To run Python code
const fs = require("fs"); // To handle file operations
require("dotenv").config();

const normalizePort = (val) => {
  let port = parseInt(val, 10);
  if (isNaN(port)) {
    return val; // named pipe
  }
  if (port >= 0) {
    return port; // port number
  }
  return false;
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const addr = server.address(); // Fixed: 'addr' is now correctly initialized
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "4401");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
