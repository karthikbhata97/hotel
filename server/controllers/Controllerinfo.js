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
  //console.log(req.body);
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
  connection.query('SELECT * FROM rooms WHERE hid = ?',[hid],function(err,result){
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
  console.log(req.body);
  connection.query('SELECT id from login where username= ? AND type= ?', [req.body.userid,"user"], function(err, result) {
    if(err) {
      console.log(err);
      res.send({"success": false});
    }
    else{
      req.body.userid = result[0].userid;
      connection.query('INSERT INTO payment(amount, userid)  values(?, ?)', [req.body.cost, req.body.userid], function(err, result) {
        if(err) {
          console.log(err);
          res.send({"success": false});
        }
        else {
          connection.query('UPDATE rooms SET booked = 1 WHERE rno = ?', [req.body.rno], function(err, result) {
            if(err) {
              console.log(err);
              res.send({"success": false});
            }
            else {
              connection.query('SELECT MAX(pid) as pid FROM payment where userid = ?', [req.body.userid], function(err, result) {
                if(err) {
                  console.log(err);
                  res.send({"success": false});
                }
                else  {
                  var pid = result[0].pid;
                  console.log(result);
                  connection.query('UPDATE rooms set booked = 1 where rno = ?', [req.body.rno], function(err, result) {
                    if(err) {
                      console.log(err);
                      res.send({"success": false});
                    }
                    else {
                      console.log(result);
                      connection.query("INSERT INTO hotelbook(hid, userid, rno, pid) values(?, ?, ?, ?)", [req.body.hid, req.body.userid, req.body.rno, pid], function(err, result) {
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
              });
            }
          });
        }
      });
    }
  });
}

module.exports.bookrest = function(req, res) {
  console.log(req.body);
  console.log("here");
  res.end();
  connection.query('SELECT id from login where username= ? AND type= ?', [req.body.userid,"user"], function(err, result) {
    if(err) {
      console.log(err);
      res.send({"success": false});
    }
    else {
      req.body.userid = result[0].id;
      connection.query('INSERT INTO payment(amount, userid)  values(?, ?)', [req.body.cost, req.body.userid], function(err, result) {
        if(err) {
          console.log(err);
          res.send({"success": false});
        }
        else {
          connection.query('SELECT MAX(pid) as pid FROM payment where userid = ?', [req.body.userid], function(err, result) {
            if(err) {
              console.log(err);
              res.send({"success": false});
            }
            else {
              var pid = result[0].pid;
              connection.query("INSERT INTO restbook(rid, userid, pid, foodname) values(?, ?, ?, ?)", [req.body.rid, req.body.userid, pid, req.body.foodname], function(err, result) {
                if(err) {
                  console.log(err);
                  res.send({"success": false});
                }
                else {
                  res.send({"success": true, "message": "Booked successfully"});
                }
              });
            }
          });
        }
      });
    }
  });
};

module.exports.addfood = function(req, res) {
  connection.query('SELECT id from login where username= ? AND type= ?', [req.body.userid,"restaurant"], function(err, result) {
    if(err) {
      console.log(err);
      res.send({"success": false});
    }
    else {
      req.body.userid = result[0].id;
      connection.query('INSERT INTO food(rid, foodname, description, cost)', [req.body.userid, req.body.foodname, req.body.description, req.body.cost], function(err, result) {
        if(err) {
          console.log(err);
          res.send({"success": false});
        }
        else {
          res.send({"success": true, "message": "New food added"});
        }
      });
    }
  });
};
