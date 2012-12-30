/**
 * Utility script to process SQL query filters.
 * 
 * Copyright (C) 2011 UrbanTouch.com
 **/
"use strict";

var util = require('util');
var ututils = require('../../lib/ututils');

/**
 * Generate WHERE clause(s) String, along with the bind parameter array, for the given filter Object.
 * @api
 **/
function filter (filters) {
  var whereClause = '';
  var params = [];
  var clauses = [];
  var value, k;
  
  if (typeof(filters) == 'string') {

    whereClause = filters;
    
  } else if (ututils.isNotEmptyString(filters.dataTableSql)) {
    
    whereClause = filters.dataTableSql;
    params = filters.bindParams;
    
  } else {
    
    for (k in filters) {
      value = filters[k];
      
      if (util.isArray(value)) {
        var qs = [];
        for (var i = 0; i < value.length; i++) {
          qs.push('?');
          params.push(value[i]);
        }
        clauses.push(k + ' in (' + qs.join(', ') + ')');
      } 
      
      else if (k == 'inRange') {
        clauses.push(value.colomn + ' between ? and ? ');
        params.push(value.min);
        params.push(value.max);
      } 
      
      else if (k === 'like') {
        clauses.push(value.colomn + ' like ? ');
        params.push(value.value);
      }

      else if (k === 'geThan') {
        clauses.push(value.colomn + ' >= ? ');
        params.push(value.value);
      }

      else if (k === 'leThan') {
        clauses.push(value.colomn + ' <= ? ');
        params.push(value.value);
      }
      
      else if (typeof (value) == 'object') {
        for (var j in value) {
          var newValue = value[j];
          if (util.isArray(newValue)) {
            var qs = [];
            for (var i = 0; i < newValue.length; i++) {
              qs.push('?');
              params.push(newValue[i]);
            }
            clauses.push(k + '.' + j + ' in (' + qs.join(', ') + ')');
          } else {
            clauses.push(k + '.' + j + ' = ? ');
            params.push(value[j]);
          }
        }
      } 
      
      else {
        clauses.push(k + ' = ? ');
        params.push(filters[k]);
      }
    }
    
    whereClause = ' where ' + clauses.join(' and ');
  }//if (filters is a String already)
  
  return {
    'whereClause' : whereClause,
    'bindParams'  : params
  };
};

module.exports = filter;
