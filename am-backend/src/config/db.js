/**
 * 链接数据库
 * account: root
 * password: root
 * host: localhost 
 **/
const SUCCESSMSG = "成功链接数据库!";
const ERRORMSG = "数据库连接出错!";
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'am',
    waitForConnections: true,  // 等待连接池连接
    connectTimeout: 10000,     // 设置连接超时时间
});

pool.getConnection((err, connection) => {
    if (err) {
        console.log(`\x1b[1m\x1b[35m - db.js -> line 20\x1b[0m: \x1b[3m\x1b[37m${ERRORMSG} ${err}\x1b[0m`);
        return;
    }
    console.log(`\x1b[1m\x1b[35m - db.js -> line 23\x1b[0m: \x1b[3m\x1b[37m${SUCCESSMSG}\x1b[0m`);
    // 使用连接
    connection.release(); // 释放连接回连接池
});

module.exports = pool;