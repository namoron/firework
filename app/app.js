const express = require("express");
const app = express();
const port = 3000;

let clickCount = 0;
let clients = [];

app.use(express.static("public"));

app.get("/events", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
  };
  clients.push(newClient);

  req.on("close", () => {
    clients = clients.filter((client) => client.id !== clientId);
  });
});

app.post("/click", (req, res) => {
  clickCount++;
  clients.forEach((client) => client.res.write(`data: ${clickCount}\n\n`));
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`サーバーが http://localhost:${port} で起動しました`);
});
