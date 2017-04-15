var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kshaikh',
  database : 'INHOUSE'
});
module.exports.login = function(req, res) {
   console.log("entered controller");
   connection.query('SELECT * FROM login WHERE username = ? ', [ userid ], function (error, result, fields) {
      if(error) res.send({success: false, message: "INVALID credentials!"})
      else {
            if(result[0].password == password){
            console.log("user found " + result[0].password + result[0].username);
            res.send({success: true, message: "correct"})
            }
            else {
            console.log("incorrect password");
            res.send({success: false, message: "INVALID credentials!"});
            }
           }
     });
}
