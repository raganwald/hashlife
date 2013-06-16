(function (root, $, undefined) {
  
  var _ = root._ || require('underscore');
	
  var GRID_LINE_WIDTH = 1;
	
	var COLORS = {
		BACKGROUND: '#B1AC9E',
		GRID: '#3B3B49',
		LIFE: '#356AA0'
	}
  
  // TODO: Remove `_.decorator`
  //
  _.extend(QuadTree.prototype, {
    
    canvasSize: function () {
      return this.size() * Cell.size();
    },
    
    canvas: function () {
      this._canvases || (this._canvases = {});
      if (this._canvases[Cell.size()]) return this._canvases[Cell.size()];
      
      var childCanvases = _.invoke(this.children, 'canvas');
      var canvas = this._canvases[Cell.size()] = document.createElement('canvas');
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
  
  _.extend(Cell, {
    size: (function (size) {
      return function (optionalSize) {
    	  if (optionalSize != null) size = optionalSize;
    	  return size;
    	}
    })(8)
  });
  
  _.extend(Cell.prototype, {
    
    canvasSize: function () {
      return Cell.size();
    },
    
    canvas: function () {
        this._canvases || (this._canvases = {});
        if (this._canvases[Cell.size()]) return this._canvases[Cell.size()];
      
  	  else return this._canvases[Cell.size()] = _.tap(document.createElement('canvas'), function (canvas) {
  	    canvas.width = canvas.height = this.canvasSize();
        var context = canvas.getContext('2d');
    		context.clearRect(0, 0, Cell.size(), Cell.size());
    		context.fillStyle = (this.id === 0 ? COLORS.BACKGROUND : COLORS.LIFE);
    		context.fillRect(0, 0, Cell.size(), Cell.size());
      }.bind(this));
  	}
    
  });
  
})(this, jQuery);