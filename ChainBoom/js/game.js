var cellsCount = 12 * 12;

var chainBoom = angular.module('chainBoom', ['chainBoomServices', 'ngCookies']);

chainBoom.controller('chainBoomCtrl', function ($scope, explode, $cookies) {
	var expl = explode.init(12, 12, $scope);
	$scope.level = $cookies.level || 1;
	$scope.points = $cookies.points || 0;
	$scope.cells = expl.getMatrix();
	$scope.clickCell = expl.clickCell;
});