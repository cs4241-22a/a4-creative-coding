//Import and set up modules
var path = require('path');

const express = require('express');
const app = express();
const port = 3000;
var morgan = require('morgan');
var bodyParser = require('body-parser');
const initStats = require('@phil-r/stats');

const { statsMiddleware, getStats } = initStats({
  endpointStats: true,
  complexEndpoints: [],
  customStats: false,
  addHeader: true
});



//Define server routes

//Redirect to main page (TODO: Use res.redirect)
app.get('/', (req, res) => {
  res.sendFile('/public/index.html', {root: __dirname});
});

//Initialize middleware
app.use(morgan('dev'));
app.use(statsMiddleware);
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));

//Allow viewing the server's stats
app.get('/stats', (req, res) => res.send(getStats()));

//Finalize server startup
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});