/**
 * Delete: regular and transactional
 * Copyright (C) 2011 UrbanTouch.com
 **/
'use strict';

var util = require('util');
var filter = require('./filter');

var remove = module.exports = function remove() {};

remove.index = function (data, callback) {
  dbRemove(this.db, this.table, data, callback);
};
remove.transaction = function (db, data, callback) {
  dbRemove(db, this.table, data, callback);
};

function dbRemove(db, table, data, callback) {
  var sql = 'delete from ' + table;
  var params = [];

  var where = filter(data);
  sql += where.whereClause;
  params = where.bindParams;

  db.query(sql, params, callback);
};
