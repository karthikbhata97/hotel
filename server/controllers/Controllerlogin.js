var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'honor4c',
  database : 'INHOUSE'
});

module.exports.login = function(req, res) {
  console.log("login")
  connection.query('SELECT * FROM login WHERE username = ? ', [ req.body.username ], function (error, result, fields) {
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
