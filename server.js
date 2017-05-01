//REQUIRES
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var port = 3000;

var pg = require('pg');


//USES
app.use( express.static( 'public' ) );
app.use(bodyParser.urlencoded( { extended: true } ) );

//SET UP CONFIG FOR POOL
var config = {
  database:'todo_list',
  host:'localhost',
  port:5432,
  max:37
};//END CONFIG

//CREATE NEW POOL USING THIS CONFIG
var pool = new pg.Pool( config );

//SPIN UP FOLDER
app.listen( port, function() {
  console.log('server is up on:', port );
});

//BASE URL
app.get( '/', function( req, res ) {
  console.log( 'base URL hit' );
  res.sendFile( 'index.html' );
});

//ROUTES
app.get('/getTask', function( req, res ) {
  console.log('getting the list');

  //ARRAY OF LISTS
  var allTasks = [];

  //CONNECT TO DB
  pool.connect( function( err, connection, done ) {
    //CHECK IF THERE WAS AN ERROR
    if ( err ) {
      console.log( err );
      //RESPOND WITH PROBLEM!
      res.send( 400 );
    } else {
      console.log( 'connected to DB' );
      //SEND QUERY FOR ALL TASKS IN THE 'tasks' TABLE AND HOLD IT IN A VARIABLE (resultSet)
      var resultSet = connection.query('SELECT * from tasks');
      //CONVERT EACH ROW INTO AN OBJECT IN THE allTasks ARRAY
      //ON EACH ROW, PUSH THE ROW INTO allTasks
      resultSet.on( 'row', function( row ) {
        allTasks.push(row);
      }); //END ROW
      // ON END OF ROWS SEND ARRAY AS RESPONSE
      resultSet.on( 'end', function( end ) {
        //CLOSE CONNECTION TO RE-OPEN SPOT IN POOL
        done();
        // res.send array of allTasks
        res.send(allTasks);
      });
    }
  }); //END OF POOL
}); //END OF TASKS GET

//BEGIN ADDTASK ROUTE
app.post( '/addTask', function( req, res ) {

  console.log('hit addTask route');
  var newTask = req.body;
  console.log('received from client:', newTask);



  pool.connect( function( err, connection, done ) {
    if ( err ) {
      console.log( err );
      res.send( 400 );
    }
    else {
      console.log( 'connected to DB' );
        connection.query( "INSERT INTO  tasks (taskname, description) VALUES ($1, $2)", [req.body.taskname, req.body.description ]);
        // connection.query( "INSERT INTO  tasks SET description ='"+ req.body.description +" 'WHERE id =" + req.body.id);


        //CLOSING CONNECTION TO RE-OPEN SPOT IN POOL
      done();

    res.sendStatus( 200 );
  }//END ELSE STATEMENT
  });//END POOL
});//END ADDTASK POST

//BEGIN DELETE ROUTE
app.delete ('/deleteButton', function (req, res){
  pool.connect( function( err, connection, done ){
    //check if there was an Error
    if( err ){
      console.log( err );
      // respond with PROBLEM!
      res.send( 400 );
    }// end Error
    else{
      console.log('connected to db');
      connection.query( "DELETE from tasks where id = " + req.body.id );
      res.sendStatus(200);

      done ();
    } // end no error
  }); //end pool
});
