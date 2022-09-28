const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000;

let tag2 = -1

const { json } = require("body-parser");
const { Console } = require("console");

const express = require('express');
console.log("Server Started")
//cleardb()

const cookie  = require( 'cookie-session' );
app = express();

// use express.urlencoded to get data sent by defaut form actions
// or GET requests
app.use( express.urlencoded({ extended:true }) )

// we're going to use handlebars, but really all the template
// engines are equally painful. choose your own poison at:
// http://expressjs.com/en/guide/using-template-engines.html

// cookie middleware! The keys are used for encryption and should be changed

app.use(express.static(__dirname + '/public'));

async function addRowDB(usernameIN, titleIN, imgIN, tagIN) {
  await client.connect();
   const newRow = {
            username: usernameIN,
            title: titleIN,
            img: imgIN,
            tag: tagIN,
    }
    const result = await client.db("catbase").collection("catdata").insertOne(newRow);
    console.log(`New Row Created: ${result.insertedId}`);
    
}

async function getRow(tagIN) {
      await client.connect();
      const result = await client.db("catbase").collection("catdata").findOne({tag: tagIN});
      if(result){
          //console.log(`Found a row with tag'${tagIN}'`);
          //console.log(result);
          return result;
      }else{
          console.log("No rows found under that name");
      }  
}

async function check_for_user(username_in) {
  await client.connect();
  const result = await client.db("catbase").collection("login").findOne({username: username_in});
  if(result){
      return true;
  }else{
      console.log("No rows found under that name");
      return false;
  }  
}

async function removeRowDB(tagIN) {
  console.log("Removing " + tagIN);
  tagIN = parseInt(tagIN);
  await client.connect();
  const result = await client.db("catbase").collection("catdata").deleteOne(
  {tag: tagIN});

  console.log(`${result.deletedCount} rows were deleted`);
}

async function updateRow(tagToUpdate, usernameIN, titleIN, imgIN, tagIN) {
      tagToUpdate = parseInt(tagToUpdate);
      tagIN = parseInt(tagIN);
      console.log("Updating: " + tagToUpdate);
      await client.connect();
      const updatedRow =  {username: usernameIN, title: titleIN, img: imgIN, tag: tagIN};
      const result = await client.db("catbase").collection("catdata").updateOne({tag: 
        tagToUpdate}, {$set: updatedRow});
    
      console.log(`${result.matchedCount} rows matched the criteria`)
      console.log(`${result.modifiedCount} rows were updated`) 
}

async function updateRow_noClose(tagToUpdate, usernameIN, titleIN, imgIN, tagIN) {
  await client.connect();
  const updatedRow =  {username: usernameIN, title: titleIN, img: imgIN, tag: tagIN};
  const result = await client.db("catbase").collection("catdata").updateOne({tag: 
    tagToUpdate}, {$set: updatedRow});

  //console.log(`${result.matchedCount} rows matched the criteria`)
  //console.log(`${result.modifiedCount} rows were updated`) 
}

app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

let curr_user = "user";

app.get( '/', (req,res) => {
  res.render( 'index', { msg:'', layout:false })
})

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};
//test_user,test_password
app.listen( 3000 )
