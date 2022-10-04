const express = require("express");
var cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static("public"));

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/view/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});