let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema =mongoose.Schema;


//mongoose.connect('mongodb://localhost:/PM-dbCD' );
// mongoose.connect('mongodb://admin:admin@ds249269.mlab.com:49269/pm-db');


//mongoose.connect('mongodb://localhost:/PM-db' );
mongoose.connect('mongodb://localhost/pm-db');

//mongoose.connect('mongodb://localhost:/PM-db' );

//mongoose.connect('mongodb://admin:admin@ds249269.mlab.com:49269/pm-db');




var db = mongoose.connection;
db.on('error' , function(){
	console.log('mongoose not Connected !')
})
db.once('open' , function () {
	console.log("mongoose conncted !")
})
var taskSchema = mongoose.Schema({
	description: String,
	assignedTo: String,
	complexity: Number,
	status: String,
	priority: String
});
var projectSchama = mongoose.Schema({
	projectName : String , 
	projectDisc : String,

	projectPair: [String],//pair is team 



	tasks:[taskSchema]//each project has many tasks
})

var imageSchema = mongoose.Schema({
image: String	
})


var userSchema = mongoose.Schema({
	username :{type : String ,required :true, index :{unique:true} },
	password :{type : String ,required :true}, 
	email :{type : String ,required :true}, 
	Address : {type : String , required :true},
	Age : {type : Number , required:true},
	projects:[projectSchama],//each user has many projects
	photo:imageSchema
	
});
var chatSchema = mongoose.Schema({
	sendFrom:{type:String,required:true},
	sendTo:{type:String,required:true},
	content:{type:String,required:true}
});
// define models for the schema
var User = mongoose.model("User" , userSchema);
var Image = mongoose.model("Image" , imageSchema);
var Project = mongoose.model("Project" , projectSchama);
var Task = mongoose.model('Task', taskSchema);
var Chat = mongoose.model('Chat',chatSchema)
// encrypt the password and save username and encrypted password
var save = function (newUser , callback) {
	bcrypt.genSalt(10,function(err,salt){
		bcrypt.hash(newUser.password,salt,function(err,hash){
			newUser.password=hash;
			var user = new User(newUser);
			user.save(function (err , elem) {
				if(err){callback(err, null)}
					callback(null ,elem)
			});
		});
	});

}

var addChat=function(data,callback){
	console.log('data')
var msg=new Chat({sendFrom:data.sendFrom,sendTo:data.sendTo,content:data.content});
msg.save(function(err){
	if(err){
		return handleError(err)
	}else{
		console.log("data saved")
	}
})

}


// }


