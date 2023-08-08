const http = require('http');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();
const fs = require('fs');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const util = require('util');

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


async function runCompletion(prompt) {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt
    });
    return completion.data.choices[0].text;
}

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
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream("index.html", "UTF-8").pipe(res);
    for(const query in querys) {
      if(querys.hasOwnProperty(query)) {
        if(query == "prompt") {
          document.getElementById("p1").innerHTML = await runCompletion(querys[query]);
        }
      }
    }
  }

  else if(req.method === "POST"){
  }
});
server.listen(8080);