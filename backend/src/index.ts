import express from "express";

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  console.log("beep boop");
  res.send("Hello world");
});

app.get("/test", (req, res) => {
  console.log("beep boop");
  res.send("testing testing");
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
