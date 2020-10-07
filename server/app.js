const express = require("express");
const socketIO = require("socket.io");
const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", require("./routes")); // router

const server = app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

const io = socketIO(server);

// io를 통해서 새 유저(socket)이 연결됨을 파악
io.on("connection", (socket) => {
  console.log("new user connected!!");

  // 파라미터 뒤에 , callback을 넣어서 error handling도 가능
  socket.on("join", ({ name, room }) => {
    console.log(name, room);
  });

  // 해당 유저(socket)이 연결을 해제함
  socket.on("disconnect", () => {
    console.log("user left!!");
  });
});
