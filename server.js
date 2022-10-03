const express = require( 'express' ),
      app = express();

app.use(express.urlencoded({ extended:true }) )

app.use( express.json() )

app.use( express.static( 'public'  ))

app.listen( process.env.PORT || 3000 )