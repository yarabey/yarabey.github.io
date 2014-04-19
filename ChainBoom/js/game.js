var cellsCount = 8 * 12;

var chainBoom = angular.module('chainBoom', ['chainBoomServices']);

chainBoom.controller('chainBoomCtrl', function ($scope, explode) {
	var expl = explode.init(8, 12, $scope);
	$scope.cells = expl.getMatrix();
	$scope.clickCell = expl.clickCell;
});