"use strict";
var util = require('util');
var Model = require('./model');

function Users() {
  Model.call(this, 'user');
}

util.inherits(Users, Model);

var User = new Users();
User.isAdminUser = function(email_id,cb){  
      var filters = {
          'email_id': email_id,
          'user_type':'admin'
      };
        User.select(filters, function (err, rows) {
          if (!err && rows) {
            cb(null, rows);
          } else {
            cb(err || new Error('no user found:'));
          }
        });
},
User.by_username = function(email_id,callback){
    var filters = {
        'email_id': email_id
    };
    User.select(filters, function (err, rows) {
      if (!err && rows) {
        cb(null, rows);
      } else {
        cb(err || new Error('no user found:'));
      }
    });
},
      /*
       * info post by cat id
       * @param 
       * 
       */
User.save=function(data,callback){
        var subquery = 'SET ';
        var values = [];
        console.log(typeof(data));
        if(data && typeof(data) ==  "object"){
          for(var index in data){
            if(index!='id')
            values.push(index +"='"+data[index]+"' ");
          }
          subquery += values.join(',');
          if(data.id && data.id!=''){
            subquery+=" where id='"+Number(data.id)+"'";
          }          
        }        
        var sql = 'INSERT INTO '+ table +' '+ subquery;
        //console.log("Query:"+sql);
        Db.query(
            sql,
            function selectCb(err, results) {
              if (!err) {
                return callback(results, null); 
              }
              else{
                return callback(null, err); 
              }            
             }
         ); 
},
User.all=function(filters,callback){
    	  Query.select(null,table,function(err,result){
    		  if(!err){
    			  callback(null,result);
    		  }else{
    			  callback(err,null);
    		  }
    		  
    	  });
      },
User.userbyid=function(id,callback){
    	  var filters = {'id':id};
    	  Query.select(filters,table,function(err,result){
    		  if(!err){
    			  callback(null,result);
    		  }else{
    			  callback(err,null);
    		  }
    		  
    	  });
};

module.exports = User;

/* ------------------------- Test Code ------------------------------ */
if (require.main === module) {
  (function() {
    function logcb(err, info) {
      console.log(err || info);
    }
    User.isAdminUser('admin@example.com',logcb)
  })();
}

