let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let Schema =mongoose.Schema;
mongoose.connect('mongodb://localhost:/PM-db' );
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
	status: String
});
var projectSchama = mongoose.Schema({
	projectName : String , 
	projectDisc : String,
	tasks:[taskSchema]
})
var userSchema = mongoose.Schema({
	username :{type : String ,required :true, index :{unique:true} },
	password :{type : String ,required :true}, 
	email :{type : String ,required :true}, 
	projects:[projectSchama]
	
});

var User = mongoose.model("User" , userSchema);
var Project = mongoose.model("Project" , projectSchama);
var Task = mongoose.model('Task', taskSchema);
var save = function (newUser , callback) {
	bcrypt.genSalt(10,function(err,salt){
		bcrypt.hash(newUser.password,salt,function(err,hash){
			newUser.password=hash;
			var user = new User(newUser);
			user.save(function (err , elem) {
				if(err){callback(err, null)}
					callback(null ,elem)
			})
			//newUser.save(callback);
		})
	})

}
var addTask = function(data, callback) {
	var task = new Task({description:data.description,assignedTo:data.assignedTo,complexity:data.complexity,status:data.status});
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

var deleteTask = function(taskDesc,userId,projectId ,callback) {
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
	Project.findById(projectId,function(err,proj){
		if(err){throw err}
			for(var i=0;i<proj.tasks.length;i++){
				if(proj.tasks[i].description === taskDesc.description){
					proj.tasks.splice(i,1)
					proj.save();
				}
			}
	})
	Task.deleteOne(taskDesc, function (err, data2) {
		if(err){
			callback(err, null);
		}
		callback(null, data2);
	});
}

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

var addProject = function(data, callback) {
	var project=new Project({projectName:data.projectName,projectDisc:data.projectDisc});
	User.findById(data.project_id, function (err, user) {
		if (err) return handleError(err);
		user.projects.push(project);
		user.save();
		project.save();
	});
}
var deleteProject = function(data,userId,callback){
	User.findById(userId,function(err,user){
		if(err){throw err}
			for(var i=0; i<user.projects.length;i++){
				if(user.projects[i]._id.toString() === data._id){
					user.projects.splice(i,1);
					user.save();
				}
			}
		})
	Project.deleteOne(data,function(err,elem){
		if(err){
			callback(err,null)
		}
		callback(null,elem)
	});
}

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
		callback(null,elem)
	});
}

module.exports.save = save;
module.exports.User = User;
module.exports.Project = Project;
module.exports.Task = Task;
module.exports.addTask = addTask;
module.exports.deleteTask = deleteTask;
module.exports.updateTask = updateTask;
module.exports.addProject = addProject;
module.exports.deleteProject = deleteProject;
module.exports.changeProject = changeProject;