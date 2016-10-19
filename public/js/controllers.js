var app = angular.module("init", ["ngRoute", "init.services"]);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/main.html",
        controller: "InitController"
    })
    .when("/check", {
        templateUrl : "views/check.html",
        controller: "availabilityController"
    });
}]);

app.controller('InitController', ['$scope', '$location', 'userLocationService', function($scope, $location, userLocationService) {

	$scope.user = {};

	var addressType;
	$scope.userLat;
	$scope.userLng;
	$scope.location;

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

	  $scope.userLat = place.geometry.location.lat();
	  $scope.userLng = place.geometry.location.lng();
	  $scope.location = [$scope.userLng, $scope.userLat];

	  userLocationService.setLocation($scope.location);
	}

	$scope.checkAdress = function() {
		if ($scope.user.addressType === undefined || $scope.user.addressType == '') {
			alert('Please, fill in your adress.');
		} else {
			$location.path('/check');
		}
	}

	$scope.initAutocomplete();
}])

app.controller('availabilityController', ['$scope', '$location', 'userLocationService', function($scope, $location, userLocationService) {

	$scope.userLocation = userLocationService.getLocation();

	function initMap() {
	  var map = new google.maps.Map(document.getElementById('map'), {
	    zoom: 4,
	    center: {lat: -23.5842987, lng: -46.6834824},
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  });

		var marker = new google.maps.Marker({
		  map: map,
		  position: new google.maps.LatLng(-23.5842987, -46.6834824),
		  title: 'Can I Haz Delivery?'
		});

		map.setZoom(10);
		var miles = 2.48548;

    var circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      radius: miles * 1609.344 // equals 1 mile in radius
    });

    circle.bindTo('center', marker, 'position');
	}

	initMap();
}]);