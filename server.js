
const express = require('express'),
        app = express(),
        serveStatic = require('serve-static')
        dir = 'public/'





        
const port = 3000


app.use(serveStatic(dir))

app.listen(port || 3000)