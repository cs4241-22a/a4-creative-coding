const express = require('express'),
      app     = express(),
      cors    = require('cors')

app.use( cors() )
app.use( express.static('./public') )

app.get("/public/index.html", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

app.listen(process.env.PORT || 3000)