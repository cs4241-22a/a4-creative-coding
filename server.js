const express = require("express"),
app = express()

app.use(express.static("public"))
app.use(express.static("views"))
app.use(express.json())

app.listen(process.env.PORT || 3000)