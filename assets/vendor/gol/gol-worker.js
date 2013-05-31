importScripts('gol.js')

postMessage({ action: 'log', data: 'Starting' })

var DELAY = 100

var matrix = new GoL.Matrix(GoL.SIZE)

/*
// Simple Glider
matrix.spawn(5, 5)
matrix.spawn(6, 5)
matrix.spawn(7, 5)
matrix.spawn(7, 4)
matrix.spawn(6, 3)
*/

// Randomly fill entire matrix
for(var x = 0; x < GoL.SIZE; x++) {
	for(var y = 0; y < GoL.SIZE; y++) {
		if(Math.floor(Math.random() * 2) == 1) {
			matrix.spawn(x, y)
		}
	}
}

setInterval(function() {
	postMessage({ action: 'draw', data: matrix.ticktock() })
}, DELAY)
