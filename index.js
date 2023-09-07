const http = require('http');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const fs = require('fs');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); // Parse JSON requests

// Define a route to handle the ratings submission
app.post('/submit-ratings', (req, res) => {
  const ratingsData = req.body; // The ratings data sent from the front end
  console.log('Received ratings data:', ratingsData);
  
  // Here, you can perform actions like storing the data in a database

  res.status(200).json({ message: 'Ratings submitted successfully' });
});


//OPENAI CONFIG.
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);
//


//QUERY SEARCH
function parseQuery(queryString) {
  var query = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}
//

//SERVER HANDLING
var server = http.createServer(async function(req, res){
  //req.method // GET POST HEAD
  let path = url.parse(req.url, true);
  let decoder = new StringDecoder("UTF-8");
  let buffer = "";
  let querys;
  console.log(path.search);
  if (path.search != null) {
    querys = parseQuery(path.search);
  }


  if(req.method === "GET") {
    fs.createReadStream("./index.html", "UTF-8").pipe(res);

    for(const query in querys) {
      if(querys.hasOwnProperty(query)) {
        if(query == "prompt") {
          console.log(await runCompletion(querys[query]));
        }
      }
    }
  }

  else if(req.method === "POST"){
  }
});
server.listen(8080);

//DB CONNECTION
var connection = require('./database');
connection.connect(function(err){
  if(err) throw err
  console.log("Database Connected!")
});
//
