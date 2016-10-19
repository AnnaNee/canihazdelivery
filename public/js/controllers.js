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
	var userLat = $scope.userLocation[0];
	var userLng = $scope.userLocation[1];

	var placeLat = -23.5842987;
	var placeLng = -46.6834824;

	var locations = [
		['Your location', userLat, userLng],
		['Can I Haz Delivery?', placeLat, placeLng]
	];

	$scope.isDeliveryAvailable = function() {
		var toUser = new google.maps.LatLng(userLat, userLng);
		var fromPlace = new google.maps.LatLng(placeLat, placeLng);

		var calculatedDistance = google.maps.geometry.spherical.computeDistanceBetween(fromPlace, toUser);

		if (calculatedDistance > 4000) {
			return false;
		} else {
			return true;
	}

	function initMap() {
	  var map = new google.maps.Map(document.getElementById('map'), {
	    zoom: 4,
	    center: {lat: placeLat, lng: placeLng},
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	  });

	  var marker, i;

	  for (i = 0; i < locations.length; i++) {
	  	marker = new google.maps.Marker({
	  		map: map,
	  		position: new google.maps.LatLng(locations[i][1], locations[i][2])
	  	});
	  }

		map.setZoom(10);
		var miles = 4000;

    var circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      radius: miles
    });

    circle.bindTo('center', marker, 'position');
	}

	initMap();
}]);