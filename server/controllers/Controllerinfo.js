var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kshaikh',
  database : 'INHOUSE'
});
var info1= ['student_name', 'usn', 'semester','date','activities','level'];


module.exports.feed = function(req,res,callback) {
connection.query('SELECT ?? FROM info',[info1],function(err,result){
  if(err) console.log(err +"khamar");
  var arr1 = JSON.stringify(result);
  console.log(arr1);

});
}
module.exports.addrecord = function(req, res) {
  console.log(req.body);
  console.log(res);
  var info = {
    student_name: req.body.student_name,
    usn : req.body.usn,
    semester : req.body.semester,
    activities : req.body.activities,
    level : req.body.level
  }
  connection.query('INSERT INTO info SET ?', info, function(err,result){
   if(err) {
     console.log(err);
     res.send({success: false});
   }
   else {
     res.send({success: true});
   }
  });
}
