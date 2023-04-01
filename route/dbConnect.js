const mysql = require('mysql2/promise');

const dbcn = mysql.createConnection({
    host: 'natsuki-mysql1.cx9dlzdjkaqv.ap-northeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'bsax0203',
    database: 'wallet_manager',
  });

module.exports = dbcn;
