var chainBoomServices = angular.module('chainBoomServices', []);

chainBoomServices.factory('explode', function(){
	function Explode(rows, cols, $scope) {
		var _this = this;
		_this.$scope = $scope;
		_this.rows = rows;
		_this.columns = cols;
		_this.explodes = [];
		_this.cellsCount = rows * cols;
		_this.$scope.clicks = 5;
		_this.getMatrix = function() {
			var arr = [];
			for (var i = 0; i < _this.cellsCount/2; i++) {
				arr.push({hp:2});
			}
			for (var i = 0; i < _this.cellsCount/2 - 1; i++) {
				arr.push({});
			}
			arr.push({hp:1});
			return _this.cells = shuffleArray(arr);
		}
		_this.clickCell = function() {
			var i = this.$index;
			if (this.cell.hp == 1 || this.cell.hp == 2) {
				if (_this.$scope.clicks > 0 || this.cell.bullet) {
					this.cell.hp--;
					if (this.cell.hp == 0) {
						var cell = document.getElementsByClassName('cell')[i];
						_startExplode(cell.offsetTop, cell.offsetLeft, cell.offsetWidth, cell.offsetHeight, i);
						if (document.getElementsByClassName('alive').length < 2) {
							_this.$scope.cells = _this.getMatrix();
							_this.$scope.clicks = 5;
							var bulls = document.getElementsByClassName('bullet');
							while (bulls.length) {
								bulls[0].parentElement.removeChild(bulls[0]);
							}
						}
					}
				}
				if (this.cell.bullet && this.cell.interval) {
					this.cell.bullet.parentElement && this.cell.bullet.parentElement.removeChild(this.cell.bullet);
					clearTimeout(this.cell.interval);
					this.cell.interval = undefined;
					this.cell.bullet = undefined;
				}
				else {
					_this.$scope.clicks > 0 && _this.$scope.clicks--;
				}
			}
		}
		var _startExplode = function(top, left, w, h, index) {
			var div = document.createElement('div'),
				t = top + h/2,
				l = left + w/2;
			div.className = 'bullet';
			for (var i = 0; i < 4; i++){
				var el = div.cloneNode();
				document.getElementsByClassName('container')[0].appendChild(el);
				el.style.top = t - el.offsetHeight/2;
				el.style.left = l - el.offsetWidth/2;
				_this.explodes.push(new explodeClass(el, i, index));
				
			}
		}
		var explodeClass = function(el, dir, index){
			var _expl = this;
			_expl.el = el;
			_expl.dir = dir;
			_expl.index = index;
			_expl.cellsOnWay = [];
			var d = dirs[_expl.dir],
				r = _this.rows,
				incr = d.left ? d.left : d.top * r,
				i = _expl.index + incr,
				min = Math.floor(i/r)*r,
				max = Math.ceil(i/r)*r;
			_expl.prevVal = d.left ? _expl.el.offsetLeft : _expl.el.offsetTop;
			while (d.top && i > -1 && i < _this.cellsCount || 
					d.left == -1 && i > -1 && i >= min || 
					d.left == 1  && i < max) {
				_expl.cellsOnWay.push({ 
					cell: _this.cells[i],
					el: document.getElementsByClassName('cell')[i]
				});
				i += incr;
			}
			console.log(_expl.cellsOnWay.map(function (i, m) {return i.el;}));
			var move = setInterval(function(){
				
				var newTop = parseInt(_expl.el.style.top,10) + dirs[_expl.dir].top,
					newLeft = parseInt(_expl.el.style.left,10) + dirs[_expl.dir].left;
				_expl.el.style.top = newTop;
				_expl.el.style.left = newLeft;
				if (Math.abs(_expl.prevVal - (d.left ? newLeft : newTop)) >= 63) {
					if (_expl.cellsOnWay.length == 0) {
						clearTimeout(move);
						return _expl.el.parentElement && _expl.el.parentElement.removeChild(_expl.el);
					}
					_expl.prevVal = d.left ? _expl.prevVal + d.left*63 : _expl.prevVal + d.top*63;
					var item = _expl.cellsOnWay.splice(0,1)[0];
					item.cell.bullet = _expl.el;
					item.cell.interval = move;
					angular.element(item.el).triggerHandler('click');
				}
			}, 5);
		}
	}
	return {
		init: function(rows, cols, $scope) {
			return new Explode(rows, cols, $scope);
		}
	}
});

var dirs = [{top: 0, left: 1}, {top: 0, left: -1}, {top: 1, left: 0}, {top: -1, left: 0}];

var shuffleArray = function(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}