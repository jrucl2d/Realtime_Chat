import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import "./Chat.css";

let socket;

function Chat({ location }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const SERVERLOC = "localhost:8000";

  useEffect(() => {
    const { room, name } = queryString.parse(location.search);

    socket = io(SERVERLOC);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room });
  }, [SERVERLOC, location.search]);
  return (
    <div>
      <h1>chat</h1>
    </div>
  );
}

export default Chat;
