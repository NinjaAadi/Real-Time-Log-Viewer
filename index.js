const express = require("express");

const app = express();
const fs = require("fs");
const http = require("http");
const server = http.createServer(app);
const socket = require("socket.io");
const cors = require("cors");
//For req.body;
app.use(cors());
app.use(express.json({ limit: 100000000 }));
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });

//File watching
fs.watchFile(
  "log.txt",
  {
    persistent: true,
    interval: 100,
  },
  (curr, prev) => {
    // console.log("Previous Modified Time", prev.mtime);
    // console.log("Current Modified Time", curr.mtime);
    const logs = [];
    const allFileContents = fs.readFileSync("log.txt", "utf-8");
    allFileContents.split(/\r?\n/).forEach((line) => {
      logs.push(line);
    });
    if (logs.length > 10) {
      io.emit("logs", logs.slice(-10));
    } else {
      io.emit("logs", logs);
    }
  }
);

//Create a route to write log in the log.txt
app.post("/writeLog", (req, res) => {
  try {
    //fs.writeFileSync("log.txt", req.body.data);
    return res.status(200).json({
      success: true,
      msg: "Write successfull!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      msg: "Error writing logs",
    });
  }
});
server.listen(5001, () => {
  console.log("Server running in port 5001");
});

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  //Read the contents of the file initially
  const logs = [];
  const allFileContents = fs.readFileSync("log.txt", "utf-8");
  allFileContents.split(/\r?\n/).forEach((line) => {
    logs.push(line);
  });
  if (logs.length > 10) {
    io.emit("logs", logs.slice(-10));
  } else {
    io.emit("logs", logs);
  }
});
io.on("disconnect", () => {});
