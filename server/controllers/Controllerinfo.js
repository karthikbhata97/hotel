var mysql      = require('mysql');
var url        = require('url');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'honor4c',
  database : 'hotel'
});


//manage USERS

module.exports.manageuser = function(req, res) {

  connection.query('update login set active = ? where username = ?',[ req.body.active, req.body.username ],function(err,result){
    if(err) {
      console.log(err);
      res.send({success: false});
    }
    else {
      console.log(result);
      res.send({success: true});
    }
})
}



//user list

module.exports.userlist = function(req, res) {

  connection.query('SELECT username,type,active FROM login where type!="admin"',function(err,result){
    if(err) {
      console.log(err);
      res.send({success: false});
    }
    else {
      console.log(result);
      res.send([{success: true,userlist:result}]);
    }
})
}


//ADD HOTELS
module.exports.addhotel = function(req, res) {
  //console.log(req.body);
  connection.query('INSERT  INTO hotel (name,pno,lane,city,pincode) values (?,?,?,?,?)',[req.body.name,req.body.pno,req.body.lane,req.body.city,req.body.pincode], function(err,result){
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
  connection.query('SELECT * FROM hotel',function(err,result){
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
  console.log(req.body);
  // var url_parts = url.parse(req.url, true);
  var hid = req.body.hid;
  var checkin = req.body.checkin.substring(0,10);
  var checkout = req.body.checkout.substring(0,10);
  // console.log(checkin.substring(0,10));
  // var checkout = req.body.checkout

  connection.query('SELECT * FROM rooms WHERE rno NOT IN (SELECT rno FROM hotelbook WHERE hid = ? AND ((checkin BETWEEN ? AND ?) AND (checkout BETWEEN ? AND ?) OR (checkin < ? AND checkout > ?))) AND hid = ?',[hid, checkin, checkout,checkin, checkout,checkin, checkout, hid],function(err,result){
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
  connection.query('SELECT id from login where (username = ? and type = ?) ',[req.body.username, "hotel"], function(err,result){
    if(err) {
      console.log(err);
      res.send({success: false});
    }
    else if(result.length == 0) {
      res.send({success: false, message: "Failed to fetch hotel data"});
    }
    else{
      var hid = result[0].id;
      connection.query('INSERT  INTO rooms (hid,booked,cost,persons,description) values (?,?,?,?,?)',[hid,0,req.body.cost, req.body.persons, req.body.description], function(err,result){
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
  connection.query('SELECT id from login where username= ? AND type= ?', [req.body.username,"user"], function(err, result) {
    if(err) {
      console.log(err);
      res.send({"success": false});
    }
    else if(result.length == 0) {
      res.send({success: false, message: "Failed to fetch user data"});
    }
    else{
      var userid = result[0].id;
      connection.query('SELECT wallet FROM user WHERE userid = ?', [userid], function(err, result) {
        if(err) {
          res.send({success: false, message: "Failed to fetch wallet data"});
        }
        else if(req.body.cost *req.body.quantity > result[0].wallet) {
          res.send({success: false, message: "Insufficient wallet money."});
        }
        else {
          connection.query('UPDATE user SET wallet = wallet - ? WHERE userid = ?', [req.body.cost * req.body.quantity, userid], function(err, result){
            if(err) {
              res.send({success: false, message: "Transaction failed."});
            }
            else {
              connection.query('INSERT INTO payment(amount, userid)  values(?, ?)', [req.body.cost * req.body.quantity, userid], function(err, result) {
                if(err) {
                  console.log(err);
                  res.send({"success": false});
                }
                else {
                  connection.query('SELECT MAX(pid) as pid FROM payment where userid = ?', [userid], function(err, result) {
                    if(err) {
                      console.log(err);
                      res.send({"success": false,"message":"booking failed"});
                    }
                    else if(result.length == 0) {
                      res.send({success: false, message: "Failed to fetch payment data"});
                    }
                    else  {
                      var pid = result[0].pid;
                      console.log(result);

                      var checkin = req.body.checkin.substring(0,10);
                      var checkout = req.body.checkout.substring(0,10);

                      connection.query("INSERT INTO hotelbook(hid, userid, rno, pid,checkin,checkout, quantity) values(?, ?, ?, ?, ?, ?, ?)", [req.body.hid, userid, req.body.rno, pid,checkin,checkout, req.body.quantity], function(err, result) {
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
          })
        }
      })
    }
  });
}

module.exports.bookrest = function(req, res) {
  console.log(req.body);
  console.log("here");
  var bookdate = req.body.bookdate.substring(0, 10);
  connection.query('SELECT id from login where username= ? AND type= ?', [req.body.username,"user"], function(err, result) {
    if(err) {
      console.log(err);
      res.send({"success": false});
    }
    else if(result.length == 0) {
      res.send({success: false, message: "Failed to fetch user data"});
    }
    else {
      var userid = result[0].id;

      connection.query('SELECT wallet FROM user WHERE userid = ?', [userid], function(err, result) {
        if(err) {
          res.send({success: false, message: "Failed to fetch wallet data"});
        }
        else if((req.body.cost * req.body.quantity) > result[0].wallet) {
          res.send({success: false, message: "Insufficient wallet money."});
        }
        else {
          connection.query('UPDATE user SET wallet = wallet - ? WHERE userid = ?', [req.body.cost * req.body.quantity, userid], function(err, result){
            if(err) {
              res.send({success: false, message: "Transaction failed."});
            }
            else {
              connection.query('INSERT INTO payment (amount, userid)  values(?, ?)', [req.body.cost * req.body.quantity, userid, bookdate], function(err, result) {
                if(err) {
                  console.log(err);
                  res.send({"success": false, message: "Failed to create payment"});
                }
                else {
                  connection.query('SELECT MAX(pid) as pid FROM payment where userid = ?', [userid], function(err, result) {
                    if(err) {
                      console.log(err);
                      res.send({"success": false});
                    }
                    else if(result.length == 0) {
                      res.send({success: false, message: "Failed to fetch restaurant data"});
                    }
                    else {
                      var pid = result[0].pid;
                      connection.query("INSERT INTO restbook(rid, userid, pid, foodname, bookdate, quantity) values(?, ?, ?, ?, ?, ?)", [req.body.rid, userid, pid, req.body.foodname,bookdate, req.body.quantity], function(err, result) {
                        if(err) {
                          console.log(err);
                          res.send({"success": false, message: "Failed to book"});
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
          })
        };
      });
    }
  });
};

module.exports.addfood = function(req, res) {
  connection.query('SELECT id from login where username = ? AND type = ?', [req.body.username,"restaurant"], function(err, result) {
    if(err) {
      console.log(err);
      res.send({"success": false, message: "Error in reading restaurant data"});
    }
    else if(result.length == 0) {
      res.send({success: false, message: "Failed to fetch restaurant data"});
    }
    else {
      var rid = result[0].id;
      console.log(rid);
      console.log(req.body);
      connection.query('INSERT INTO food VALUES(?, ?, ?, ?)', [rid, req.body.foodname, req.body.description, req.body.cost], function(err, result) {
        if(err) {
          console.log(err);
          res.send({"success": false, message: "Error adding food"});
        }
        else {
          res.send({"success": true, "message": "New food added"});
        }
      });
    }
  });
};

module.exports.userfeed = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var username = url_parts.query.username;
  connection.query('SELECT id from login where username = ? AND type = ?', [username,"user"], function(err, result) {
    if(err) {
      console.log(err);
      res.send([{"success": false, message: "Error in reading user data"}]);
    }
    else if(result.length == 0) {
      res.send([{success: false, message: "Failed to fetch user data"}]);
    }
    else {
      var userid = result[0].id;
      connection.query("SELECT * FROM hotelbook t1 INNER JOIN hotel t2 ON t1.hid = t2.hid INNER JOIN rooms t3 ON t1.rno = t3.rno AND t1.hid = t3.hid AND t3.hid = t2.hid WHERE t1.userid = ?", [userid], function(err, result) {
        if(err) {
          console.log(err);
          res.send([{"success": false, message: "Error in reading hotel booking data"}]);
        }
        else {
          var hotel = result;
          connection.query("SELECT * FROM restbook t1 INNER JOIN restaurant t2 ON t1.rid = t2.rid INNER JOIN food t3 ON t1.foodname = t3.foodname WHERE userid = ?", [userid], function(err, result) {
            if(err) {
              console.log(err);
              res.send([{"success": false, message: "Error in reading hotel booking data"}]);
            }
            else {
              var rest = result;
              connection.query("SELECT wallet FROM user WHERE userid = ?", [userid], function(err, result) {
                if(err){
                  console.log(err);
                  res.send([{"success": false, message: "Error in getting wallet amount"}]);
                }
                else{
                  var wallet = result[0].wallet;
                  res.send([{success: true, hotel: hotel, restaurant: rest, wallet:wallet}]);
                }
              });
            }
          })
        }
      })
    }
  })
};

module.exports.hotelfeed = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var username = url_parts.query.username;
  connection.query('SELECT id from login where username = ? AND type = ?', [username, "hotel"], function(err, result) {
    if(err) {
      console.log(err);
      res.send([{success: false, message: "Failed to run query"}])
    }
    else if (result.length==0) {
      res.send([{success: false, message: "Failed to fetch hotel details"}])
    }
    else {
      var hid = result[0].id;
      connection.query('SELECT * FROM rooms WHERE hid = ?', [hid], function(err, result) {
        if(err) {
          console.log(err);
          res.send([{success: false, message: "Failed to run query"}])
        }
        else {
          console.log(result);
          res.send([{success: true, data: result}]);
        }
      })
    }
  });
};

module.exports.restfeed = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var username = url_parts.query.username;
  connection.query('SELECT id from login where username = ? AND type = ?', [username, "restaurant"], function(err, result) {
    if(err) {
      console.log(err);
      res.send([{success: false, message: "Failed to run query"}])
    }
    else if (result.length==0) {
      res.send([{success: false, message: "Failed to fetch restaurant details"}])
    }
    else {
      var rid = result[0].id;
      connection.query('SELECT * FROM food WHERE rid = ?', [rid], function(err, result) {
        if(err) {
          console.log(err);
          res.send([{success: false, message: "Failed to run query"}])
        }
        else {
          res.send([{success: true, data: result}]);
        }
      })
    }
  });
};

module.exports.changepassword = function(req, res) {
  connection.query('SELECT password FROM login WHERE username = ?', [req.body.username], function(err, result) {
    if(err) {
      console.log(err);
      res.send({success: false, message: "Failed to run query"})
    }
    else if (result.length==0) {
      res.send({success: false, message: "Failed to fetch user details"})
    }
    else {
      if(result[0].password != req.body.password) {
        res.send({success: false, message: "Wrong password"})
      }
      else {
        connection.query('UPDATE login SET password = ? where username = ?', [req.body.newpassword, req.body.username], function(err, result) {
          if(err) {
            console.log(err);
            res.send({success: false, message: "Failed to change password"})
          }
          else {
            res.send({success: true, message: "Changed successfully"})
          }
        })
      }
    }
  });
};


module.exports.cancelfood = function(req, res) {
  connection.query('DELETE FROM restbook WHERE bid = ?', [req.body.bid], function(err, result) {
    if(err) {
      console.log(err);
      res.send({success: false, message: "Failed to cancel booking"})
    }
    else {
      connection.query('DELETE FROM payment WHERE pid = ?', [req.body.pid], function(err, result) {
        if(err) {
          console.log(err);
          res.send({success: false, message: "Failed to revoke payment"})
        }
        else {
          connection.query('UPDATE user SET wallet = wallet + ? where userid = ?', [req.body.cost, req.body.userid], function(err, result) {
            if(err) {
              console.log(err);
              res.send({success: false, message: "Failed to refund. Contact admin."})
            }
            else {
              res.send({success: true, message: "Successful."})
            }
          })
        }
      })
    }
  })
};


module.exports.cancelroom = function(req, res) {
  connection.query('DELETE FROM hotelbook WHERE bid = ?', [req.body.bid], function(err, result) {
    if(err) {
      console.log(err);
      res.send({success: false, message: "Failed to cancel booking"})
    }
    else {
      console.log(err);
      connection.query('DELETE FROM payment WHERE pid = ?', [req.body.pid], function(err, result) {
        if(err) {
          console.log(err);
          res.send({success: false, message: "Failed to revoke payment"})
        }
        else {
          connection.query('UPDATE user SET wallet = wallet + ? where userid = ?', [req.body.cost, req.body.userid], function(err, result) {
            if(err) {
              console.log(err);
              res.send({success: false, message: "Failed to refund. Contact admin."})
            }
            else {
              res.send({success: true, message: "Successful."})
            }
          })
        }
      })
    }
  })
};

module.exports.hoteltransaction = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var username = url_parts.query.username;
  connection.query('SELECT id FROM login WHERE username = ? AND type = ?', [username, "hotel"], function(err, result) {
    if(err) {
      console.log(err);
      res.send([{success: false, message: "Failed to run query"}])
    }
    else if (result.length==0) {
      res.send([{success: false, message: "Failed to fetchid"}])
    }
    else {
      var hid = result[0].id;
      connection.query('SELECT t2.name, t4.amount, t1.rno, t1.checkin, t1.checkout FROM hotelbook t1 INNER JOIN user t2 ON t1.userid = t2.userid INNER JOIN hotel t3 ON t1.hid = t3.hid INNER JOIN payment t4 ON t4.pid = t1.pid WHERE t1.hid = ?', [hid], function(err, result) {
        if(err) {
          console.log(err);
          res.send([{success: false, message: "Failed to fetch details"}])
        }
        else {
          res.send([{success: true, data: result}])
        }
      })
    }
  })
};


module.exports.resttransaction = function(req, res) {
  var url_parts = url.parse(req.url, true);
  var username = url_parts.query.username;
  connection.query('SELECT id FROM login WHERE username = ? AND type = ?', [username, "restaurant"], function(err, result) {
    if(err) {
      console.log(err);
      res.send([{success: false, message: "Failed to run query"}])
    }
    else if (result.length==0) {
      res.send([{success: false, message: "Failed to fetch id"}])
    }
    else {
      var rid = result[0].id;
      connection.query('SELECT t2.name, t1.foodname, t4.amount, t1.bookdate FROM restbook t1 INNER JOIN user t2 ON t1.userid = t2.userid INNER JOIN restaurant t3 ON t1.rid = t3.rid INNER JOIN payment t4 ON t1.pid = t4.pid WHERE t1.rid = ?', [rid], function(err, result) {
        if(err) {
          res.send({success: false, message: "Failed to fetch details"})
        }
        else {
          res.send([{success: true, data: result}]);
        }
      })
    }
  })
};

//add money
module.exports.addmoney = function(req, res) {
  console.log(req.body);

  connection.query('SELECT id FROM login WHERE username = ? AND type = ?', [req.body.username, "user"], function(err, result) {
    if(err) {
      console.log(err);
      res.send({success: false, message: "Failed to run query"})
    }
    else if (result.length==0) {
      res.send({success: false, message: "Failed to fetch id"})
    }
    else {
      var userid = result[0].id;
      connection.query('UPDATE user SET wallet = wallet + ?  where userid = ?', [req.body.amount, userid], function(err, result) {
        if(err) {
          console.log(err);
          res.send({success: false, message: "Failed to add money. Contact admin."})
        }
        else {
          res.send({success: true, message: "Successful."})
        }
      })
    }

  });
};
