var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kshaikh',
  database : 'hotel'
});

//ADD HOTELS
module.exports.addhotel = function(req, res) {
  console.log(req.body);
  connection.query('INSERT  INTO hotel (name,rooms,pno,lane,city,pincode) values (?,?,?,?,?,?)',[req.body.name,req.body.rooms,req.body.pno,req.body.lane,req.body.city,req.body.pincode], function(err,result){
   if(err) {
     console.log(err);
     res.send({success: false});
   }
   else {
     res.send({success: true});
   }
  });
}

//GET ALL HOTELS HAVING ROOMS MORE THAN 0
module.exports.gethotels = function(req,res) {
  connection.query('SELECT * FROM hotel WHERE (rooms > 0)',function(err,result){
   if(err) {
     console.log(err);
     res.send({success: false});
   }
   else {
     res.send({success: true,data:result});
   }
  });
}

//GET ROOMS BASED ON HOTEL NAME
module.exports.gethotelrooms = function(req,res) {

  connection.query('SELECT * FROM rooms WHERE hid in (SELECT hid FROM hotel WHERE (name = ? AND rooms>0) AND booked = 0))',[req.body.hotelname],function(err,result){
    if(err)
    {
      console.log(err);
      res.send({success: false});
    }
    else {
      res.send({success: true,data:result});
    }
});
}

//ADD ROOMS FOR HOTELS
module.exports.addhotelrooms = function(req,res) {
console.log(req.body);
connection.query('SELECT hid from hotel where (name = ?) ',[req.body.name], function(err,result){
  if(err) {
    console.log(err);
    res.send({success: false});
  }
  else{
  var hid = result[0].hid;
  connection.query('INSERT  INTO rooms (hid,booked,cost) values (?,?,?)',[hid,0,req.body.cost], function(err,result){
    if(err)
    {
      console.log(err);
      res.send({success: false});
    }
    else {
      res.send({success: true,data:result});
    }
   });
  }
  });
}

// ADD restaurant

module.exports.addrest = function(req, res) {
  console.log(req.body);
  connection.query('INSERT INTO restaurant(name,pno,lane,city,pincode) values (?,?,?,?,?)',[req.body.name,req.body.pno,req.body.lane,req.body.city,req.body.pincode], function(err,result){
   if(err) {
     console.log(err);
     res.send({success: false});
   }
   else {
     res.send({success: true});
   }
  });
}

module.exports.getrest = function(req,res) {
  connection.query('SELECT * FROM restaurant',function(err,result){
   if(err) {
     console.log(err);
     res.send({success: false});
   }
   else {
     res.send({success: true,data:result});
   }
  });
}

module.exports.bookhotel = function(req, res) {
  connection.query('UPDATE rooms SET booked = 1 WHERE rno = (SELECT MIN(rno) FROM rooms WHERE hid = ? AND booked = 0)', [req.body.hid], function(err, result) {
    if(err) {
      console.log(err);
      res.send({"success": false});
    }
    else {
      res.send({"success": true, book: result});
    }
  });
}
