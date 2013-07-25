(function (root, $, undefined) {
  
  var A = (root.allong && root.allong.es) || require('../vendor/allong.es.browser').allong.es;
	
	var COLORS = root.COLORS = {
		BACKGROUND: '#B1AC9E',
		GRID: '#3B3B49',
		LIFE: '#356AA0',
		HALFLIFE: '#828B9F'
	}
  
  A.extendClass(QuadTree, {
    
    canvasSize: function () {
      return this.size() * Cell.size();
    },
    
    canvas: function (color) {
      var CELLSIZE = Cell.size();
			if (color == null) color = COLORS.HALFLIFE;
      
      this._canvases || (this._canvases = {});
			this._canvases[color] || (this._canvases[color] = {});
      if (this._canvases[color][CELLSIZE]) return this._canvases[color][CELLSIZE];
      
      var LINEWIDTH = 0.2;
      var GRID_LINE_WIDTH = 1;
      
      if (CELLSIZE === 2) {
        LINEWIDTH = LINEWIDTH / 2;
        GRID_LINE_WIDTH = GRID_LINE_WIDTH / 2;
      }
      else if (CELLSIZE === 1) {
        LINEWIDTH = LINEWIDTH / 4;
        GRID_LINE_WIDTH = GRID_LINE_WIDTH / 4;
      }
      else if (CELLSIZE < 1) {
        LINEWIDTH = LINEWIDTH / 8;
        GRID_LINE_WIDTH = GRID_LINE_WIDTH / 8;
      }
      
      var childCanvases = A.map(this.children, function (child) { return child.canvas(color); });
      var canvas = this._canvases[color][CELLSIZE] = document.createElement('canvas');
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
        var source = child.canvas(color);
        context.drawImage(source, 0, 0, source.width, source.height, x * source.width, y * source.height, source.width, source.height);
      }
      copyChild(this.nw(), 0, 0);
      copyChild(this.ne(), 1, 0);
      copyChild(this.se(), 1, 1);
      copyChild(this.sw(), 0, 1);
    
      // draw grid
  		context.strokeStyle = COLORS.GRID;
      context.lineWidth = LINEWIDTH;
  
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
  
  A.extend(Cell, {
    size: (function (size) {
      return function (optionalSize) {
    	  if (optionalSize != null) size = optionalSize;
    	  return size;
    	}
    })(8)
  });
  
  A.extendClass(Cell, {
    
    canvasSize: function () {
      return Cell.size();
    },
    
    canvas: function (color) {
			if (color == null) color = COLORS.LIFE;
			this._canvases || (this._canvases = {});
			this._canvases[color] || (this._canvases[color] = {});
       
			if (this._canvases[color][Cell.size()])
				return this._canvases[color][Cell.size()];
      else return this._canvases[color][Cell.size()] = A.tap(document.createElement('canvas'), function (canvas) {
  	    canvas.width = canvas.height = this.canvasSize();
        var context = canvas.getContext('2d');
    		context.clearRect(0, 0, Cell.size(), Cell.size());
    		context.fillStyle = (this.id === 0 ? COLORS.BACKGROUND : color);
    		context.fillRect(0, 0, Cell.size(), Cell.size());
      }.bind(this));
  	}
    
  });
  
})(this, jQuery);