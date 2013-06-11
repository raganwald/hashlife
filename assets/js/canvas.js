(function (root, $, undefined) {
  
  var _ = root._ || require('underscore');
	
  var GRID_LINE_WIDTH = 1;
	
	var COLORS = {
		BACKGROUND: '#B1AC9E',
		GRID: '#3B3B49',
		LIFE: '#356AA0'
	}
  
  var CELL_SIZE_PX = 8;
  
  // TODO: Remove `_.decorator`
  //
  PaintsCanvas = _.decorator({
    canvasSize: function () {
      return this.children[0].canvasSize() * 2;
    },
    canvas: function () {
      this._canvases || (this._canvases = {});
      if (this._canvases[CELL_SIZE_PX]) return this._canvases[CELL_SIZE_PX];
      
      var childCanvases = _.invoke(this.children, 'canvas');
      var canvas = this._canvases[CELL_SIZE_PX] = document.createElement('canvas');
      var SIZE = canvas.width = canvas.height = this.canvasSize();
    	var SQUARE_OFFSET = ((SIZE - GRID_LINE_WIDTH) / 2);
    	var SQUARE_WIDTH = SQUARE_OFFSET - 2 * GRID_LINE_WIDTH;
      var context = canvas.getContext('2d');
    
      // paint background
  		context.clearRect(0, 0, SIZE, SIZE);
  		context.fillStyle = COLORS.BACKGROUND;
  		context.fillRect(0, 0, SIZE, SIZE);
		
      // paint children
      function copyChild (child, x, y) {
        var source = child.canvas();
        context.drawImage(source, 0, 0, source.width, source.height, x * source.width, y * source.height, source.width, source.height);
      }
      copyChild(this.children[0], 0, 0);
      copyChild(this.children[1], 1, 0);
      copyChild(this.children[2], 1, 1);
      copyChild(this.children[3], 0, 1);
    
      // draw grid
  		context.strokeStyle = COLORS.GRID 
      context.lineWidth = 0.2
  
  		context.beginPath()
    
    	context.moveTo(0, 0)
  		context.lineTo(0, SIZE)
  		context.moveTo(0, 0)
  		context.lineTo(SIZE, 0)
    
    	context.moveTo(SQUARE_OFFSET, 0)
  		context.lineTo(SQUARE_OFFSET, SIZE)
  		context.moveTo(0, SQUARE_OFFSET)
  		context.lineTo(SIZE, SQUARE_OFFSET)

  		context.stroke()
      context.closePath()
    
      return canvas;
    }
    
  });
  
  PaintsCanvas.call(QuadTree.prototype);
  
  Cell.prototype.canvasSize = function () {
    return CELL_SIZE_PX;
  }
	
	Cell.prototype.canvas = function () {
      this._canvases || (this._canvases = {});
      if (this._canvases[CELL_SIZE_PX]) return this._canvases[CELL_SIZE_PX];
      
	  else return this._canvases[CELL_SIZE_PX] = _.tap(document.createElement('canvas'), function (canvas) {
	    canvas.width = canvas.height = this.canvasSize();
      var context = canvas.getContext('2d');
  		context.clearRect(0, 0, CELL_SIZE_PX, CELL_SIZE_PX);
  		context.fillStyle = (this.id === 0 ? COLORS.BACKGROUND : COLORS.LIFE);
  		context.fillRect(0, 0, CELL_SIZE_PX, CELL_SIZE_PX);
    }.bind(this));
	}
	
	function CellSize (optionalSize) {
	  if (optionalSize != null) CELL_SIZE_PX = optionalSize;
	  return CELL_SIZE_PX;
	}
  
  _.extend(root, {
    CellSize: CellSize
  })
  
})(this, jQuery);