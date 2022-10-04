const express = require('express'),
      app     = express(),
      cors    = require('cors'),
      path = require('path'),
      router = express.Router()

app.use( cors() )

app.use( express.static('public') )

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});


app.listen(process.env.PORT || 3000)