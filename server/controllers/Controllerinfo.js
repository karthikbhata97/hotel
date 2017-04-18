var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kshaikh',
  database : 'INHOUSE'
});
var info= ['student_name', 'usn', 'semester','date','activities','level'];


module.export.feed = function(req,res,callback) {
connection.query('SELECT ?? FROM info',info,function(err,result){
  if(err) console.log(err +"khamar");
  var arr1 = [];
  for(var i=0; i<result.total_rows;i++) arr1.push(result.rows[i].doc);


});
}
module.exports.addrecord = function(req, res) {
  console.log(req.body);
  console.log(res);
  var info = {
    student_name: req.body.student_name,
    usn : req.body.usn,
    semester : req.body.semester,
    date :req.body.date,
    activities : req.body.activities,
    level : req.body.level

  }
  connection.query('INSERT INTO info SET ?', info, function(err,result){
   if(err) {
     console.log(err);
     res.send({success: false});
   }
   else {
    // console.log('Last record insert id:', result.insertId);
     res.send({success: true});
   }
  });
}
