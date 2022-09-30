const express    = require('express'),
      app        = express(),
      cors = require('cors')

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.static('./') )
app.use( express.json() )
app.use( cors() )

app.listen( process.env.PORT )