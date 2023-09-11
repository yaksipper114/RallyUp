const express = require('express');
const mysql = require('mysql2');
const { Configuration, OpenAIApi } = require("openai");
const fs = require('fs');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// DB CONNECTION
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpassword',
  database: 'rallyup_users'
});

db.connect(function(err){
  if(err) throw err;
  console.log("Database Connected!");
});

// OPENAI CONFIG
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// QUERY SEARCH function

// Define your routes
app.get('/', (req, res) => {
  fs.createReadStream("./login.html", "UTF-8").pipe(res);
});


//CREATE A CHECK REQUEST FOR SIGN IN... SHOULD RETURN A RESPONSE TRUE OR FALSE. IF TRUE -> HOMEPAGE, FALSE -> REENTER.



app.get('/create-account', (req, res) => {
  fs.createReadStream("./createAccount.html", "UTF-8").pipe(res);
});

app.get('/home', (req, res) => {
  const userEmail = req.query.email;
  fs.createReadStream("./home.html", "UTF-8").pipe(res);
});

app.post('/submit', (req, res) => {
  console.log(req.body);
  const query = "INSERT INTO `rallyup_users`.`User Info Table` (`first_name`, `zip_code`, `last_name`, `overall_political_view`, `environment_political_view`, `education_political_view`, `racial_injustice_political_view`, `lgbtq_political_view`, `police_reform_political_view`, `gun_control_political_view`, `fake_news_political_view`, `income_inequality_political_view`, `mental_health_political_view`, `email`, `phone`, `password`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const {
    first_name,
    zip_code,
    last_name,
    overall_political_view,
    environment_political_view,
    education_political_view,
    racial_injustice_political_view,
    lgbtq_political_view,
    police_reform_political_view,
    gun_control_political_view,
    fake_news_political_view,
    income_inequality_political_view,
    mental_health_political_view,
    email,
    phone,
    password
  } = req.body;

  const values = [
    first_name,
    zip_code,
    last_name,
    overall_political_view,
    environment_political_view,
    education_political_view,
    racial_injustice_political_view,
    lgbtq_political_view,
    police_reform_political_view,
    gun_control_political_view,
    fake_news_political_view,
    income_inequality_political_view,
    mental_health_political_view,
    email,
    phone,
    password
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      return res.status(500).json({ message: 'Error inserting data' });
    }
    console.log('Data inserted into MySQL');
    res.status(200).json({ message: 'Data inserted successfully' });
  });
});

app.post('/login', (req, res) => {
  let responseString;
  const password = req.body.password;
  const email = req.body.email;

  const query = 'SELECT EXISTS (SELECT 1 FROM rallyup_users.`User Info Table` WHERE email = "' + email + '") AS user_exists; ';

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error checking email in MySQL:', err);
      return err;
    }
    console.log(result);
    if(result[0].user_exists == 1) {
      db.query("SELECT COUNT(*) AS password_match FROM rallyup_users.`User Info Table` WHERE email = '" + email + "'AND password = '" + password + "';", (err, result) => {
        //check password code!
        if (err) {
          console.error('Error checking password in MySQL:', err);
          return err;
        }
        console.log(result);
        if(result[0].password_match == 0) {console.log("check password"); return res.status(200).json({ message: "Check your password" });}
        if(result[0].password_match == 1) {console.log("login success"); return res.status(200).json({ message: "Login successful" });}
        console.log("email is right at least?");
      });
    }
    else {return res.status(200).json({ message: "Check your email" });}

  });  

});


// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
