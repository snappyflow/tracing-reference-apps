/**
 * DatabaseController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const mysql = require('mysql');
 if (process.env.NODE_ENV == 'development') 
     require('dotenv').config();

 const mysqlHost = process.env.MYSQL_HOST;
 const mysqlUser = process.env.MYSQL_USER;
 const mysqlPassword = process.env.MYSQL_PASSWORD;
 const mysqlDatabase = process.env.MYSQL_DATABASE; 
 
 var con = mysql.createConnection({
     host: mysqlHost,
     user: mysqlUser,
     password: mysqlPassword,
     database: mysqlDatabase
 });
 con.connect(function(err) {
    if (err){
        console.log('Database connection error');
    }
});

module.exports = {
  getDatabase: function(req, res) {
    sails.config.globals.logger.info('Database api called');
    // console.log('custom ', sails.config.globals.apm.captureError);
    // console.log("Connected!");
    var query = 'SELECT * FROM Person;';
    con.query(query, function (err, result) {
        if (err) {
            sails.config.globals.logger.error('Database query error');
            sails.config.globals.apm.captureError(err);
            return res.send({
                'msg': 'Error: ' + err
            });
        }
        //   console.log("Result: " + result);
        return res.send({
            'msg': 'Success'
        });
    });
  },

  getDatabaseWithError: function (req, res, next) {
    sails.config.globals.logger.info('Database error api called');
    // console.log("Connected!");
    var query = 'SELECT * FROM abcd;';
    con.query(query, function (err, result) {
        if (err) {
            sails.config.globals.logger.error('Database query error');
            sails.config.globals.apm.captureError(err);
            return res.status(500).send({
                'msg': 'Error: ' + err
            });
        }
        //   console.log("Result: " + result);
        return res.send({
            'msg': 'Success'
        });
    });
  }
};

