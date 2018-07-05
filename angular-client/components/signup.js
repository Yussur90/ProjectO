var app = angular.module('mainApp');
app.component('signup', {
	templateUrl :'/templates/signup.html'
});
app.controller('signup' , function ($scope,$http ) {
	 var post = function (data) {
		var requestData = {
			method :'POST',
			url : '/user',
			data : data
		}
		$http(requestData).then(function () {
			console.log('success')
		},function () {
			console.log('error')
		});
	 }
// send the new user info to the server in order to save it in database
  $scope.done = function () {
  post({
		username : $scope.username ,
		email : $scope.email,
		password : $scope.password,
		Address:$scope.Address,
		Age:$scope.Age

  })

};
})
// disable sign up button untill user fill all fields correctly 
angular.module('mainApp').directive('disableBtn',
	function() {
		return {
			restrict : 'A',
			link : function(scope, element, attrs) {
				var $el = $(element);
				var submitBtn = $el.find('button[type="submit"]');
				var username = attrs.name;
				
				scope.$watch(username + '.$valid', function(val) {
					if (val) {
						submitBtn.removeAttr('disabled');
					} else {
						submitBtn.attr('disabled', 'disabled');
					}
				});
			}
		};
	})

