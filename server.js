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
const{ MongoClient } = require('mongodb');
const express = require('express');

const uri = "mongodb+srv://jackleserman:jackleserman@testcluster.8ad4jnf.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri);

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


async function getAllRows() {
  await client.connect();
  const result = await client.db("catbase").collection("catdata").find().toArray();
  console.log(result);
  
  return result;
}

async function update_tagsDB() {
  array = [];
  counts = [];
  await client.connect();
  const result = await client.db("catbase").collection("catdata").find().toArray();
  counter = -1;
  result.forEach(async function(doc){
    counter = counter + 1;
    array.push(doc.tag);
    counts.push(counter);
  });
  //if you are wondering why this is here, it is because JS is bad and I couldnt
  //run my update function in the forEach. I have no idea why nor did the TAs. Pain.
  //console.log(array);
  //console.log(counts);
  for (let i = 0; i < array.length; i++) {
    try{
    const row = await getRow(array[i]);
    await updateRow_noClose(array[i], row.username, row.title, row.img, counts[i]);
    }catch(error){console.log("Tag Update DNE error")
    break;
    }
  }
  //setTimeout(() => {console.log("Waiting")}, 1000);
}

const update_tags = function(){

}


app.use( cookie({
  name: 'session',
  keys: ['key1', 'key2']
}))

let curr_user = "user";

app.get( '/', (req,res) => {
  res.render( 'index', { msg:'', layout:false })
})

app.post( '/login', async (req,res)=> {
  console.log("login")
  // express.urlencoded will put your key value pairs 
  // into an object, where the key is the name of each
  // form field and the value is whatever the user entered
  curr_user = req.body.username
  curr_pw = req.body.password

  if(await check_for_user(curr_user)){
      console.log("User Found")
      const result = await client.db("catbase").collection("login").findOne({username: curr_user});
      console.log(result.password)
      // below is *just a simple authentication example* 
      // for A3, you should check username / password combos in your database
      if(result.password == curr_pw) {
        // define a variable that we can check in other middleware
        // the session object is added to our requests by the cookie-session middleware
        req.session.login = true
        console.log("Password OK")
        
        // since login was successful, send the user to the main content
        // use redirect to avoid authentication problems when refreshing
        // the page or using the back button, for details see:
        // https://stackoverflow.com/questions/10827242/understanding-the-post-redirect-get-pattern 
        res.redirect( 'main.html' )
      }else{
        console.log("login")
        // cancel session login in case it was previously set to true
        req.session.login = false
        // password incorrect, send back to login page
        res.render('index', { msg:'login failed, please try again', layout:false })
      }
    }else{
      res.render('index', { msg:'❌⚠️ no user found, please try again or register ⚠️❌', layout:false })
    }
})

app.post( '/register', (req,res)=> {
  console.log("Registering")
  res.render('register', { msg:'', layout:false })
})

async function addUserDB(usernameIN, passwordIN) {
  console.log("test");
  await client.connect();
   const newRow = {
            username: usernameIN,
            password: passwordIN,
    }
    const result = await client.db("catbase").collection("login").insertOne(newRow);
    console.log(`New Row Created: ${result.insertedId}`);
  }

  const newUser = async function (request, response) {
    console.log("Creating new user")
    let dataString = "";
    request.on("data", function (data) {
      dataString += data;
      console.log("data")
    });
  
    request.on("end", async function () {
      console.log("end")
      const data = JSON.parse(dataString);
      const username = data.username;
      const password = data.password;
      await addUserDB(username, password).catch(console.error);
      //response.end( JSON.stringify( appdata ) )
      //response.end();
    });
  };

app.post('/create_account', async (req, res) => {
  await newUser(req, res).then()
  //console.log("We should redirect now...")
  //res.render('register', { msg:'Account Created', layout:false })
})

app.post('/redirect', async (req, res) => {
  res.render('index', { msg:'Account Created', layout:false })
})


// add some middleware that always sends unauthenicaetd users to the login page
app.use( function( req,res,next) {
  if( req.session.login === true )
    next()
  else
    res.render('index', { msg:'login failed, please try again', layout:false })
})

app.get( '/main.html', ( req, res) => {
    res.render( 'main', { msg:'Welcome ' + curr_user +'', layout:false})
})

let appdata = []

async function getData_forPrint() {
  appdata.splice(0,appdata.length);
  console.log("Before");
  console.log(appdata);
  await client.connect();
  const result = await client.db("catbase").collection("catdata").find().toArray();
  result.forEach(async function(doc){
    const addItem = {
      username: doc.username, //todo
      title: doc.title,
      img: doc.img,
      tag: doc.tag, //
    };
    appdata.push(addItem);

  });
  console.log(appdata)
  return appdata;
}

app.get("/groceryData", async(req, res) =>{
  data_out = await getData_forPrint(); 
  console.log("After");
  console.log(data_out)
  res.end(JSON.stringify(data_out));
})

app.post("/submit", (req, res)=>{
  addRow(req, res); //THISSSSSS
});

app.post("/remove", (req, res)=>{
  delRow(req, res);
});
app.post("/update", (req, res)=>{
  editRow(req, res);
});
app.post("/clear", (req, res)=>{
  clearall(req, res);
});

async function cleardb(){
  await client.connect();
  const result = await client.db("catbase").collection("catdata").deleteMany({});
  console.log("DB cleared")
}

const clearall = function (request, response) {
    cleardb();
    let dataString = "";
    request.on("data", function (data) {
    dataString += data;
  });

  
  request.on("end", function () {
    let index = -1;
    appdata.splice(0,appdata.length);
    update_tags();
    try{update_tagsDB();}catch(error){console.log("Error with Tag Update")};
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //response.end( JSON.stringify( appdata ) )
    response.end();

  });
}

const editRow = function (request, response) {
  update_tags();
  try{update_tagsDB();}catch(error){console.log("Error with Tag Update")};
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    const data = JSON.parse(dataString);
    let tag = data.tag;
    const name = data.name;
    const title = data.title;
    const img = data.img;
    updateRow(tag, name, title, img, tag).catch(console.error);

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //response.end( JSON.stringify( appdata ) )
    response.end();
  });
};

const delRow = function (request, response) {
  update_tags();
  try{update_tagsDB();}catch(error){console.log("Error with Tag Update")};
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", async function () {
    let index = -1;
    const data = JSON.parse(dataString);
    let tag3 = data.tag;
    await removeRowDB(tag3);
    //console.log("REMOVING "  + tag3)
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    //response.end( JSON.stringify( appdata ) )
    response.end();
  });
};

const addRow = function (request, response) {
  update_tags();
  try{update_tagsDB();}catch(error){console.log("Error with Tag Update")};
  tag2 = tag2 + 1;
  let dataString = "";
  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", async function () {
    const data = JSON.parse(dataString);
    
    /*
        const data = JSON.parse(dataString);
    const name = data.name;
    const title = data.title;
    const img = data.img;
    const tag = data.tag;

    addRowDB(name, title, img, tag);
    */

    await addRowDB(data.name, data.title, data.img, data.tag).catch(console.error);
    response.writeHead(302, "OK", { "Content-Type": "text/plain" });
    response.end();
  });
};

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
