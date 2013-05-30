var loop = function(times, func) {
	for(var i = 0; i < times; i++) { func(i) }
}

var create_empty_matrix = function(size) {
	var matrix = new Array(size)
	
	loop(size, function(i) {
		matrix[i] = new Array(size)
		
		loop(size, function(j) {
				matrix[i][j] = GoL.EMPTY
		})
	})
	
	return matrix
}

var mod = function(num, div) {
	return (num + div) % div
}

GoL = {
	LIFE: 1,
	EMPTY: 0,
	
	Matrix: function(size)  {
		var that = this
		this.size = size
		
		var data = create_empty_matrix(size)
		var alternate = create_empty_matrix(size)
		
		this.at = function(x, y) {
			return data[x][y]
		}
		
		this.spawn = function(x, y) {
			data[x][y] = GoL.LIFE
		}
		
		this.kill = function(x, y) {
			data[x][y] = GoL.EMPTY
		}
		
		this.count_neighbors = function(x, y) {
			var count = 0
			
			count += count_life_at(x - 1, y - 1)
			count += count_life_at(x, y - 1)
			count += count_life_at(x + 1, y - 1)
			count += count_life_at(x - 1, y)
			count += count_life_at(x + 1, y)
			count += count_life_at(x - 1, y + 1)
			count += count_life_at(x, y + 1)
			count += count_life_at(x + 1, y + 1)
			
			return count
		}
		
		this.ticktock = function() {
			var delta = { spawned: [], killed: [] }
			
			each(function(x, y) {
				alternate[x][y] = ticktock(x, y)
				
				map_delta(delta.spawned, delta.killed, x, y)
			})
			
			swap_matricies()
			
			return delta
		}
		
		var map_delta = function(spawned, killed, x, y) {
			if(data[x][y] != alternate[x][y]) {
				
				var point = { x: x, y: y }
				
				if(alternate[x][y] == GoL.LIFE) {
					spawned.push(point)
				}
				else {
					killed.push(point)
				}
			}
		}
		
		var each = function(func) {
			loop(that.size, function(x) {
				loop(that.size, function(y) {
					func(x, y)
				})
			})
		}
		
		var swap_matricies = function() {
			var temp = data
			data = alternate
			alternate = temp
		}
		
		var ticktock = function(x, y) {
			var neighbor_count = that.count_neighbors(x, y)
			
			if(there_is_life_at(x, y)) {
				if(neighbor_count == 2 || neighbor_count == 3) {
					return GoL.LIFE
				}
				else {
					return GoL.EMPTY
				}
			}
			else {
				if(neighbor_count == 3) {
					return GoL.LIFE
				}
				else {
					return GoL.EMPTY
				}
			}
		}
		
		var there_is_life_at = function(x, y) {
			return that.at(mod(x, that.size), mod(y, that.size)) == GoL.LIFE
		}
		
		var count_life_at = function(x, y) {
			return there_is_life_at(x, y) ? 1 : 0
		}
	}
}