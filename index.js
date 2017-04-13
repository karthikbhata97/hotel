var mysql      = require('mysql');
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kshaikh',
  database : 'bedrock'
});


var server=app.listen(3000,function(){
  console.log("running at port 3000");
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/login.html');
});
//app.post('/login',__dirname +'/controller/Controllerlogin.js');
