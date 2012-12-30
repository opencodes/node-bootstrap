var util = require('util');
var Model = require('./model/index');
var config = require('../config/config').db_options;
var db = require('./db')(config);

var DBModel = function( table, options) {
  Model.call(this,table,options,db);
};

util.inherits(DBModel,Model);

module.exports = DBModel;
