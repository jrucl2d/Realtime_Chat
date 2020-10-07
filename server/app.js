const express = require("express");
const socketIO = require("socket.io");
const app = express();
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

const io = socketIO(server);
