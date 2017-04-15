var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kshaikh',
  database : 'INHOUSE'
});

module.exports.info = function(req, res) {
  var info = {  student_name: req.body.student_name , usn : req.body.usn , semester : req.body.semester , date : req.body.date , activities : req.body.activities , level : req.body.level }
  connection.query('INSERT INTO info SET ?', info, function(err,res){
   if(err) throw err;
   console.log('Last record insert id:', res.insertId);
   res.end();
  });
}
