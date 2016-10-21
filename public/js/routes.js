var app = angular.module('init.routes', []);

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