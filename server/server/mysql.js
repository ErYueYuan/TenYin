const mysql = require('mysql');
const db = mysql.createConnection({
  host:'121.196.46.103',
  user:'root',
  password:'123456',
})

module.exports = db;