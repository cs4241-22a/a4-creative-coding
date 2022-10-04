const express = require( 'express' ),
      app     = express(),
      bodyParser = require('body-parser')

app.set('port', (process.env.PORT || 3000));
app.use( express.static('public') )
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use( express.json() )

app.use( bodyParser.urlencoded({ extended:true}) )

app.use(bodyParser.json())

app.get("/", (req,res) => {
    res.render( "index")
})

app.listen( 3000 )