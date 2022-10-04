const express = require('express'),
      app = express(),
      cors = require('cors'); 
      
app.use( cors ())
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.listen(3000)


app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
  });