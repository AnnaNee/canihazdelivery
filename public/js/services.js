var app = angular.module('init.services', []);

app.service('userLocationService', function() {
  var location = null;

  return {
    getLocation: function() {
      return location;
    },
    setLocation: function(value) {
      location = value;
    }
  }
});
