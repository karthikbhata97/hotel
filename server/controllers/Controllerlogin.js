var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kshaikh',
  database : 'hotel'
});

module.exports.login = function(req, res) {
  console.log(req.body)
  connection.query('SELECT * FROM login WHERE (username = ?)', [ req.body.username ], function (error, result, fields) {
    if(error) console.log(error);
    else if(!result.length) {
      res.send({success: false, message: "incorrect username"})
    }
    else {
      if(result[0].password == req.body.password){
        res.send({success: true, message: "correct" ,type: result[0].type})
      }
      else {
        res.send({success: false, message: "INVALID credentials!"});
      }
    }
  });
}

module.exports.signup = function(req, res) {
  console.log(req.body);
  connection.query('INSERT INTO user(pno, name) value(?, ?)', [req.body.pno, req.body.name], function(err, result) {
    if(err) {
      console.log(err);
      res.send({"success": false, message: "Failed to update user database"});
    }
    else {
      return populate_login(req.body.username, req.body.password, req.body.type, result[0].userid);
    }
  });
}


var populate_login = function(username, password, type, id) {
  connection.query('INSERT INTO login values (?,?,?) ',[req.body.username,req.body.password,req.body.type], function (error, result, fields) {
    if(error) {
      console.log(error);
      res.send({success: false, message: "INVALID USERNAME OR USERNAME ALREADY EXISTS"});
    }
    else {
      res.send({success: true, message: "SUCCESSFULLY REGISTERED"});
    }
  });
}
