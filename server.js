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

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname + '/css/style.css'));
})

app.get('/mysingingmonsters.jpg', (req, res) => {
    res.sendFile(path.join(__dirname + '/assets/mysingingmonsters.jpg'));
})

app.get('/scripts.js', (req, res) => {
    res.sendFile(path.join(__dirname + '/js/scripts.js'));
})

app.get('/sound1.ogg', (req, res) => {
    res.sendFile(path.join(__dirname + '/assets/03-A_Monster_01.ogg'));
})

// app.get('/shrubb.ogg', (req, res) => {
//     res.sendFile(path.join(__dirname + '/assets/01-BC_Monster_01.ogg'));
// })

app.listen(process.env.PORT || port);