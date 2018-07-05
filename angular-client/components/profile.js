var app = angular.module('mainProject' );

app.component('profile', {
	templateUrl :'/templates/profile.html'
});


app.controller('profile' ,[ '$scope','$http',function ($scope , $http) {
	//$scope.hanan = "https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg"
	//var hanan="https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg";
	//$scope.hanan =hanan;


	  var get = function () {
		var response={
			method:"GET",
			url : '/user'
		}
			$http(response).then(function (data) {
				$scope.user = data.data;
			},function () {
				console.log('error')
			});
	 }
	 get()


 $scope.selectFile= function(files){
	 var file = files[0];
   var fileReader = new FileReader();
   fileReader.readAsDataURL(file);
   fileReader.onload = function (e){
    var req ={
    method: 'POST',
    url:"/photo",
    headers: {
    'Content-Type': 'application/json'
      },
    data: {
       image:e.target.result
    }            
  }      
  $http(req).then(function(data){
    console.log('alo', data)
     // $window.location.reload()
     $scope.getPhoto()
  }, function(){
  });

   }
    }

$scope.init = function (){
console.log("gfiyuftru7fr") 
 
}

  
   $scope.getPhoto = function (){
    var req ={
    method: 'GET',
    url:"/photo",
    headers: {
    'Content-Type': 'application/json'
      }    
      } 
  $http(req).then(function(data){
    console.log('data from schema is here', data )
     
      $scope.hanan = data['data'].image
    
   
  }, function(){

  });

   }
    $scope.getPhoto()


  }])

