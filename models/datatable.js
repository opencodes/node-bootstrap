"use strict";

var moment = require('moment'),
    util = require('util'),
    ututils = require('../lib/ututils');

var datatable = {
  format: function (options, count, objs) {
    var totalRecs = count;
    var dataArray = [];
    var sColumns = [];
    var dataObject = {
      "sEcho": options.echo,
      "iTotalRecords": totalRecs,
      "iTotalDisplayRecords": totalRecs
    };

    if (options.sColumns) {
      for (var k in objs[0]) {
        sColumns.push(k);
      }
    }

    if (sColumns.length) dataObject.sColumns = sColumns.join(',');
    if (objs) {
      for (var i = 0; i < objs.length; i++) {
        var row = [];
        var obj = objs[i];
        for (var k in obj) {
          var data = obj[k];
          if (options.dateFormat && (data instanceof Date)) {
            if (isNaN(data.getTime()) == false) data = moment(data).format(options.dateFormat);
            else data = '-';
          }
          row.push(data);
        }
        dataArray.push(row);
      }
    }
    dataObject.aaData = dataArray;
    
    return dataObject;
  },

  processReqParams: function (requestQuery, searchColumns, sortColumns, optionalFilterClause, groupbyClause, havingClause, orderbyClause) {

    var sql = '';
    var params = [];
    var i;
    var searchColMap = {};

    var columnSearchFlag = false;
    for (var j = 0; j < searchColumns.length; j++) {
      if (searchColumns[j]) {
        columnSearchFlag = requestQuery['sSearch_' + j];
        if (columnSearchFlag || columnSearchFlag === 0) searchColMap[searchColumns[j]] = columnSearchFlag;
      }
    }
    var likeQuery = '';
    if (ututils.isNotEmptyString(requestQuery.sSearch)) {
      /*
       *Invoked when anything is written on the search text box
       *like query is generated here
       */
      
      for (i = 0; i < searchColumns.length; i++) {
        likeQuery += ' ' + searchColumns[i] + ' like ? ';
        params.push('%' + requestQuery.sSearch + '%');
        if (i !== (searchColumns.length - 1)) {
          likeQuery += ' or';
        }
      }
      sql += ' where (' + likeQuery + ')  ';
    }

    var columnwiseLikeQueryString = '';
    if (!ututils.isEmpty(searchColMap)) {
      var columnLikeQuery = [];
      var searchTextMultipleLike = [];
      for (var column in searchColMap) {

        //if the search text is seprated by , then treat it as multiple search action
        var searchTextArray = searchColMap[column].split(',');
        searchTextMultipleLike = [];
        for(i = 0; i < searchTextArray.length; i++) {
          var searchText = searchTextArray[i];
          if (ututils.isNotEmptyString(searchText) && searchText != '~') {
            if(searchText.indexOf('~') == -1) {
              searchTextMultipleLike.push(column + ' like ? '); 
              params.push('%' + searchText + '%');
            } else {
              var p =  searchText.trim().split('~');
              var arr = [];
              var x = 0;
              for(var i = 0; i < p.length; i++){
                if(p[i] && p[i] != '' && p[i] != 'undefined')
                  arr[x++] = p[i];
              }
              if(arr.length == 1) {
                if(searchText.indexOf('~') == 0){
                  searchTextMultipleLike.push(column + ' <= ?'); 
                  params.push(arr[0]);
                } else {
                  searchTextMultipleLike.push(column + ' >= ?'); 
                  params.push(arr[0]);
                } 
              } else if(arr.length == 2) {
                searchTextMultipleLike.push(column + ' BETWEEN ? AND ? '); 
                params.push(arr[0]);
                params.push(arr[1]);
              }
            }
          }
        }
        if(searchTextMultipleLike.length > 0){ 
          columnLikeQuery.push(' ( '+searchTextMultipleLike.join(' or ')+ ' ) ');
        }       
      }

      if (columnLikeQuery.length > 0)
        columnwiseLikeQueryString = columnLikeQuery.join(' and ');

      if (ututils.isNotEmptyString(columnwiseLikeQueryString))
        if (ututils.isNotEmptyString(likeQuery)) {
          sql += ' and ( ' + columnwiseLikeQueryString + ' ) ';
        } else {
          sql += ' where ( ' + columnwiseLikeQueryString + ' )';
        }
    }
    
    if (ututils.isNotEmptyString(optionalFilterClause)) {
      if (likeQuery || columnwiseLikeQueryString) {
        sql += ' and ( ' + optionalFilterClause + ' ) ';
      } else {
        sql += ' where ( ' + optionalFilterClause + ' ) ';
      }
    }
    
    if (ututils.isNotEmptyString(groupbyClause)) {
      sql += ' GROUP BY ' + groupbyClause +' ';
    }

    if (ututils.isNotEmptyString(havingClause)) {
      sql += ' HAVING ' + havingClause +' ';
    }

    if (requestQuery.iSortingCols > 0 ||(orderbyClause &&  Object.keys(orderbyClause).length)) {
      sql += ' order by ';
      //If user defined sorting is present first sort according to this
      if(orderbyClause &&  Object.keys(orderbyClause).length){
        sql += ' '+orderbyClause.column;
        sql += ' '+orderbyClause.direction+' ';
      }
      if(requestQuery.iSortingCols > 0){
        if(orderbyClause &&  Object.keys(orderbyClause).length){
          sql += ' , ';
        }
        /*
         * Invoked when sorting in required.
         * Ordering of the result set is decided here
         */
        var sortColumnIndex = requestQuery.iSortCol_0;
        sql +=  sortColumns[sortColumnIndex];

        if (requestQuery.sSortDir_0 === 'asc') {
          sql += ' desc ';
        } else if (requestQuery.sSortDir_0 === 'desc') {
          sql += ' asc ';
        }
      }
    }

    if (requestQuery.iDisplayStart && requestQuery.iDisplayLength) {
      /*
       * Limit is put on the query.
       * Pagination is handled here.
       */
      sql += ' limit ' + requestQuery.iDisplayStart + ',' + requestQuery.iDisplayLength + ' ';
    }
    
    return {
      'dataTableSql' : sql,
      'bindParams'   : params
    };
  }

};
module.exports = datatable;
