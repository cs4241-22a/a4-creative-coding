
const express = require('express'),
        app = express()


        const port = 3000

app.use(express.static('public'))

app.listen(port || 3000)