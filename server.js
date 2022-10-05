const express = require('express')

const app = express()

app.use( express.static('public') )

app.get('/', (req, res) => {
    res.sendFile('./views/index.html', { root: __dirname })
})

app.use((req, res) => {
    res.status(404).send('<p>This page does not exist</p>')
})

app.listen(3000)
// pretty sure this is all i need for a server

