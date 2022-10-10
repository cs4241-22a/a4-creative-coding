const { request, reponse } = require('express');

const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    port = 3000;

const app = express();

console.log('server is running');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.get('/scripts.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/js/scripts.js'));
})

app.listen(process.env.PORT || port);