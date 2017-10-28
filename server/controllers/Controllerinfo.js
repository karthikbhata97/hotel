var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kshaikh',
  database : 'hotel'
});
var info= ['student_name', 'usn', 'semester','activities','level'];

module.exports.feed = function(req,res) {
/*connection.query('SELECT ?? FROM records', [info], function(err,result){

});
*/
  res.send([{message: "Done."}]);
}

//ADD HOTELS
module.exports.addhotel = function(req, res) {
  console.log(req.body);
  // var val = ["name","rooms","pno","lane","city","pincode"];
  //var info = [req.body.name,req.body.rooms,req.body.pno,req.body.lane,req.body.city,req.body.pincode]
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

  connection.query('SELECT * FROM rooms WHERE (hid = (SELECT * FROM hotel WHERE (name = ? AND rooms>0)) AND booked = 0))',[req.body.hotelname],function(err,result){
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

//ROOM BOOKING
module.exports.bookroom = function(req,res) {
  console.log(req.body);
  connection.query('UPDATE rooms SET booked = 1 WHERE hid = ?',[req.body.hid],function(err,result){
    if(err) {
      console.log(err);
      res.send({success: false});
    }
    else{
      connection.query('INSERT INTO (hid,userid,rno,pid) hotelbook values(?,?,?,?) ',[req.body.hid,req.body.userid,req.body.rno,req.body.pid],function(err,result){
        if(err)
        {
          console.log(err);
          res.send({success: false});
        }
        else {
          res.send({success: true});
        }
      });
    }
  });
}
