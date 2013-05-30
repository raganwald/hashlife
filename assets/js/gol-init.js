// **** CONSTANTS ****

var DELAY = 60
var PLAY_AREA_ID = 'play_canvas'
var GRID_COLOR = '#3B3B49'
var SQUARE_COLORS = { 0: '#B1AC9E', 1: '#D44617', 2: '#7079BE'}
var WIDTH = 601
var HEIGHT = WIDTH
var GRID_WIDTH = 1
var UNITS = 40
var UNIT_TOTAL_WIDTH = ((WIDTH - GRID_WIDTH) / UNITS)
var UNIT_WIDTH = UNIT_TOTAL_WIDTH - GRID_WIDTH

var CHOSEN_PLAYER = 2

// **** GO ****

$(function() {
	var context = document.getElementById(PLAY_AREA_ID).getContext('2d')
	clear(context)
	
	var matrix = create_matrix(UNITS)
	
	var go = false
	
	setInterval(function() {
		if(go) {
			draw_matrix(context, matrix)
			matrix = gol(matrix)
		}
	}, DELAY)
	
	$('#glider').click(function() {
		pattern_glider(matrix)
		draw_matrix(context, matrix)
	})
	
	$('#thing').click(function() {
		pattern_thing(matrix)
		draw_matrix(context, matrix)
	})
	
	$('#next').click(function() {
		matrix = gol(matrix)
		draw_matrix(context, matrix)
	})
	
	$('#stop').click(function() {
		go = false
	})
	
	$('#go').click(function() {
		go = true
	})
	
	$('#reset').click(function() {
		matrix = create_matrix(UNITS)
		draw_matrix(context, matrix)
	})
		
	$('#randomreset').click(function() {
		matrix = random_matrix(UNITS)
		draw_matrix(context, matrix)
	})
})

// **** DRAWING ****

function draw_matrix(context, matrix) {
	mlp(UNITS, function(x, y) {
		draw_square(context, x, y, SQUARE_COLORS[matrix[x][y]])
	})
}

function draw_background(context) {
	context.clearRect(0, 0, WIDTH, HEIGHT)
	context.fillStyle = SQUARE_COLORS[0]
	context.fillRect(0, 0, WIDTH, HEIGHT);
}

function draw_grid(context) {
	context.strokeStyle = GRID_COLOR 
    context.lineWidth = 0.2
    
	context.beginPath()
	    
    lp(UNITS, function(i) {
    	context.moveTo(i * UNIT_TOTAL_WIDTH, 0)
		context.lineTo(i * UNIT_TOTAL_WIDTH, HEIGHT)
		
		context.moveTo(0, i * UNIT_TOTAL_WIDTH)
		context.lineTo(WIDTH, i * UNIT_TOTAL_WIDTH)
    })
	
	context.stroke()
    context.closePath()
}

function clear(context) {
	draw_background(context)
	draw_grid(context)
}

function draw_square(context, x, y, color) {
	context.fillStyle = color
	context.fillRect(x * UNIT_TOTAL_WIDTH, y * UNIT_TOTAL_WIDTH, UNIT_WIDTH, UNIT_WIDTH)
}

// **** GAME ****

function pattern_thing(matrix) {
	spawn(matrix, 20, 16)
	spawn(matrix, 22, 15)
	spawn(matrix, 22, 16)
	spawn(matrix, 24, 12)
	spawn(matrix, 24, 13)
	spawn(matrix, 24, 14)
	spawn(matrix, 26, 11)
	spawn(matrix, 26, 12)
	spawn(matrix, 26, 13)
	spawn(matrix, 27, 12)
}

function pattern_glider(matrix) {
	spawn(matrix, 5, 5)
	spawn(matrix, 6, 5)
	spawn(matrix, 7, 5)
	spawn(matrix, 7, 4)
	spawn(matrix, 6, 3)
}

function random_matrix(units) {
	var matrix = new Array(units)
	
	lp(units, function(i) {
		matrix[i] = new Array(units)
		
		lp(units, function(j) {
			matrix[i][j] = random_int(1) * CHOSEN_PLAYER
		})
	})
	
	return matrix
}

function create_matrix(units) {
	var matrix = new Array(units)
	
	lp(units, function(i) {
		matrix[i] = new Array(units)
		
		lp(units, function(j) {
			matrix[i][j] = 0
		})
	})
	
	return matrix
}

function gol(matrix) {
	var new_matrix = create_matrix(UNITS)
	
	mlp(UNITS, function(x, y) {
		var num_neighbors = count_neighbors(matrix, x, y)
		
		if(num_neighbors > 0) { console.log(x, y, num_neighbors) }

		if(is_populated(matrix, x, y)) {
			if(num_neighbors == 1 || num_neighbors == 0 || num_neighbors >= 4) {
				kill(new_matrix, x, y)
			}
			else {
				spawn(new_matrix, x, y)
			}
		}
		else {
			if(num_neighbors == 3) {
				spawn(new_matrix, x, y)
			}
		}
	})
	
	return new_matrix
}

function count_neighbors(matrix, x, y) {
	var count = 0
	
	mlp(3, function(x_offset, y_offset) {
		var x_mapped = (x + x_offset - 1 + UNITS) % UNITS
		var y_mapped = (y + y_offset - 1 + UNITS) % UNITS
		
		if((x_mapped != x || y_mapped != y) && is_populated(matrix, x_mapped, y_mapped)) {
			count++
		}
	})
	
	return count
}

function is_populated(matrix, x, y) {
	return matrix[x][y] == CHOSEN_PLAYER
}

function kill(matrix, x, y) {
	matrix[x][y] = 0
}

function spawn(matrix, x, y) {
	matrix[x][y] = CHOSEN_PLAYER
}

function lp(length, func) {
	for(var i = 0; i < length; i++) {
		func(i)
	}
}

function mlp(length, func) {
	for(var col = 0; col < length; col++) {
		for(var row = 0; row < length; row++) {
			func(col, row)
		}
	}
}

function random_int(max) {
	return Math.floor(Math.random() * (max + 1))
}