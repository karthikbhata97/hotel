var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'honor4c',
  database : 'hotel'
});

module.exports.login = function(req, res) {
  console.log(req.body)
  connection.query('SELECT * FROM login WHERE (username = ?)', [ req.body.username ], function (error, result, fields) {
    if(error) console.log(error);
    else if(!result.length) {
      res.send({success: false, message: "INCORRECT USERNAME"})
    }
    else {
      if(result[0].password == req.body.password && result[0].active==1){
        res.send({success: true, message: "correct", type: result[0].type, username: req.body.username})
      }
      else if(result[0].active==0)
      {
        res.send({success: false, message: "LOGIN HAS BEEN FORBIDDEN BY ADMIN"})

      }
      else {
        res.send({success: false, message: "INVALID credentials!"});
      }
    }
  });
}

module.exports.signup = function(req, res) {
  // console.log(req.body);
  connection.query('INSERT INTO user(pno, name) value(?, ?)', [req.body.pno, req.body.name], function(err, result) {
    console.log(result);
    if(err) {
      console.log(err);
      res.send({"success": false, message: "Failed to update user database"});
    }
    else {
      // return populate_login(req.body.username, req.body.password, req.body.type, result.userid);
      connection.query('SELECT userid from user where (pno = ? AND name = ?)',[req.body.pno,req.body.name],function(err,result){
        console.log(result);
      connection.query('INSERT INTO login values (?,?,?,?) ',[req.body.username, req.body.password, req.body.type, result[0].userid], function (error, result, fields) {
        if(error) {
          console.log(error);
          res.send({success: false, message: "INVALID USERNAME OR USERNAME ALREADY EXISTS"});
        }
        else {
          res.send({success: true, message: "SUCCESSFULLY REGISTERED"});
        }
      });
      })
    }
  });
}

//
// var populate_login = function(username, password, type, id) {
//   connection.query('INSERT INTO login values (?,?,?,?) ',[username,password,type,id], function (error, result, fields) {
//     if(error) {
//       console.log(error);
//       res.send({success: false, message: "INVALID USERNAME OR USERNAME ALREADY EXISTS"});
//     }
//     else {
//       res.send({success: true, message: "SUCCESSFULLY REGISTERED"});
//     }
//   });
// }

module.exports.register = function(req, res) {
    connection.query("INSERT INTO login values(?, ?, ?, ?)", [req.body.username, req.body.password, req.body.type, req.body.id], function(err, result) {
      if(err) {
        console.log(err);
        res.send({"success": false, "message": "Failed to register"});
      }
      else {
        res.send({"success": true, "message": "Registered successfully"});
      }
    })
};
