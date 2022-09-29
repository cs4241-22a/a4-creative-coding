const { request, reponse } = require('express');

const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    port = 3000;

const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname + '/css/style.css'));
})

app.listen(process.env.PORT || port);