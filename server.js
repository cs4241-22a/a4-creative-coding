//installed packages
const express = require("express"),
  app = express()

app.use(express.static('public'))
app.use(express.static('views'))

//listen to port
app.listen(3000)

//ROUTES

app.get('/',(req, res) => {
  console.log("port 3000 called")
})


