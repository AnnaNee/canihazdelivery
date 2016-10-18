var app = angular.module("init", ["ngRoute"]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/main.html",
        controller: "InitController"
    });
}]);

app.controller('InitController', ['$scope', '$location',function($scope, $location) {

	$scope.user = {};
	var addressType;

	var placeSearch, autocomplete;
	var componentForm = {
	  street_number: 'short_name',
	  route: 'long_name',
	  locality: 'long_name',
	  administrative_area_level_1: 'short_name'
	};

	$scope.initAutocomplete =  function() {
	  autocomplete = new google.maps.places.Autocomplete(
	      (document.getElementById('autocomplete')),
		      {
		      	types: ['geocode']
		      }
	      );

	  autocomplete.addListener('place_changed', $scope.fillInAddress);
	}

	$scope.fillInAddress = function() {
	  var place = autocomplete.getPlace();

	  for (var component in componentForm) {
	    document.getElementById(component).value = '';
	    document.getElementById(component).disabled = false;
	  }

	  for (var i = 0; i < place.address_components.length; i++) {
	    addressType = place.address_components[i].types[0];
	    if (componentForm[addressType]) {
	      var val = place.address_components[i][componentForm[addressType]];
	      document.getElementById(addressType).value = val;

	      $scope.user.addressType = val;
	    }
	  }

	  console.log($scope.user.route);
	}

	$scope.checkAdress = function() {
		if ($scope.user.addressType === undefined || $scope.user.addressType == '') {
			alert('Please, fill in your adress.');
		} else {
			$location.path('/oi');
		}
	}

	$scope.geolocate = function() {
	  if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
	      var geolocation = {
	        lat: position.coords.latitude,
	        lng: position.coords.longitude
	      };
	      var circle = new google.maps.Circle({
	        center: geolocation,
	        radius: position.coords.accuracy
	      });
	      autocomplete.setBounds(circle.getBounds());
	    });
	  }
	}

	$scope.initAutocomplete();
}]);