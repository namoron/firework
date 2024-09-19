const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

let hostConnection = null;

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "host") {
      hostConnection = ws;
    } else if (data.type === "firework" && hostConnection) {
      hostConnection.send(JSON.stringify({ type: "firework" }));
    }
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
