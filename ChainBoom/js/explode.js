var chainBoomServices = angular.module('chainBoomServices', []);

chainBoomServices.factory('explode', function($cookieStore){
	function Explode(rows, cols, $scope) {
		var _this = this;
		_this.$scope = $scope;
		_this.rows = rows;
		_this.columns = cols;
		_this.explodes = [];
		_this.hps = [];
		_this.cellsCount = rows * cols;
		_this.$scope.clicks = 5;
		_this.width = parseInt(document.getElementsByClassName('container')[0].offsetWidth)/rows;
		_this.speed = _this.width/50*4;
		_this.getCustomLevel = function(){
			var level = customLevels[0],
				arr = [];
			for(var i=0; i<level.mesh.length;i++){
				for(var j=0; j<level.mesh[i].length;j++){
					arr.push({hp:level.mesh[i][j]});
				}
			}
			return _this.cells = arr;
		};
		_this.getMatrix = function() {
			var arr = [],
				maxAll = _this.cellsCount * 0.75,
				allCount = 0;
			levels.forEach(function(l){
				if (l.level <= _this.$scope.level) {
					_this.hps.push(l);
					// l.curMax = (l.curMax || l.max) + Math.floor((_this.$scope.level+1-l.level)/l.changeLevel)*l.changeVal;
					// l.curMin = (l.curMin || l.min) + Math.floor((_this.$scope.level+1-l.level)/l.changeLevel)*l.changeVal;
					// l.curMax = l.curMax < l.absMin ? l.absMin : l.curMax > l.absMax ? l.absMax : l.curMax;
					// l.curMin = l.curMin < l.absMin ? l.absMin : l.curMin > l.absMax ? l.absMax : l.curMin;
				}
			});
			_this.hps.forEach(function(h){
				//var dist = h.curMax*maxAll-h.min*maxAll;
				//h.count = Math.floor((Math.random()*h.min*maxAll)+(dist < 0 ? 0 : dist));
				var dist = h.count + (h.level > 1 ? h.dist*(_this.$scope.level-h.level) : h.dist*_this.$scope.level);
				h.count = h.level > 1 ?
							dist < h.max ? Math.floor((Math.random()*2)+dist-2) : Math.floor((Math.random()*2)+h.max-2) :
							dist > h.min ? Math.floor((Math.random()*2)+dist-2) : Math.floor((Math.random()*2)+h.min-2);
				allCount += h.count;
				for(var i = 0; i < h.count; i++){
					arr.push({hp:h.hp});
				}
			});
			for (var i = 0; i < _this.cellsCount-allCount; i++) {
				arr.push({});
			}
			// console.log(_this.hps);
			// var arr = [],
				// maxVal = _this.cellsCount / 2 - 4,
				// bRand = _this.$scope.level < 4 ? 0 : _this.$scope.level,
				// rRand = 1/_this.$scope.level * 40,
				// gRand = maxVal - bRand - rRand,
				// blue = Math.floor((Math.random()*bRand)+bRand),
				// red = Math.floor((Math.random()*rRand)+rRand),
				// green = Math.floor((Math.random()*gRand)+gRand),
				// empty = _this.cellsCount - blue - red - green;
			// for (var i = 0; i < blue; i++) {
				// arr.push({hp:3});
			// }
			// for (var i = 0; i < green; i++) {
				// arr.push({hp:2});
			// }
			// for (var i = 0; i < red; i++) {
				// arr.push({hp:1});
			// }
			// for (var i = 0; i < empty; i++) {
				// arr.push({});
			// }
			_this.cells = shuffleArray(arr);
			$cookieStore.put('points', _this.cells);
			return _this.cells;
		}
		_this.clickCell = function() {
			var i = this.$index;
			if (this.cell.hp > 0) {
				if (_this.$scope.clicks > 0 || this.cell.bullet) {
					this.cell.hp--;
					if (this.cell.hp == 0) {
						var cell = document.getElementsByClassName('cell')[i];
						_startExplode(cell.offsetTop, cell.offsetLeft, cell.offsetWidth, cell.offsetHeight, i);
						if (document.getElementsByClassName('alive').length < 2) {
							_this.$scope.points += _this.$scope.clicks * _this.$scope.level;
							_this.$scope.clicks += _this.$scope.level > 5 ? 5 : _this.$scope.level;
							_this.$scope.clicks = _this.$scope.clicks < 5 ? 5 : _this.$scope.clicks;
							_this.$scope.level++;
							$cookieStore.put('level', _this.$scope.level);
							$cookieStore.put('points', _this.$scope.points);
							_this.hps = [];
							_this.$scope.cells = _this.getMatrix();
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
		
		window.onresize = function(){
			_this.width = parseInt(document.getElementsByClassName('container')[0].offsetWidth)/rows;
			_this.speed = _this.width/50*4;
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
				min = Math.floor(i/(r))*r,
				max = Math.ceil(i/r)*r;
			_expl.prevVal = d.left ? _expl.el.offsetLeft : _expl.el.offsetTop;
			while (d.top && i > -1 && i < _this.cellsCount || 
					d.left == -1 && index%rows>0 && i > -1 && i >= min || 
					d.left == 1  && i < max) {
				_expl.cellsOnWay.push({ 
					cell: _this.cells[i],
					el: document.getElementsByClassName('cell')[i]
				});
				i += incr;
			}
			var move = setInterval(function(){
				var newTop = parseInt(_expl.el.style.top,10) + d.top*_this.speed,
					newLeft = parseInt(_expl.el.style.left,10) + d.left*_this.speed;
				newTop = d.top === -1 ? Math.floor(newTop) : Math.ceil(newTop);
				newLeft = d.left === -1 ? Math.floor(newLeft) : Math.ceil(newLeft);
				_expl.el.style.top = newTop;
				_expl.el.style.left = newLeft;
				if (Math.abs(_expl.prevVal - (d.left ? newLeft : newTop)) + _this.width/2 >= _this.width) {
					if (_expl.cellsOnWay.length == 0) {
						clearTimeout(move);
						return _expl.el.parentElement && _expl.el.parentElement.removeChild(_expl.el);
					}
					_expl.prevVal = d.left ? _expl.prevVal + d.left*_this.width : _expl.prevVal + d.top*_this.width;
					var item = _expl.cellsOnWay.splice(0,1)[0];
					item.cell.bullet = _expl.el;
					item.cell.interval = move;
					angular.element(item.el).triggerHandler('click');
				}
			}, 20);
		}
		var maxAll = _this.cellsCount * 0.75;
		var levels = [
			{level:1, hp:1, count: 0.4*maxAll, min: 15, max: maxAll, dist: -3}, 
			{level:1, hp:2, count: 0.35*maxAll, min: 40, max: maxAll, dist: -3},
			{level:3, hp:3, count: 2, max: 25, min: 2, dist: 2},
			{level:5, hp:4, count: 2, max: 15, min: 2, dist: 2}
		];
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

// var levels = [
	// {level:1, hp:1, max: 0.4, min: 0.37, changeLevel: 1, changeVal: -0.5, absMax: 0.4, absMin: 0.01}, 
	// {level:1, hp:2, max: 0.35, min: 0.32, changeLevel: 5, changeVal: -0.1, absMax: 0.35, absMin: 0.15},
	// {level:3, hp:3, max: 0.15, min: 0.13, changeLevel: 1, changeVal: 0.03, absMax: 0.2, absMin: 0.13},
	// {level:5, hp:4, max: 0.1, min: 0.08, changeLevel: 5, changeVal: 0.1, absMax: 0.2, absMin: 0.08}
// ];