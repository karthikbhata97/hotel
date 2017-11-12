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

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/', express.static(__dirname + '/client/'));



app.post('/login', Controllerlogin.login);
app.post('/signup', Controllerlogin.signup);
app.get('/foodfeed',Controllerinfo.getfood);
app.get('/getrestaurant', Controllerinfo.getrest);
app.post('/addhotel', Controllerinfo.addhotel);
app.get('/gethotels',Controllerinfo.gethotels);
app.post('/gethotelrooms',Controllerinfo.gethotelrooms);
app.post('/addhotelrooms',Controllerinfo.addhotelrooms);
app.post('/addrestaurant',Controllerinfo.addrest);
app.post('/bookrestaurant',Controllerinfo.bookrest);
app.post('/register',Controllerlogin.register);
app.post('/bookroom',Controllerinfo.bookroom);
app.post('/bookrestaurant',Controllerinfo.bookrest);
app.post('/addfood',Controllerinfo.addfood);
app.post('/changepassword',Controllerinfo.changepassword);
app.get('/userfeed',Controllerinfo.userfeed);
app.get('/hotelfeed',Controllerinfo.hotelfeed);
app.get('/restaurantfeed',Controllerinfo.restfeed);


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/main.html');
});
