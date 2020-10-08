import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

import "./Chat.css";
import TextContainer from "../TextContainer/TextContainer";

let socket;

function Chat({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const SERVERLOC = "localhost:8000";

  useEffect(() => {
    const { room, name } = queryString.parse(location.search);

    socket = io(SERVERLOC);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, () => {});

    return () => {
      socket.emit("disconnect"); // disconnect 이벤트 emit하고
      socket.off(); // socket 자체를 닫아버림
    };
  }, [SERVERLOC, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage("")); // callback으로 메시지 전송 후 메시지 input 비우기
    }
  };

  console.log(message, messages);

  return (
    <div>
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
          />
        </div>
        <TextContainer users={users} />
      </div>
    </div>
  );
}

export default Chat;
