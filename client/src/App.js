import React, { useEffect, useState } from "react";
import classes from "./App.module.css";

import io from "socket.io-client";
const server = "http://127.0.0.1:5001";
var socket = io(server);

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("I'm connected with the back-end");
    });
    socket.on("logs", (data) => {
      console.log(data);
      setData(data);
    });
  }, []);

  return (
    <div className={classes["hello"]}>
      <div>
        {data.map((log) => {
          return <p>{log}</p>;
        })}
      </div>
    </div>
  );
}

export default App;
