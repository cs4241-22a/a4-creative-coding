//make an express app
const express = require("express");
const app = express();
const port = 3000;
//set directory for static files
app.use(express.static("public"));

//make a route
app.get("/", (req, res) => {
  //send index.html
  res.sendFile(__dirname + "/index.html");
});

//start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
