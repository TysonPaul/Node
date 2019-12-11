var http = require("http");
var express = require('express');
var app = express();
var cors= require("cors");
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(cors());
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'employeedb'
  });
   
  app.use( bodyParser.json() );       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });
 
  connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected with mysql database...')
  })

  app.get('/countries', function (req, res) { 
    console.log(res);
    connection.query('select * from countries', function (error, results, fields) {
     if (error) throw error;
     res.send(JSON.stringify(results));
   });
  }); 


  app.get('/states/:id', function (req, res) { 
    console.log(res);
    connection.query('select id, state_name from states where country_id=?',[req.params.id], function (error, results, fields) {
     if (error) throw error;
     res.send(JSON.stringify(results));
   });
  }); 


  app.get('/cities/:id', function (req, res) { 
    console.log(res);
    connection.query('select id, city_name from cities where state_id = ?',[req.params.id], function (error, results, fields) {
     if (error) throw error;
     res.send(JSON.stringify(results));
   });
  }); 

app.get('/employee', function (req, res) { 
  console.log(res);
  connection.query('select * from employee', function (error, results, fields) {
   if (error) throw error;
   res.send(JSON.stringify(results));
 });
}); 

app.get('/userdetails', function (req, res) { 

  console.log(res);
  connection.query('select * from userdetails', function (error, results, fields) {
   if (error) throw error;
   res.send(JSON.stringify(results));
 });
}); 


app.get('/getUser/:id', function (req, res) { 

  console.log(res);
  connection.query('select * from userdetails where id='+req.params.id, function (error, results, fields) {
   if (error) throw error;
   res.send(JSON.stringify(results));
 });
}); 




app.post('/userdetails', function (req, res) {
  var params  = req.body;
  connection.query('INSERT INTO userdetails SET ?', params, function (error, results, fields) {
    console.log(res,'testing');
   if (error) {throw error;
   //res.statusMessage = "data inserted!";
   //res.end(JSON.stringify(res));
    res.status(404).json({'message':'data inserted not !!'});
  }
    else{
    return res.status(200).json({'message':'data inserted !!'});
   }
   
 });
}); 



app.post('/postdetails', function (req, res) {
  var params  = req.body;
  console.log(params);
  connection.query('INSERT INTO angproject SET ?', params, function (error, results, fields) {
   
    console.log(error);
   if (error) {
    res.send({error: 'Duplicate Entry!', errno : '1062', errorresponse: error})
	
    res.status(1062).json({'message':'Data  already Exists !!'});
  }
    else{
    res.end(JSON.stringify(results));
   }
   
 });
}); 



app.post('/Emaildetails', function (req, res) {
  var params  = req.body;
  console.log(params);
  connection.query('select id,role from angproject where email=?',[req.body.email], function (error, results, fields) {
   if(error)throw error;
     
    res.end(JSON.stringify(results));
   console.log(results);
   
 });
});




app.put('/employee', function (req, res) {
  connection.query('UPDATE `employee` SET `name`="William",`team`="Sprint" where `id`= "4"', function (error, results, fields) {
    if (error) throw error;
    console.log('The response is: ', results);
    res.send(JSON.stringify(results));
 
 });
});


app.delete('/DelUser/:id', function (req, res) {
  connection.query('delete from userdetails where id='+req.params.id, function (error, results, fields) {
    if (error) throw error;
    console.log('The response is: ', results);
    res.send(JSON.stringify(results));
 
 });
});


// app.put('/updateUser', function (req, res) {
//   console.log("req.body>>",req.body);
//   connection.query('UPDATE `userdetails` SET `firstname`=?,`mobile`=?,`email`=?,`salary`=?,`age`=?,`gender`=?,`hobbies`=? where `id`=?',
//   [req.body.firstname,req.body.mobile,req.body.email,req.body.salary,req.body.age,req.body.gender,req.body.hobbies,req.body.id],
//   function (error, results, fields) {
//   if (error) throw error;
//     console.log('The response is: ', results);
//     res.send(JSON.stringify(results));
 
//  });
// });

//rest api to update record into mysql database
app.put('/updateUser', function (req, res) {
  connection.query('UPDATE `userdetails` SET `firstname`=?,`mobile`=?,`email`=?,`salary`=?,`age`=?,`gender`=?,`hobbies`=? where `id`=?', 
  [req.body.firstname,req.body.mobile, req.body.email,req.body.salary,req.body.age,req.body.gender,req.body.hobbies, req.body.id], function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
 });
});




/* For AngProject*/

app.get('/getemployee', function (req, res) { 
  console.log(res);
  // if(req.headers['app-author']=="Madhu"){
  //   res.send({ error: 'authentication error' });
  //  // console.log("authentication error");   
  // }else{

    connection.query('select * from angproject', function (error, results, fields) {
      if (error) throw error;
      res.send(JSON.stringify(results));
    });
 // }
 
}); 

app.get('/getUserForm/:id', function (req, res) { 

  console.log(res);
  connection.query('select * from angproject where id='+req.params.id, function (error, results, fields) {
   if (error) throw error;
   res.send(JSON.stringify(results));
 });
});

app.put('/postUser', function (req, res) {
  connection.query('UPDATE `angproject` SET `username`=?,`password`=?,`gender`=?,`mobile`=?,`hobbies`=?,`skills`=?,`country`=?,`state`=?,`city`=? where `email`=?', 
  [req.body.username,req.body.password, req.body.gender,req.body.mobile,req.body.hobbies,req.body.skills,req.body.country,req.body.state,req.body.city,req.body.email], function (error, results, fields) {
   if (error) throw error;
   res.end(JSON.stringify(results));
   console.log("response>>>",results);
 });
});

app.listen(8080); 