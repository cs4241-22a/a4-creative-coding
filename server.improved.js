const express = require( 'express' ),
          app = express(),
        bodyparser = require( 'body-parser' ),
         path = require( 'path' );
app.listen(process.env.PORT || 3000, function() { console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env); } );

app.use( bodyparser.json() );
app.use( express.static( path.join( __dirname + '/public' ) ) );
app.get('/', ( req, res ) => { res.render( "index", { msg: "", layout: false } ) } );
