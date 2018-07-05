

var app = angular.module('mainTask');// task module

//var app = angular.module('mainTask' ,[]);// task module


app.component('tasks', {
	templateUrl: '/templates/tasks.html'
});


app.controller('tasksCtrl', function ($scope, $http,$window){
	// get all existing tasks in db 

	 // $scope.CustomStyle = {};
  //    $scope.BColor = "Yellow";
       
  //       $scope.SetStyle = function () {
  //           $scope.CustomStyle = {
  //               'background-color': $scope.BColor,
  //           };
  //       }

	var get = function () {
		var response = {
			method: "GET",
			url: '/tasks'
		};
		$http(response).then(function (data){
			console.log(data)
			$scope.tasksInfo = data.data
		},function(){
			console.log('error')
		});
    };
    get();// get all existing tasks once tasks.html is rendered 

    //data parameter represent a task details which required to be added to db (tasks table) 
        var post = function (data,url) {
		var requestData = {
			method: 'POST',
			url: url,
			data: data
		};
		$http(requestData).then(function () {
			console.log('success')
		},function () {
			console.log('error')
		});	
 	}


 	$scope.addNewTask = function()
 	{
 		var newTask = {
 			description: $scope.description,
 			assignedTo: $scope.assignedTo,
 			complexity: $scope.complexity,
 			status: $scope.status,
 			priority:$scope.mypriority

 		};

 		post(newTask,'/tasks');
 		$window.location.reload();
 	}

 	$scope.deleteTask = function(data){
		post({description: data},'/deleteTask')
 		$window.location.reload();//reload the page after press delete button

 	}

    // to render the old data to update form 
 	$scope.getOldTaskData = function(oldTask)
 	{
 		//getting the old data to display them in update window using ng-model = 'oldTask.fieldName'
 		$scope.oldTask = oldTask;
 		//saving the old data in a different object to send it to the server when updating task info
 		$scope.oldData = Object.assign({}, oldTask);
 	}

 	//same addNewTask function, but we need the old data to send them to server to update them and save the new changes
 	$scope.saveChanges = function(data) {

 		var updattedTask = {
 			newData: {
 				description: $scope.oldTask.description,
	 			assignedTo: $scope.oldTask.assignedTo,
	 			complexity: $scope.oldTask.complexity,
	 			status: $scope.oldTask.status,
	 			priority:$scope.oldTask.priority
 			},
 			oldData: $scope.oldData
 		};
 		post(updattedTask,'/updateTask');
 		$window.location.reload();

 	}
 	$scope.Back = function () {
	$window.location.href = 'app2.html'
 		
 	}

 	var getAssignedto = function () {
		var response = {
			method: "GET",
			url: '/Assignedto'
		};
		$http(response).then(function (data){
			console.log("ma 3m yfoooot")
			console.log("paaaaaaaaaairsssss",data)
			$scope.team =data.data 
		},function(){
			console.log('error')
		});
    };

    $scope.Showassignedto = function () {
    	console.log("whatss wrongggggg")
	getAssignedto();
 		
 	}
});
