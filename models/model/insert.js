var util = require('util');
var insert = module.exports = function insert() {};

insert.index = function (data, not_updates, callback) {
  dbInsert(this.db, this.table, data, not_updates, callback);
};
insert.transaction = function (db, data, not_updates, callback) {
  dbInsert(db, this.table, data, not_updates, callback);
};

function dbInsert(db, table, data, not_updates, callback) {
  var sql;
  var params = [];
  if (!callback) {
    callback = not_updates;
    not_updates = null;
  }
  if (util.isArray(data)) {
    var update_sql = "";
    sql = 'INSERT INTO ' + table + ' ( ';
    for (var k in data[0]) {
      sql += ' `' + k + '`,';
      if (not_updates && (not_updates.indexOf(k) < 0)) {
        update_sql += ' `' + k + '` = values(' + ' `' + k + '`),';
      }
    }
    update_sql = update_sql.substring(0, update_sql.length - 1);
    sql = sql.substring(0, sql.length - 1);
    sql += ' ) values ';
    for (var i = 0; i < data.length; i++) {
      var currentData = data[i];
      sql += ' ( ';
      for (var k in currentData) {
        sql += '?,';
        params.push(data[i][k]);
      }
      sql = sql.substring(0, sql.length - 1);
      sql += ' ),';
    }
    sql = sql.substring(0, sql.length - 1);
    if (update_sql && update_sql.length > 0)
      sql += ' ON DUPLICATE KEY UPDATE ' + update_sql;
  } else {
    not_updates = not_updates || [];
    sql = table + ' set ';
    var update_sql = '';
    for (var k in data) {
      sql += ' `' + k + '`=?,';
      params.push(data[k]);
      if (not_updates.indexOf(k) < 0) {
        update_sql += ' `' + k + '`=values(`' + k + '`),';
      }
    }
    sql = sql.substring(0, sql.length - 1);
    if (update_sql) {
      sql = 'INSERT INTO ' + sql + ' ON DUPLICATE KEY UPDATE ' + update_sql.substring(0, update_sql.length - 1);
    } else {
      sql = 'INSERT INTO ' + sql;
    }
  }
  db.query(sql, params, callback);
};
