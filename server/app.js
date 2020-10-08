const express = require("express");
const socketIO = require("socket.io");
const app = express();
const PORT = process.env.PORT || 8000;
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

app.get("/", require("./routes")); // router

const server = app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

const io = socketIO(server);

// io를 통해서 새 유저(socket)이 연결됨을 파악
io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room }); // addUser에서 error을 반환하거나 user을 반환함

    if (error) return callback(error); // error handling

    // 현재 들어간 사람에게 보여지는 admin 메시지
    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });
    // 현재 들어간 사람을 제외한 방 사람에게 보내지는 admin 메시지
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has joined the room!`,
    });

    socket.join(user.room); // socket을 socket.io의 'room'에 join 시킴

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback(); // error가 없음
  });

  // 프론트에서 유저가 적은 메시지가 서버로 오면 처리 후 프론트로 이벤트 emit(전체 전송)
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.name, text: message });
    callback();
  });

  // 해당 유저(socket)이 연결을 해제함
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    io.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has left!`,
    });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });
});
