const mysql = require('mysql2/promise');

const dbcn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bsax0203',
    database: 'wallet_manager',
  });

module.exports = dbcn;