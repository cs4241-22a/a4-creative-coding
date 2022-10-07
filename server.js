const express = require("express");
const app = express();
const path = require('path');

app.use(express.static(__dirname + '/public'));

app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
});

const listener = app.listen(3000, () => {
    console.log("Your app is listening on port " + 3000);
});