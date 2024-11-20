const { exec } = require("child_process");
const fs = require("fs");

function runJavaScript(code, res) {
  const fileName = "./temp.js";
  fs.writeFileSync(fileName, code);

  exec(`node ${fileName}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: `Execution error: ${stderr}` });
    }
    res.json({ output: stdout });
  });
}

function runPython(code, res) {
  const fileName = "./temp.py";
  fs.writeFileSync(fileName, code);

  exec(`python3 ${fileName}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: `Execution error: ${stderr}` });
    }
    res.json({ output: stdout });
  });
}

function runRuby(code, res) {
  const fileName = "./temp.rb";
  fs.writeFileSync(fileName, code);

  exec(`ruby ${fileName}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: `Execution error: ${stderr}` });
    }
    res.json({ output: stdout });
  });
}

module.exports = { runJavaScript, runPython, runRuby };
