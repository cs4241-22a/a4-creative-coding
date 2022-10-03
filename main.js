import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', 'public');

app.use(express.static(__dirname))
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')))
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')))

const PORT = 80
app.listen(PORT, () => {console.log(`You are now listening Port: ${PORT}`)})

//Git token: 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