var util = require('util');

var update = module.exports = function update() {};
update.index = function (keys, data, callback) {
  dbUpdate(this.db, this.table, keys, data, callback);
};
update.transaction = function (db, keys, data, callback) {
  dbUpdate(db, this.table, keys, data, callback);
};

function dbUpdate(db, table, keys, data, callback) {
  var sql = 'update ' + table + ' set ';
  if (typeof keys === 'string') {
    keys = [keys];
  }
  var wheres = [];
  var params = [];
  for (var k in data) {
    if (keys.indexOf(k) < 0) {
      sql += ' `' + k + '`=?,';
      params.push(data[k]);
    }
  }
  sql = sql.substring(0, sql.length - 1);
  var values = [];
  keys.forEach(function (key) {
    if (util.isArray(data[key])) {
      var value = data[key];
      var qs = [];
      for (var i = 0; i < value.length; i++) {
        qs.push('?');
        values.push(value[i]);
      }
      wheres.push(key + ' in (' + qs.join(', ') + ')');
    } else {
      wheres.push(key + '=?');
      values.push(data[key]);
    }
    });
  sql += ' where ' + wheres.join(' and ');
  db.query(sql, params.concat(values), callback);
};
