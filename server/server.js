import express from "express";
const port = '3000';
// Setup static express
const app = express();
app.use(express.static('src'));
app.listen(process.env.PORT || port);
console.log(`Listening on port ${process.env.PORT || port}`);
