var cellsCount = 12 * 12;

var chainBoom = angular.module('chainBoom', ['chainBoomServices', 'ngCookies']);

chainBoom.controller('chainBoomCtrl', function ($scope, explode, $cookieStore) {
	console.log($cookieStore.get('test'));
	$cookieStore.put('test', 'cookie - testval');
	var expl = explode.init(12, 12, $scope);
	$scope.level = 1;
	$scope.points = 0;
	$scope.cells = expl.getMatrix();
	$scope.clickCell = expl.clickCell;
});