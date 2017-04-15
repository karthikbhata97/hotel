var mysql      = require('mysql');
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
var morgan = require('morgan');
var Controllerlogin = require('./server/controller/Controllerlogin');
var Controllerinfo = require('./server/controller/Controllerinfo');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kshaikh',
  database : 'INHOUSE'
});

connection.connect(function(error){
  if(error) throw error;
  else console.log("connection created");
});
var server=app.listen(3000,function(){
  console.log("running at port 3000");
})

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/', express.static(__dirname + '/client/'));


app.post('/login', Controllerlogin.login);
app.post('/info', Controllerinfo.info);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/login.html');
});







/*
var login= {  username: 'khamar', password: 'shaikh' };
var info = {  student_name: 'khamar' , usn : '1rv15cs071' , semester : 4 , date : '12-12-2017' , activities : 'you are a student' , level : 'college' }


connection.query('INSERT INTO login SET ?', login, function(err,res){
 if(err) throw err;
 console.log('Last record insert id:', res.insertId);
});

*/


/*
connection.query('INSERT INTO info SET ?', info, function(err,res){
 if(err) throw err;

  console.log('Last record insert id:', res.insertId);
});

*/
