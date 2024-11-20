const path = require("path");
const express = require("express");
require("dotenv").config();
const os = require("os"); // Import os for temporary directory
const fs = require("fs");
const { exec } = require("child_process");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const exerciseRoutes = require("./routes/exercise");
const reviewRoutes = require("./routes/review");
const userExerciseRoutes = require("./routes/userExercise");
const contactRoutes = require("./routes/contact");
const confirmRoutes = require("./routes/confirmation");
const categoriesRoutes = require("./routes/categories");

const cors = require("cors");
const app = express();
app.use(cors());

mongoose.set("strictQuery", false);
//conection to data
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/file-folder", express.static(path.join("file-folder")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-requested-With, Content-Type, Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );

  next();
});

app.use("/api/users", userRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/usersExercises", userExerciseRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/confirm", confirmRoutes);
app.use("/api/categories", categoriesRoutes);

app.post("/api/run-python", (req, res) => {
  const { code } = req.body;
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, "code.py");

  // Write Python code to a file
  fs.writeFile(filePath, code, (fileErr) => {
    if (fileErr) {
      return res
        .status(500)
        .json({ error: "Failed to write Python code to file" });
    }

    // Execute the Python code using python3
    exec(`python3 ${filePath}`, (execErr, stdout, stderr) => {
      // Clean up the file after execution
      fs.unlinkSync(filePath);

      if (execErr) {
        return res.status(500).json({ error: stderr || execErr.message });
      }

      // Send the output back to the client
      res.json({ output: stdout });
    });
  });
});

app.post("/api/run-java", (req, res) => {
  const { code } = req.body;
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, "TempCode.java");

  // Write Java code to a file
  fs.writeFile(filePath, code, (fileErr) => {
    if (fileErr) {
      return res
        .status(500)
        .json({ error: "Failed to write Java code to file" });
    }

    // Compile the Java code using javac
    exec(`java ${filePath}`, (compileErr, stdout, stderr) => {
      if (compileErr) {
        return res.status(500).json({ error: stderr || compileErr.message });
      }

      // // Run the compiled Java code using java
      // exec(`java -cp ${tempDir} TempCode`, (runErr, runStdout, runStderr) => {
      //   // Clean up the class files after execution
      //   fs.unlinkSync(filePath);
      //   fs.unlinkSync(path.join(tempDir, "TempCode.class"));

      //   if (runErr) {
      //     return res.status(500).json({ error: runStderr || runErr.message });
      //   }

      // Send the output back to the client
      res.json({ output: stdout });
    });
  });
});

app.post("/api/run-cpp", (req, res) => {
  const { code } = req.body;
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, "code.cpp");
  const outputPath = path.join(tempDir, "code"); // Path for the compiled executable

  // Write C++ code to a file
  fs.writeFile(filePath, code, (fileErr) => {
    if (fileErr) {
      return res
        .status(500)
        .json({ error: "Failed to write C++ code to file" });
    }

    // Compile the C++ code
    exec(`g++ ${filePath} -o ${outputPath}`, (compileErr, stdout, stderr) => {
      if (compileErr) {
        // Clean up the source file even if the compile fails
        fs.unlinkSync(filePath);
        return res.status(500).json({ error: stderr || compileErr.message });
      }

      // Run the compiled code if compilation was successful
      exec(`${outputPath}`, (runErr, runStdout, runStderr) => {
        // Clean up files after execution, checking if they exist first
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
        } catch (cleanupErr) {
          console.error("Error cleaning up files:", cleanupErr);
        }

        if (runErr) {
          return res.status(500).json({ error: runStderr || runErr.message });
        }

        // Send the output back to the client
        res.json({ output: runStdout });
      });
    });
  });
});

app.post("/api/run-c", (req, res) => {
  const { code } = req.body;
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, "code.c");
  const outputPath = path.join(tempDir, "code"); // Path for the compiled executable

  // Write C code to a file
  fs.writeFile(filePath, code, (fileErr) => {
    if (fileErr) {
      return res.status(500).json({ error: "Failed to write C code to file" });
    }

    // Compile the C code
    exec(`gcc ${filePath} -o ${outputPath}`, (compileErr, stdout, stderr) => {
      if (compileErr) {
        // Clean up the source file even if the compile fails
        fs.unlinkSync(filePath);
        return res.status(500).json({ error: stderr || compileErr.message });
      }

      // Run the compiled code if compilation was successful
      exec(`${outputPath}`, (runErr, runStdout, runStderr) => {
        // Clean up files after execution, checking if they exist first
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
          if (fs.existsSync(outputPath)) {
            fs.unlinkSync(outputPath);
          }
        } catch (cleanupErr) {
          console.error("Error cleaning up files:", cleanupErr);
        }

        if (runErr) {
          return res.status(500).json({ error: runStderr || runErr.message });
        }

        // Send the output back to the client
        res.json({ output: runStdout });
      });
    });
  });
});

