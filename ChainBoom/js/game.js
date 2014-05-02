var cellsCount = 12 * 12;

var chainBoom = angular.module('chainBoom', ['chainBoomServices', 'ngCookies']);

chainBoom.controller('chainBoomCtrl', function ($scope, explode, $cookies) {
	var expl = explode.init(12, 12, $scope);
	$scope.level = $cookies.level ? parseInt($cookies.level) : 1;
	$scope.points = $cookies.points ? parseInt($cookies.points) : 0;
	$scope.cells = expl.getMatrix(true);
	$scope.clickCell = expl.clickCell;
});