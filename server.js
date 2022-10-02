const express = require("express"),
  cookie = require("cookie-session"),
  hbs = require("express-handlebars").engine,
  app = express(),
  bodyP = require("body-parser"),
  mongodb = require("mongodb"),
  three= require("three");



//   var fav = require("serve-favicon");

// app.use(helmet());
// app.use(enforce.HTTPS({ trustProtoHeader: true }))
// http.createServer(app).listen(app.get('port'), function() {
// 	console.log('Express server listening on port ' + app.get('port'));
// });
// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());


app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000);
const appdata = [];
debugger;
app.get("/",(req,res)=>{
    res.sendFile("index.html");
});


// route to get all docs
// app.get( '/', (req,res) => {
//   if( collection !== null ) {
//     // get array and pass to res.json
//     collection.find({ }).toArray().then( result => res.json( result ) )
//   }
// })0dd } etc.

// app.post("/update", (req, res) => {
//   collection
//     .updateOne(
//       { _id: mongodb.ObjectId(req.body._id) },
//       { $set: { data: req.body.data } }
//     )
//     .then((result) => res.json(result));
// });
// we're going to use handlebars, but really all the template
// engines are equally painful. choose your own poison at:
// http://expressjs.com/en/guide/using-template-engines.html

// cookie middleware! The keys are used for encryption and should be changed
