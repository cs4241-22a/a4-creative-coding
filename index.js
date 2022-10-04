//make an express app
const express = require("express");
const app = express();
const port = process.env.PORT;
//set directory for static files
app.use(express.static("public"));

//make a route
app.get("/", (req, res) => {
  //send index.html
  res.sendFile(__dirname + "/index.html");
});

//any other request, send the file
app.get("*", (req, res) => {
  console.log(req.url);
  res.sendFile(__dirname + "/public" + req.url);
});

//start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
