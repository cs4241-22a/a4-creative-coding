

const express = require('express'), app = express()

app.use( express.urlencoded({ extended:true }) )
  
app.use(express.static('./public'))
console.log('in server')


app.get( '/', (req,res) => {
    res.render( 'index', { msg:'', layout:false })
    })


const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on port 3000'))