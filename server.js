const express    = require('express'),
      app        = express(),
      dreams     = []

app.use( express.static( 'public' ) )
app.use( express.json() )

app.post( '/submit', express.json(), ( req, res ) => {
  dreams.push( req.body.newdream )
  res.writeHead( 200, { 'Content-Type': 'application/json'})
  res.end( JSON.stringify( dreams ) )
})

app.listen( process.env.PORT )