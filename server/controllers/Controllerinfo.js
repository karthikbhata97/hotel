var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'kshaikh',
  database : 'hotel'
});
var info= ['student_name', 'usn', 'semester','activities','level'];

module.exports.feed = function(req,res) {
/*connection.query('SELECT ?? FROM records', [info], function(err,result){
  if(err) {
    console.log("Error fetching data:");
    console.log(err);
    res.end();
  }
  else {
    console.log("Records: ");
    console.log(result);
    res.send(result)
  }
});
*/
  res.send([{message: "Done."}]);
}

module.exports.addhotel = function(req, res) {
  console.log(req.body);
  // var val = ["name","rooms","pno","lane","city","pincode"];



//  var info = [req.body.name,req.body.rooms,req.body.pno,req.body.lane,req.body.city,req.body.pincode]
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
