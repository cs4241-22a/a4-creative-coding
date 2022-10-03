require('dotenv').config()

const http = require( 'http' ),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      dir  = 'views/',
      port = 3000

const express = require('express'),
      app     = express(),
      cors    = require('cors')

app.use( cors() )
app.use( express.static('./') )

const server = http.createServer( function( request,response ) {
    if( request.method === 'GET' ) {
      handleGet( request, response )    
    }
  })
  
  const handleGet = function( request, response ) {
    const filename = dir + request.url.slice( 1 ) 
  
    if( request.url === '/' ) {
      sendFile( response, 'views/index.html' )
    }else{
      sendFile( response, 'ufo ufo - _Strange Clouds_.mp3' )
    }
  }

  const sendFile = function( response, filename ) {
    const type = mime.getType( filename ) 
 
    fs.readFile( filename, function( err, content ) {
 
      // if the error = null, then we've loaded the file successfully
      if( err === null ) {
 
        // status code: https://httpstatuses.com
        response.writeHeader( 200, { 'Content-Type': type })
        response.end( content )
 
      }else{
 
        // file not found, error code 404
        response.writeHeader( 404 )
        response.end( '404 Error: File Not Found' )
 
      }
    })
 }
 
server.listen( process.env.PORT || port )