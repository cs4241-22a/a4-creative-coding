

const express = require('express'), app = express()

app.use( express.urlencoded({ extended:true }) )


// app.use( (req, res, next) => {
//     if (collection !== null) {
//       next();
//     } else {
//       res.status(503).send();
//     }
//   });
  
app.use(express.static('./public'))
console.log('in server')


app.get( '/', (req,res) => {
    res.render( 'index', { msg:'', layout:false })
    })


const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on port 3000'))




// // const Tweakpane = require('tweakpane');
// const myPane = new Tweakpane();

// // Parameter object
// const PARAMS = {
//     rotationRate: 0.5,
//     anotherParam: 'test'
//     };
//     // Pass the object and its key to pane
//     myPane.addInput(PARAMS, 'rotationRate');
//     // Second Param
//     myPane.addInput(PARAMS, 'anotherParam');

