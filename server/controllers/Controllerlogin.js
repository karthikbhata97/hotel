var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'test'
});

module.exports.login = function(req, res) {
  console.log("login")
  connection.query('SELECT * FROM users WHERE username = ? ', [ req.body.username ], function (error, result, fields) {
    if(error) console.log(error);
    else if(!result.length) {
      res.send({success: false, message: "incorrect username"})
    }
    else {
      if(result[0].password == req.body.password){
        res.send({success: true, message: "correct"})
      }
      else {
        res.send({success: false, message: "INVALID credentials!"});
      }
    }
  });
}
