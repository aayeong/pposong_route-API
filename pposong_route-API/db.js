var mysql = require('mysql2');

var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'aay20201737*',
    database: 'pposong_route'
});
db.connect();

module.exports = db;