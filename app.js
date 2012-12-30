var express = require("express");
var app = express.createServer();
var config = require('./config/admin');
var util = require('util');
var main = require('./routes/main');

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
  require('./lib/admin')(app);   // view settings
  app.set('views', __dirname + '/views');
  var RedisStore = require('connect-redis')(express);
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "asd43g84webe88d38", store: new RedisStore }));
  
});

app.use(main.auth);
require('./routes')(app);
console.log("Server listening on port " + config.port+" url : "+config.host+":"+config.port );

app.listen(config.port);
