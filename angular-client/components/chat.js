var app = angular.module('mainTask' );// chat module

app.component('chat', {
	templateUrl: '/templates/chat.html'
});


app.controller('chatCtrl', function ($scope, $http,$window){
	// get all existing chat in db 
	$scope.chats=[];



	// var get = function () {
	// 	var response = {
	// 		method: 'GET',
	// 		url: '/chat'
	// 	};
	// 	$http(response).then(function (data){
	// 		$scope.chats.push(data.data)
	// 		console.log($scope.chats)
			
	// 	})};
   
 //    get();// get all existing chat once chat.html is rendered 

    //data parameter represent a chat details which required to be added to db (chat table) 
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

   $scope.get=function(){
	
	 	var response = {
			method: 'GET',
			url: '/chat'
		};
		$http(response).then(function (data){
			$scope.chatInfo=data.data
			console.log($scope.chats[0].data[4].content)
			
		})
		
	}

 	$scope.addChat = function()
 	{
 		var newChat = {
 			sendFrom: $scope.sendFrom,
 			sendTo: $scope.sendTo,
 			content: $scope.content
 		};

 		post(newChat,'/chat');
 		console.log("sent");
 		$window.location.reload();

 	}

 	// $scope.deletechat = function(data){
		// post({description: data},'/deleteMsg')
 	// 	$window.location.reload();//reload the page after press delete button

 	// }

    // to render the old data to update form 
 	// $scope.getoldMsgData = function(oldMsg)
 	// {
 	// 	//getting the old data to display them in update window using ng-model = 'oldMsg.fieldName'
 	// 	$scope.oldMsg = oldMsg;
 	// 	//saving the old data in a different object to send it to the server when updating chat info
 	// 	$scope.oldData = Object.assign({}, oldMsg);
 	// }

 	//same addNewchat function, but we need the old data to send them to server to update them and save the new changes
 // 	$scope.saveChanges = function(data) {

 // 		var updatedMsg = {
 // 			newData: {
 				
	//  			sendFrom: $scope.oldMsg.sendFrom,
	//  			sendTo: $scope.oldMsg.sendTo,
	//  			content: $scope.oldMsg.content
 // 			},
 // 			oldData: $scope.oldData
 // 		};
 // 		post(updatedMsg,'/updatechat');
 // 		$window.location.reload();

 // 	}
 // 	$scope.Back = function () {
	// $window.location.href = 'app2.html'
 		
 // 	}
 	
});