app.post("/api/run-php", (req, res) => {
  const { code } = req.body;
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, "code.php");

  fs.writeFile(filePath, code, (fileErr) => {
    if (fileErr) {
      return res
        .status(500)
        .json({ error: "Failed to write PHP code to file" });
    }

    exec(`php ${filePath}`, (runErr, runStdout, runStderr) => {
      fs.unlinkSync(filePath);

      if (runErr) {
        return res.status(500).json({ error: runStderr || runErr.message });
      }

      res.json({ output: runStdout });
    });
  });
});

app.post("/api/run-typescript", (req, res) => {
  const { code } = req.body;
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, "code.ts");
  const jsFilePath = path.join(tempDir, "code.js");

  fs.writeFile(filePath, code, (fileErr) => {
    if (fileErr) {
      return res
        .status(500)
        .json({ error: "Failed to write TypeScript code to file" });
    }

    exec(
      `tsc ${filePath} --outFile ${jsFilePath}`,
      (compileErr, stdout, stderr) => {
        if (compileErr) {
          return res.status(500).json({ error: stderr || compileErr.message });
        }

        exec(`node ${jsFilePath}`, (runErr, runStdout, runStderr) => {
          fs.unlinkSync(filePath);
          fs.unlinkSync(jsFilePath);

          if (runErr) {
            return res.status(500).json({ error: runStderr || runErr.message });
          }

          res.json({ output: runStdout });
        });
      }
    );
  });
});

app.post("/api/run-ruby", (req, res) => {
  const { code } = req.body;
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, "code.rb");

  fs.writeFile(filePath, code, (fileErr) => {
    if (fileErr) {
      return res
        .status(500)
        .json({ error: "Failed to write Ruby code to file" });
    }

    exec(`ruby ${filePath}`, (execErr, stdout, stderr) => {
      fs.unlinkSync(filePath);

      if (execErr) {
        return res.status(500).json({ error: stderr || execErr.message });
      }

      res.json({ output: stdout });
    });
  });
});

app.post("/api/run-javascript", (req, res) => {
  const { code } = req.body;
  const tempDir = os.tmpdir();
  const filePath = path.join(tempDir, "code.js");

  fs.writeFile(filePath, code, (fileErr) => {
    if (fileErr) {
      return res
        .status(500)
        .json({ error: "Failed to write javascript code to file" });
    }

    exec(`node ${filePath}`, (execErr, stdout, stderr) => {
      fs.unlinkSync(filePath);

      if (execErr) {
        return res.status(500).json({ error: stderr || execErr.message });
      }

      res.json({ output: stdout });
    });
  });
});

app.post("/api/run-go", (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Invalid or empty Go code." });
  }

  const unsafePatterns = [/os/, /syscall/, /exec/, /runtime/];
  if (unsafePatterns.some((pattern) => pattern.test(code))) {
    return res.status(400).json({ error: "Unsafe code detected." });
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "go-code-"));
  const filePath = path.join(tempDir, "code.go");
  fs.writeFile(filePath, code, (fileErr) => {
    if (fileErr) {
      cleanUp(tempDir);
      return res
        .status(500)
        .json({ error: "Failed to write Go code to file." });
    }

    const hasExternalDependencies = code.includes('import "github.com');
    const goRunCommand = hasExternalDependencies
      ? `cd ${tempDir} && go mod init temp && go mod tidy && go run code.go`
      : `cd ${tempDir} && go run code.go`;

    // Execute the Go code
    exec(goRunCommand, { timeout: 5000 }, (runErr, runStdout, runStderr) => {
      cleanUp(tempDir);

      if (runErr) {
        return res.status(500).json({ error: runStderr || runErr.message });
      }

      res.json({ output: runStdout });
    });
  });
});

function cleanUp(directory) {
  try {
    fs.rmSync(directory, { recursive: true, force: true });
  } catch (err) {
    console.error("Failed to clean up temporary files:", err);
  }
}

module.exports = app;
