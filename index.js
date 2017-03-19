// Dependencies
var express = require('express');
 //OpenTok = require('opentok');

var mysql  = require('mysql');

var path = require("path");

var Pool = require('generic-pool').Pool;
// Verify that the API Key and API Secret are defined
/**var apiKey = 45782172,
    apiSecret = "ed22484afe3320ecc4382a14aeb4468f006d9408";
if (!apiKey || !apiSecret) {
  console.log('You must specify API_KEY and API_SECRET environment variables');
  process.exit(1);
}*/

// Initialize the express app
var app = express();

var db_config = {
  host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'grooveScehma'
};

var connection;


function cbError(err){
	 if(err) {                                     
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 200); 
    } else{
    	console.log('connected'); 
    }   
}

function cbTest(err){
	 console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();                        
    } 
    else {

      throw err;                                 
    }

  }



function handleDisconnect() {

 	 connection= mysql.createConnection(db_config); 
                                                  
	connection.connect(cbError);  
                        
 	 connection.on('error',cbTest);

   }




var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : '127.0.0.1',
  user            : 'root',
  password        : 'root',
  database        : 'grooveScehma'
});





function ExcuteQuery(query,cb){

	handleDisconnect();

	pool.getConnection(function(err,connection){

	if (err) throw err;
	 connection.query( query, function(err, rows) {
	 	if (err){
	 		console.log(err);
	 	}
	 	else{
	 		
	 		return cb(rows);
	 	}
	 	
	 });
	 
	 connection.release();

});
}


app.use(express.static(__dirname + '/public'));





// Initialize OpenTok
//var opentok = new OpenTok(apiKey, apiSecret);

// Create a session and store it in the express app
/**opentok.createSession(function(err, session) {
  if (err) throw err;
  app.set('sessionId', session.sessionId);
  // We will wait on starting the app until this is done
  init();
});**/

app.post('/login', function(req, res){



console.log("in login");

var query='Select  * from Users;'
		ExcuteQuery(query,function(rows){			
			
			res.json({
				records:rows
			});
		
			});
		});





app.post('/signup',function(req,res){

console.log('in signUp');


var query='Select  * from Users;'
		ExcuteQuery(query,function(rows){			
			
			res.json({
				records:rows
			});
		
			});

});




// Start the express app

var server=app.listen (8081,function(){
	var host=server.address().address;
	var port=server.address().port;
	 console.log("app is listenin");	

});
