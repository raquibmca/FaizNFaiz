const mysql = require("mysql");
require("dotenv").config();

let dbConfig = {
    connectionLimit: 10, // default 10
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
};

const pool = mysql.createPool(dbConfig);
const connection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err);
            console.log("MySQL pool connected: threadId " + connection.threadId);
            const query = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    connection.query(sql, binding, (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
            };
            const release = () => {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    console.log("MySQL pool released: threadId " + connection.threadId);
                    resolve(connection.release());
                });
            };
            resolve({ query, release });
        });
    });
};
const query = (sql, binding) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, binding, (err, result, fields) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const escape = mysql.escape;

module.exports = { pool, connection, query, escape };