var User = require('./../models/user'); 
var crypt = require('../lib/crypt'); 

var util = require('util');

var main = {    
    /*
     * info : Login Admin System
     */
    auth:function(req,res,next){
      if(!req.session.adminuser && req.url!='/login/'){
        res.redirect('/login/');
      } else {
        next();
      } 
    },
    login:function(req,res){
      if(req.body.adminusername && req.body.adminusername.trim()!=''){
        var admin_user = req.body.adminusername.trim();
        if(req.body.adminpass && req.body.adminpass.trim()!=''){
          var admin_password = req.body.adminpass.trim();
          User.isAdminUser(admin_user,function(err,result){
            if(!err){
              if(crypt.isvalidpass(admin_password,result[0].password)){
              delete result[0].password;
              console.log('Logged in user '+result[0].email_id)
              req.session.adminuser = result[0];
              res.redirect('/');
              }
            }
          });
        }
      }
    }
    
};

module.exports = main;
