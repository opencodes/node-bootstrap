/**
 ** Nodestore - model
 ** MySQL DB Abstraction layer
 ** Copyright (C) 2011 UrbanTouch.com
 */
"use strict";

var util = require('util');

var select = require('./select');
var insert = require('./insert');
var remove = require('./remove');
var update = require('./update');
var transaction = require('./transaction');

/**
 * A Module that provides a thin db layer, abstracting SQL ops
 */

/**
 * Given a table, create a data model and support
 * basic sql operations (select/insert/update/remove)
 * @constructor
 */
var Model = function Model(table, joinTable,db) {
  this.table = table;
  this.db = db;
  this.joinTable = joinTable;
  if (joinTable) {
    var tableName, joinClause, joinType, ind = null;
    for (ind in joinTable) {
      tableName = joinTable[ind].table;
      joinClause = joinTable[ind].onClause.join(' AND ');
      joinType = joinTable[ind].type;
      this.table += ' ' + joinType + ' ' + tableName + ' ON ' + joinClause;
    }
  }
};

Model.prototype = {
  select: select.index,
  insert: insert.index,
  remove: remove.index,
  update: update.index,
  /**
   * The following db operation requires a db connection as param
   * used in case of transactions, Make sure the storage engine is InnoDB.
   *  add 'ENGINE=INNODB' in all ddl statement
   */
  txInsert: insert.transaction,
  txSelect: select.transaction,
  txUpdate: update.transaction,
  txRemove: remove.transaction,
  
  beginTransaction: transaction.beginTransaction,
  commitTransaction: transaction.commitTransaction,
  rollbackTransaction: transaction.rollbackTransaction,
  end: function (callback) {
    this.db.end(callback);
  },
  columns: function (callback) {
    var that = this;
    function tableColumns(tableName, cb) {
      var sql = 'DESC ' + tableName,
          i, columns = [];
      that.db.query(sql, [], function (err, result) {
        if (err || !result || result.length === 0) {
          cb(new Error('No such table: ' + tableName), null);
          return;
        }
        for (i = 0; i < result.length; i++) {
          columns.push(result[i].Field);
        }
        cb(null, columns);
      });
    }
    if (typeof (this.tableCols) === 'undefined') {
      var thisTable = this;
      tableColumns(thisTable.table, function (err, result) {
        if (err || !result) {
          util.error('Could not get columns for: ' + thisTable.table);
          return;
        }
        thisTable.tableCols = result;
        callback(null, thisTable.tableCols);
      });
    } else {
      callback(null, this.tableCols);
    }
  }
  
};
module.exports = Model;



/* ---------------------------------------------------------- */
if (require.main == module) {
  (function () {
    function Product() {
      Model.call(this, 'catalog_product');
    };

    util.inherits(Product, Model);

    var options = {
      'colomns': ['id', 'sku'],
      'countRows': ''
    };
    var Product = new Product('product');
    Product.columns(function (err, res) {
      util.log('Columns:' + (err || res));
    });
    Product.select({
      id: [1, 2, 3]
    }, options, function (err, obj, count) {
      console.log(err || obj);
      console.log(count);
    });
  })();
}
