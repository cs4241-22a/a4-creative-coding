
const http = require("http"),
  fs = require("fs"),
  express = require("express"),
  path = require("path"),
  app = express(),
  cors = require("cors");

app.use(cors());

app.use( express.static('public') )
app.use( express.static('assets') )

//Routes login related
app.get("/", function (req, res) {
  console.log("hellooooooooo")
  res.sendFile(__dirname + "/public/main.html");
});


app.listen(process.env.PORT || 3000);
