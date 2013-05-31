// See: http://benjaminplee.github.io/HTLM5-GoL/

var message_actions = {
	log: function(message) {
	  console.group('Client Received Message');
	  console.log( message );
	  console.groupEnd();
	}
}

$(function() {
	var context = document.getElementById('source').getContext('2d');
	var pixels = Math.max($('#source').width(), $('#source').height());
	var canvas = new GoLCanvas(context, GoL.SIZE, pixels)
	canvas.clear()
	
	message_actions.draw = function(delta) {
		canvas.draw(delta)
	}

  var matrix = new GoL.Matrix(GoL.SIZE);

  // Randomly fill entire matrix
  for(var x = 0; x < GoL.SIZE; x++) {
  	for(var y = 0; y < GoL.SIZE; y++) {
  		if(Math.floor(Math.random() * 2) == 1) {
  			matrix.spawn(x, y)
  		}
  	}
  }
  
  canvas.draw(matrix.ticktock());
	
  // var worker = new Worker('./assets/js/gol-worker.js')
  // 
  // worker.addEventListener('message', function (event) {
  //  message_actions[event.data.action](event.data.data)
  // }, false);
})