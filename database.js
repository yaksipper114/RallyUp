//DB CONFIG.
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rallyupserver'
});

module.exports = connection;

/* 
User ID Code eventually:
const crypto = require("crypto");
const id = crypto.randomBytes(16).toString("hex");
*/ 
