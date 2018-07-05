const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database/index.js');
const session = require('express-session');
const app = express();
const expressValidator = require('express-validator');
const bcrypt =require('bcrypt');

var multer  = require('multer');

app.use(expressValidator())
app.use(express.static(path.join(__dirname, '/angular-client/') ));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(session({secret:'this is secret'}));

app.post('/chat',function(req , res){
	db.addChat(req.body , function (err , data) {
		if(err) {
			res.send(err)
		}
		res.send(data)
		console.log('data',data)
	})
	
});
app.get('/chat', function (req, res) {
    console.log('I received a GET request');
    db.User.findOne({'_id' : req.session._id},function (err, data) {
		if(err) {
			res.send(err)
		}
		// res.send(data)
		db.Chat.find({sendTo:data.username}, function(err, chat) {
    	// console.log('chat',chat)
        if(!err){
           res.json(chat);
        }

    });
	})
    

});



app.post('/photo',function(req,res){ 
db.User.findOne({'_id':req.session._id},function (err, data) {
		if(err){res.sendStatus(404)}
			if(data !== null){
				var imagee={};
                //console.log(typeof(req.body.projectPair),"paaaaaaairsss")
				imagee['image']=req.body.image;
				imagee['image_id']=req.session._id;
				db.addimage(imagee , function (err , data) {
					if(err) {
						res.send(err)
					}
					res.sendStatus(200);
				});	
			}
		});
	res.sendStatus(200);
// 	console.log('hello there!',req.body)
// var image = req.body.image
// 	var photo = new db.Image({
// 		image:image
// 	})
// 	photo.save(function(err,data){
// 		if(err){
// 			throw err
// 		}else{
// 			res.send(data)
// 		}
// 	})
})

// app.get('/photo',function(req,res){
// 	db.Image.find({'_id':req.session._id},function(err,data){
// 		if(err){
// 			throw err
// 		}else {
// 			res.send(data)
// 		}
// 	})

// })

app.get('/photo', function(req,res) {
	db.User.findOne({'_id':req.session._id},function (err, user) {
		if(err){res.send(err)}
			console.log(user.photo,"photoooo")
			res.status(200).send(user.photo);
	});
});



app.post('/user',function(req , res){
	db.save(req.body, function (err , data) {
		if(err) {
			res.send(err)
		}
		res.send(data)
	})
	
});
app.get('/user', function (req , res) {
	db.User.findOne({'_id' : req.session._id},function (err, data) {
		if(err) {
			res.send(err)
		}
		res.send(data)
	})
});
app.post('/login', function (req , res) {
	db.User.findOne({'username':req.body.username},function (err, data) {
		if(err){res.sendStatus(404)}
			if(data !== null){
				bcrypt.compare(req.body.password, data.password, function(err, resCrypt) {
					if(err){res.sendStatus(404)}
						if(resCrypt){
							req.session._id=data._id;
							req.session.username=data.username;
							req.session.password=data.password;
							res.sendStatus(200)
						}
					});

			}
		});
});


// if the session has username we are going to kill it, to logout 
app.get('/logout',function(req,res){
	if(req.session.username){
		req.session.destroy(function(err){
			if(err){
				res.negotiate(err);
			}
			res.end('logged out')
		});
	}
	res.end('the user not logged in')

});

// route to add new project for the user in this session 
app.post('/project',function(req , res) {

	//console.log(req.body)

	console.log(req.body)

	db.User.findOne({'_id':req.session._id},function (err, data) {
		if(err){res.sendStatus(404)}
			if(data !== null){
				var project={};
				var team=req.body.projectPair.split(",")
                //console.log(typeof(req.body.projectPair),"paaaaaaairsss")
				project['projectName']=req.body.projectName;
				project['projectDisc']=req.body.projectDisc;

				project['projectPair']=team;

				
				project['project_id']=req.session._id;
				db.addProject(project , function (err , data) {
					if(err) {
						res.send(err)
					}
					res.sendStatus(200);
				});	
			}
		});
	res.sendStatus(200);
});

// route to get all projects for user 
app.get('/project', function(req,res) {
	db.User.findOne({'_id':req.session._id},function (err, user) {
		if(err){res.send(err)}

			//console.log(user.projects,"prooooojectssssssssssss0")

			res.status(200).send(user.projects);
	});
});
let projectId;
let projectname;
app.post('/projectId',function(req,res){
	projectId=req.body.projectId;
	projectname=req.body.name;
})

// route to delete a specific project 
app.post('/deleteProj', function (req,res){
	var userId=req.session._id;
	db.deleteProject({_id:req.body._id},userId,function(err,data){
		if(err){
			res.send(err)
		}
		res.send(data)
	});
});

// route to update project 
app.post('/changeProj', function (req,res){
	var query = {projectName:req.body._id.projectName, projectDisc:req.body._id.projectDisc}
	var newProj = {projectName:req.body.projectName,projectDisc:req.body.projectDisc}
	db.changeProject(query,{$set:newProj},req.session._id,function(err,data){
		if(err){
			res.send(err)
		}
		res.send(data)
	});
});

//Routes for Tasks :)

app.get('/tasks', function(req, res) {
	db.User.findOne({'_id':req.session._id},function(err,user){
		if(err){
			res.send(err);
		}
		for(var i=0;i<user.projects.length;i++){
			if(user.projects[i]._id.toString() === projectId.toString()){
				res.status(200).send(user.projects[i].tasks);
			}
		}
	})
});
//hereeeeeee
app.get('/Assignedto', function(req, res) {
	db.User.findOne({'_id':req.session._id},function(err,user){
		if(err){
			res.send(err);
		}
		for(var i=0;i<user.projects.length;i++){
			if(user.projects[i]._id.toString() === projectId.toString()){
				res.status(200).send(user.projects[i].projectPair);
			}
		}
	})
});




app.get('/tasks/:description', function(req, res) {
	db.Task.findOne({description: req.params.description}, function(err, data) {
		if(err) {
			res.send(err);
		}
		res.status(200).send(data);
	});
});


app.post('/tasks', function(req, res) {
	console.log(projectId)
	db.User.findOne({'_id':req.session._id},function (err, data) {
		if(err){res.sendStatus(404)}
			if(data !== null){
				db.Project.findOne({_id:projectId},function(err,pro){
					if(err){res.sendStatus(404)}
						if(pro !== null){
							var task={};
							task['description']=req.body.description;
							task['assignedTo']=req.body.assignedTo;
							task['complexity']=req.body.complexity;
							task['status']=req.body.status;
							task['priority']=req.body.priority;


                            task['projectName']=projectname;
							task['project_id']=projectId;
							task['user_id']=req.session._id;
							db.addTask(task , function (err , data) {
								if(err) {
									res.send(err)
								}
								res.sendStatus(200);
							});	
						}
					});

			}
		});
	res.sendStatus(200);
});

app.post('/deleteTask', function(req, res){
		db.deleteTask({description: req.body.description},req.session._id,projectId, function (err, data) {
			if(err){
				res.send(err);
			}
			res.status(200).send(data);
		});
});

app.post('/updateTask', function(req, res){
	
	var query = req.body.oldData;
	var newData = req.body.newData;
	
	db.updateTask(query, newData,req.session._id,projectId, function(err, data){
		if(err) {
			res.send(err);
		}
		res.status(200).send(data);
	});
});

var port = 1596
app.listen(process.env.PORT || port , function () {
	console.log("server is listening "+ port +" Port")
});
