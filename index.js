var mysql = require('mysql'),
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  Controllerlogin = require('./server/controllers/Controllerlogin'),
  Controllerinfo = require('./server/controllers/Controllerinfo');


var server=app.listen(3000,function(){
  console.log("running at port 3000");
})

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/', express.static(__dirname + '/client/'));

app.get('/api/userfeed', function(req, res) {
 var callback = function(arr1) {
    res.send(JSON.stringify(arr1));
  }
  Controllerinfo.feed(req, res, callback);
});

app.post('/login', Controllerlogin.login);
app.post('/addrecord', Controllerinfo.addrecord);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/main.html');
});
