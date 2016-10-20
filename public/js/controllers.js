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
	  $scope.location = [$scope.userLat, $scope.userLng];

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

	if (userLocationService.getLocation() === null) {
		$location.path('/');

	} else {

		$scope.userLocation = userLocationService.getLocation();
		$scope.userLat = $scope.userLocation[0];
		$scope.userLng = $scope.userLocation[1];

		$scope.placeLat = -23.5842987;
		$scope.placeLng = -46.6834824;

		var directionsDisplay;
		var directionsService = new google.maps.DirectionsService();
		var map;

		console.log('user:', $scope.userLat, $scope.userLng, 'place:', $scope.placeLat, $scope.placeLng)

		var locations = [
			['You\'re here!', $scope.userLat, $scope.userLng],
			['Can I Haz Delivery?', $scope.placeLat, $scope.placeLng]
		];

		$scope.isDeliveryAvailable = function() {
			var toUser = new google.maps.LatLng($scope.userLat, $scope.userLng);
			var fromPlace = new google.maps.LatLng($scope.placeLat, $scope.placeLng);

			var calculatedDistance = google.maps.geometry.spherical.computeDistanceBetween(fromPlace, toUser);

			if (calculatedDistance > 4000) {
				return false;
			} else {
				return true;
			}
		}

			var toUser = new google.maps.LatLng($scope.userLat, $scope.userLng);
			var fromPlace = new google.maps.LatLng($scope.placeLat, $scope.placeLng);

			var calculatedDistance = google.maps.geometry.spherical.computeDistanceBetween(fromPlace, toUser);
			console.log('Calculated distance:', calculatedDistance);


		function initMap() {
		  directionsDisplay = new google.maps.DirectionsRenderer();

		  map = new google.maps.Map(document.getElementById('map'), {
		    zoom: 4,
		    center: {lat: $scope.placeLat, lng: $scope.placeLng},
		    mapTypeId: google.maps.MapTypeId.ROADMAP
		  });

		  var marker, i;

		  for (i = 0; i < locations.length; i++) {
		  	marker = new google.maps.Marker({
		  		map: map,
		  		position: new google.maps.LatLng(locations[i][1], locations[i][2])
		  	});

				var infowindow = new google.maps.InfoWindow({
				  content: locations[i][0],
				  maxWidth: 160
				});

				infowindow.open(map, marker);
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
	    directionsDisplay.setMap(map);
		}

		$scope.calcRoute = function() {
			var selectedMode = document.getElementById("mode").value;

		  var request = {
		      origin: fromPlace,
		      destination: toUser,
		      travelMode: google.maps.TravelMode[selectedMode]
		  };

		  directionsService.route(request, function(response, status) {
		    if (status == google.maps.DirectionsStatus.OK) {
		      directionsDisplay.setDirections(response);
		      directionsDisplay.setPanel(document.getElementById("directionsPanel"));

		      cityCircle.setMap(null);
		    }
		  });
		}

		initMap();
	}
}]);