var mysql      = require('mysql');
var url        = require('url');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kshaikh',
  database : 'hotel'
});

//ADD HOTELS
module.exports.addhotel = function(req, res) {
  // console.log(req.body);
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
     res.send([{success: true,data:result}]);
   }
  });
}
//GET FOOD CONTENT

module.exports.getfood = function(req,res) {
var url_parts = url.parse(req.url, true);
var rid = url_parts.query.rid;
// console.log(rid);
  connection.query('SELECT * FROM food where rid = ?', [rid],function(err,result){
   if(err) {
     console.log(err);
     res.send({success: false});
   }
   else {
     console.log(result);
     res.send([{success: true,data:result}]);
   }
  });
}

//GET ROOMS BASED ON HOTEL NAME
module.exports.gethotelrooms = function(req,res) {
  var url_parts = url.parse(req.url, true);
  var hid = url_parts.query.hid;
  connection.query('SELECT * FROM rooms WHERE hid in (SELECT hid FROM hotel WHERE (hid = ? AND rooms>0)) AND booked = 0',[hid],function(err,result){
    if(err)
    {
      console.log(err);
      res.send({success: false});
    }
    else {
      console.log(result);
      res.send({success: true,data:result});
    }
});
}

//ADD ROOMS FOR HOTELS
module.exports.addhotelrooms = function(req,res) {
// console.log(req.body);
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

// ADD RESTAURANT

module.exports.addrest = function(req, res) {
  // console.log(req.body);
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
    //  console.log(result);
     res.send([{success: true,data:result}]);
   }
  });
}

module.exports.bookroom = function(req, res) {
  connection.query('UPDATE rooms SET booked = 1 WHERE rno = (SELECT MIN(rno) FROM rooms WHERE hid = ? AND booked = 0)', [req.body.hid], function(err, result) {
    if(err) {
      console.log(err);
      res.send({"success": false});
    }
    else {
      connection.query("INSERT INTO hotelbook(hid, userid, rno, pid) values(?, ?, ?, ?)", [req.body.hid, req.body.userid, result[0].rno, req.body.pid], function(err, result) {
        if(err) {
          console.log(err);
          res.send({"success": false});
        }
        else {
          res.send({"success": true, book: result});
        }
      })
    }
  });
}


module.exports.bookrest = function(req, res) {
  // console.log(req.body);
  console.log("here");
  res.end();
  // connection.query("INSERT INTO restbook(rid, userid, pid, foodname) values(?, ?, ?, ?)", [req.body.rid, req.body.userid, req.body.pid, req.body.foodname], function(err, result) {
  //   if(err) {
  //     console.log(err);
  //     res.send({"success": false});
  //   }
  //   else {
  //     res.send({"success": true, book: result});
  //   }
  // })
};
