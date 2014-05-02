var cellsCount = 12 * 12;

var chainBoom = angular.module('chainBoom', ['chainBoomServices', 'ngCookies']);

chainBoom.controller('chainBoomCtrl', function ($scope, explode, $cookieStore) {
	var expl = explode.init(12, 12, $scope);
	$scope.level = $cookieStore.get('level') || 1;
	$scope.points = $cookieStore.get('points') || 0;
	$scope.cells = expl.getMatrix();
	$scope.clickCell = expl.clickCell;
});