var util = require('util');

var transaction = module.exports = function transaction() {};
/**
 * Starting the transaction, we acquire a db connection and return it to callback
 * all the db operation in the transaction needs to use this db connection to connect
 */
transaction.beginTransaction = function (callback) {
  var thisDb = this.db;
  thisDb.acquire(function (err, dbConn) {
    var sql = ' START TRANSACTION;';
    dbConn.query(sql, function (err, objs) {
      if (!err && objs) {
        callback(err, dbConn);
      } else {
        if (err) {
          callback(err, null);
        }
      }
    });
  });
};
transaction.commitTransaction = function (dbConn, callback) {
  var thisDb = this.db;
  var sql = 'COMMIT;';
  dbConn.query(sql, callback);
  thisDb.release(dbConn);
};
transaction.rollbackTransaction = function (dbConn, callback) {
  var thisDb = this.db;
  var sql = 'ROLLBACK;';

  dbConn.query(sql, callback);
  thisDb.release(dbConn);
};