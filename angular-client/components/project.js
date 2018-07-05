var app = angular.module('mainProject') 
app.component('project', {
	templateUrl :'/templates/project.html'
});
app.controller('project' , function ($scope,$http,$window ) {
 
 // use http GET request to fetch all projects from server   
 var get = function (url) {
    var response = {
		method:"GET",
		url : url
	}
		$http(response).then(function (res) {
			console.log(res.data)
			$scope.projects = res.data
		},function () {
			console.log('error')
		})
 }
 
// use http POST request to send a specific project details that user wanna to add it 
 var post = function (data,url) {
	var requestData = {
		method :'POST',
		url : url,
		data : data
	}
	$http(requestData).then(function () {
		console.log('success');
	},function () {
		console.log('error');
	})
 }

  
// this function will execute when user press on delete button 
//and use http POST request to send a specific project details that user wanna to delete it

$scope.deleteProject = function(project){
	   	
	get('/project')
	post(project,'/deleteProj')
    $window.location.reload();

}
  
// this function will execute when user press on update button to save the project 
// detials, to us it in changeProj   
$scope.sendproj = function(project) {
  $scope.proj = project;
  	
}

// this function will execute when user press on save button in fadeout screen 
//and use http POST request to send a specific project details that user wanna to change it

$scope.changeProj = function(projectId) {
	get('/project')
    post({
 	  projectName  : $scope.newprojName,
 	  projectDisc : $scope.newprojDesc,

 	  _id : $scope.proj
 	},'/changeProj');
  $window.location.reload();
}


// this function will execute when user press on add button
$scope.addproject = function () {
	post({
		projectName : $scope.projectName , 
		projectDisc : $scope.projectDisc,
		projectPair : $scope.projectPair
	},'/project');
  	get('/project');
  //	$window.location.href = 'app2.html';
  	$window.location.reload();
} 

// this function will execute when user press on logout button
$scope.logout = function () {
	$window.location.href = 'index.html';
	get('/logout')

}

// take the project id from project html file when the user click on tasks that related with specefic 
//project and redirect him to tasks page
$scope.viewProjectId = function (projectId,name) {
	// alert(projectName);
	// $window.projName=projectName;
	post({projectId:projectId,name:name},'/projectId')
	$window.location.href = 'app3.html'
}
  get('/project')


});


// Get the elements with class="column"
var elements = document.getElementsByClassName("column");

// Declare a loop variable
var i;

// List View
function listView() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "100%";
    }
}

// Grid View
function gridView() {
    for (i = 0; i < elements.length; i++) {
        elements[i].style.width = "50%";
    }
}
