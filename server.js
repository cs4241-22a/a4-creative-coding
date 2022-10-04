const express = require( 'express' ),
      app = express()

app.use( (req,res,next) => {
  console.log( 'url:', req.url )
  next()
})

app.get( '/', ( req, res ) => res.send( '/index.html' ) )

app.listen( process.env.PORT || 3000 )