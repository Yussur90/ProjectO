const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const db = require('./database/index.js')
let session = require('express-session')

let app = express();

app.use(express.static(path.join(__dirname, '/angular-client/') ))
app.use(bodyParser.json());
app.use(session({secret:'this is secret'}))
app.post('/user',function(req , res){
	db.save(req.body , function (err , data) {
		if(err) {
			res.send(err)
		}
		res.send(data)
	})
	
})
  
app.get('/user', function (req , res) {
	db.User.find(function (err, data) {
		if(err) {
			res.send(err)
		}
		res.send(data)
	})
})
//Rpotes for projects

// Abdulhameed
app.post('/login', function (req , res) {
	console.log("reqbody",req.body)
	db.User.findOne({'username':req.body.username,'password':req.body.password},function (err, data) {
		if(err){res.send(err)}
		console.log("data",data)
		if(data !== null){
		req.session._id=data._id;
		req.session.username=data.username;
		req.session.password=data.password;
		console.log('session',req.session)

		}
		res.send(data)
	})
	// res.redirect('./templates/login.html');
})
app.get('/logout',function(req,res){
	console.log('out of destroy',req.session)
	if(req.session.username){
			req.session.destroy(function(err){
		if(err){
			res.negotiate(err);
		}
		console.log('after destroy',req.session)
		res.end('logged out')
		})
	}
	res.end('the user not logged in')

})
 
app.post('/project',function(req , res) {
	db.addProject(req.body , function (err , data) {
		if(err) {
			res.send(err)
		}
		res.send(data);
	})
});

app.get('/project', function(req,res) {
	db.Project.find({} ,function(err,data) {
		if(err) {
			res.send(err)
		}
		res.send(data)
	});
});

//Routes for Tasks :)
app.get('/tasks', function(req, res) {
	db.Task.find({}, function(err, data) {
		if(err) {
			res.send(err);
		}
		res.status(200).send(data);
	});
});

app.post('/tasks', function(req, res) {
	db.addTask(req.body, function(err, data) {
		if(err) {
			res.send("there is an error :(")
		}
		res.status(201).send("Here is your added task ", data);
	});
});
  
var port = 1596
app.listen(process.env.PORT || port , function () {
console.log("server is listening "+ port +" Port")
})
