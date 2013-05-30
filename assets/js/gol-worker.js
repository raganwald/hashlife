importScripts('gol.js')

postMessage({ action: 'log', data: 'Starting' })

var SIZE = 500
var DELAY = 100

var matrix = new GoL.Matrix(SIZE)

/*
// Simple Glider
matrix.spawn(5, 5)
matrix.spawn(6, 5)
matrix.spawn(7, 5)
matrix.spawn(7, 4)
matrix.spawn(6, 3)
*/

// Randomly fill entire matrix
for(var x = 0; x < SIZE; x++) {
	for(var y = 0; y < SIZE; y++) {
		if(Math.floor(Math.random() * 2) == 1) {
			matrix.spawn(x, y)
		}
	}
}

setInterval(function() {
	postMessage({ action: 'draw', data: matrix.ticktock() })
}, DELAY)
