const express = require("express");
var cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/views/index.html");
});



app.get("/assets/a.mp3", (request, response) => {
  response.sendFile(__dirname + "/assets/a.mp3");
});
app.get("/assets/b.mp3", (request, response) => {
  response.sendFile(__dirname + "/assets/b.mp3");
});
app.get("/assets/c.mp3", (request, response) => {
  response.sendFile(__dirname + "/assets/c.mp3");
});
app.get("/favicon.ico", (request, response) => {
  response.sendFile(__dirname + "/favicon.ico");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