// add the task to the task table, project table and to user table
var addTask = function(data, callback) {

	var task = new Task({description:data.description,assignedTo:data.assignedTo,complexity:data.complexity,status:data.status,priority:data.priority});
	task.save();



	User.findOne({username:data.assignedTo}, function (err, user) {
		if (err) return handleError(err);
		for(var i=0; i<user.projects.length ;i++){
			if(user.projects[i].projectName.toString() === data.projectName){
				Project.findOne({projectName:data.projectName},function(err,project){
					project.tasks.push(task);
					project.save();
				})
				user.projects[i].tasks.push(task);

				user.save();
				task.save();
			}
		}
	});

	User.findById(data.user_id, function (err, user) {
		if (err) return handleError(err);
		for(var i=0; i<user.projects.length ;i++){
			if(user.projects[i]._id.toString() === data.project_id){
				Project.findById(data.project_id,function(err,project){
					project.tasks.push(task);
					project.save();
				})
				user.projects[i].tasks.push(task);

				user.save();
				task.save();
			}
		}
		
		
	});
}
// delete the task from the task table, project table and user table
var deleteTask = function(taskDesc,userId,projectId ,callback) {
	//delete task from user table
	User.findById(userId,function(err,user){
		if(err){throw err}
			for(var i=0;i<user.projects.length ;i++){
				if(user.projects[i]._id.toString() === projectId){
					for(var j=0;j<user.projects[i].tasks.length;j++){
						if(user.projects[i].tasks[j].description === taskDesc.description){
							user.projects[i].tasks.splice(j,1);
							user.save();
						}
					}
				}
			}
	})
	//delete task from project table
	Project.findById(projectId,function(err,proj){
		if(err){throw err}
			for(var i=0;i<proj.tasks.length;i++){
				if(proj.tasks[i].description === taskDesc.description){
					proj.tasks.splice(i,1)
					proj.save();
				}
			}
	})
	//delete task from task table
	Task.deleteOne(taskDesc, function (err, data2) {
		if(err){
			callback(err, null);
		}
		callback(null, data2);
	});
}
// update the task from the task table, project table and user table
var updateTask = function(query, newData,userId,projectId , callback) {
	console.log('queryy',query)
	console.log('newData',newData)
	User.findById(userId,function(err,user){
				if(err){throw err}
			for(var i=0;i<user.projects.length ;i++){
				if(user.projects[i]._id.toString() === projectId){
					for(var j=0;j<user.projects[i].tasks.length;j++){
						if(user.projects[i].tasks[j]._id.toString() === query._id.toString()){
							user.projects[i].tasks[j].description=newData.description;
							user.projects[i].tasks[j].assignedTo=newData.assignedTo;
							user.projects[i].tasks[j].complexity=newData.complexity;
							user.projects[i].tasks[j].status=newData.status;

							user.save();
						}
					}
				}
			}
	})
	Project.findById(projectId,function(err,proj){
		if(err){throw err}
			for(var i=0;i<proj.tasks.length;i++){
				if(proj.tasks[i]._id.toString() === query._id.toString()){
					proj.tasks[i].description=newData.description;
					proj.tasks[i].assignedTo=newData.assignedTo;
					proj.tasks[i].complexity=newData.complexity;
					proj.tasks[i].status=newData.status;

					proj.save();
				}
			}
	})

	Task.findOneAndUpdate(query, newData, function(err, data2){
		if(err){
			callback(err, null);
		}
		callback(null, data2);
	});
}

// this function to add project to the user schema and project schema
var addProject = function(data, callback) {
	var project=new Project({projectName:data.projectName,projectDisc:data.projectDisc,projectPair:data.projectPair});

	for (var i=0;i<data.projectPair.length;i++){
		User.findOne({username:data.projectPair[i]},function (err, user) {

		if (err) return handleError(err);
		user.projects.push(project);
		user.save();
		project.save();
	})

	}

	User.findById(data.project_id, function (err, user) {
		if (err) return handleError(err);
		user.projects.push(project);
		user.save();
		project.save();
	});
}

var addimage = function(data, callback) {
	var imagee=new Image({image:data.image});
	User.findById(data.image_id, function (err, user) {
		if (err) return handleError(err);
		user.photo=imagee;
		user.save();
		imagee.save();
	});
}


// this function to delete project to the user schema and project schema
var deleteProject = function(data,userId,callback){
	User.findById(userId,function(err,user){
		if(err){throw err}
			for(var i=0; i<user.projects.length;i++){
				if(user.projects[i]._id.toString() === data._id){
					user.projects.splice(i,1);
					user.save();
				}
			}
		});

	Project.deleteOne(data,function(err,elem){
		if(err){
			callback(err,null)
		}
		//Task.delete
		callback(null,elem)
	});
}
// this function to update  project from the user table and project table 
var changeProject = function(query,condition,userId,callback){
	User.findById(userId, function (err, user) {
		if(err){
			throw err;
		}
		for(var i=0;i<user.projects.length;i++){
			if(query.projectName === user.projects[i].projectName && query.projectDisc === user.projects[i].projectDisc ){
				user.projects[i].projectName=condition.$set.projectName;
				user.projects[i].projectDisc=condition.$set.projectDisc;
				user.save();
			}
		}

		

	});
	Project.findOneAndUpdate(query,condition,function(err,elem){
		if(err){
			callback(err,null)
		}
		console.log('element',elem);
		callback(null,elem)
	});
}

module.exports.addChat=addChat;
module.exports.Chat=Chat;
module.exports.save = save;
module.exports.User = User;
module.exports.Project = Project;
module.exports.Task = Task;
module.exports.addTask = addTask;
module.exports.Image = Image;
module.exports.addimage = addimage;
module.exports.deleteTask = deleteTask;
module.exports.updateTask = updateTask;
module.exports.addProject = addProject;
module.exports.deleteProject = deleteProject;
module.exports.changeProject = changeProject;
