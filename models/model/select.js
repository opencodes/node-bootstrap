/**
 * Select: regular and transactional
 * Copyright (C) 2011 UrbanTouch.com
 **/
"use strict";

var util = require('util');
var filter = require('./filter');
var select = module.exports = function select() {};

/**
 * @private
 **/
function dbSelect(db, table, filters, options, cb) {
  var sql = 'select ';
  var params = [];
  var callback = cb;
  var conditions = [];
  var value,k;

  /* options are optional */
  if (!cb && typeof (options) === 'function') {
    callback = options;
    options = null;
  }

  sql += ((options && options.countRows) ? 'SQL_CALC_FOUND_ROWS ' : '');

  /* QZ: Fix spelling error */
  if (options && options.colomns) {
    options.columns = options.colomns;
  }

  if (!options || !options.columns) {
    sql += ' *';
  } else {
    if (typeof(options.columns) == 'string')
      sql += options.columns;
    else
      sql += options.columns.join(',');
  }


  if (table)
    sql += ' from ' + table;


  if (filters) {
    var where = filter(filters);
    sql += where.whereClause;
    params = where.bindParams;
  }

  if (options) {
    if (options.groupBy) {
      sql += ' group by';
      for (var i = 0; i < options.groupBy.length; i++) {
        sql += ' ' + options.groupBy[i] + ',';
      }
      sql = sql.substring(0, sql.length - 1);
    }
    if (options.orderBy) {
      sql += ' order by';
      for (var i = 0; i < options.orderBy.length; i++) {
        sql += ' ' + options.orderBy[i].column + ' ' + options.orderBy[i].order + ',';
      }
      sql = sql.substring(0, sql.length - 1);
    }
    if (options.limit && options.skip) {
      sql += ' limit ' + options.skip + ', ' + options.limit;
    } else if (options.limit) {
      sql += ' limit ' + options.limit;
    }
  }

  if (options && options.countRows) {
    db.acquire(function (err, dbConn) {
      dbConn.query(sql, params, function (err, objs) {
        if (!err && objs) {
          dbConn.query('select FOUND_ROWS()', function (err, count) {
            var totalRecs = count[0]['FOUND_ROWS()'];
            db.release(dbConn);
            callback(err, objs, totalRecs);
          });
        } else {
          db.release(dbConn);
          if (err) {
            util.error('SELECT ' + err);
          }
          callback(err, objs, 0);
        }
      });
    });
  } else {
    db.query(sql, params, callback);
  }
};

/**
 * Select results 
 * @params {Object} filters - e.g. { id: [ 1,2,3], name: "abc" }
 * @options {Object} optional argument to specify options such 
 *          as limit, rowCount, like etc
 * @api
 **/
select.index = function (filters, options, cb) {
  dbSelect(this.db, this.table, filters, options, cb);
};

select.transaction = function (db, filters, options, cb) {
  dbSelect(db, this.table, filters, options, cb);
};


/* ------------- Test Code --------------- */
if (require.main == module) {


}
