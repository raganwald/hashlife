function GoLCanvas(context, square_count, size) {
	this.context = context
	this.size = size
	this.square_count = square_count
	
	this.clear = function() {
		draw_background()
		//draw_grid()
	}
	
	this.draw = function(matrix) {
		draw_squares(matrix.spawned, COLORS.LIFE)
		draw_squares(matrix.killed, COLORS.BACKGROUND)
	}
	
	var draw_squares = function(squares, color) {
		for(var i = 0; i < squares.length; i++) {
			draw_square(squares[i].x, squares[i].y, color)
		}
	}
	
	var draw_square = function(x, y, color) {
		context.fillStyle = color
		context.fillRect(x * SQUARE_OFFSET + GRID_LINE_WIDTH, y * SQUARE_OFFSET + GRID_LINE_WIDTH, SQUARE_WIDTH, SQUARE_WIDTH)
	}
	
	var square_color = function(square_value) {
		if(square_value == 0) {
			return COLORS.BACKGROUND
		}
		else {
			return COLORS.LIFE
		}
	}
	
	var draw_background = function() {
		context.clearRect(0, 0, size, size)
		context.fillStyle = COLORS.BACKGROUND
		context.fillRect(0, 0, size, size);
	}
	
	var draw_grid = function() {
		context.strokeStyle = COLORS.GRID 
    context.lineWidth = 0.2
    
		context.beginPath()
	    
    for(var i = 0; i < square_count; i++) {
    	context.moveTo(i * SQUARE_OFFSET, 0)
			context.lineTo(i * SQUARE_OFFSET, size)
		
			context.moveTo(0, i * SQUARE_OFFSET)
			context.lineTo(size, i * SQUARE_OFFSET)
    }
	
		context.stroke()
    context.closePath()
	}
	
	var COLORS = {
		BACKGROUND: '#B1AC9E',
		GRID: '#3B3B49',
		LIFE: '#356AA0'
	}
	
	var GRID_LINE_WIDTH = 1
	var SQUARE_OFFSET = ((size - GRID_LINE_WIDTH) / square_count)
	var SQUARE_WIDTH = SQUARE_OFFSET - 2 * GRID_LINE_WIDTH
}