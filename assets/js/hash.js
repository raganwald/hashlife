(function ($, undefined) {
  var CACHE = {};
  var ID = 2;
	
  var GRID_LINE_WIDTH = 1;
	
	var COLORS = {
		BACKGROUND: '#B1AC9E',
		GRID: '#3B3B49',
		LIFE: '#356AA0'
	}
  
  function QuadTree (nw_ne_se_sw) {
    var container = CACHE[nw_ne_se_sw[0].id] || (CACHE[nw_ne_se_sw[0].id] = {});
        container = container[nw_ne_se_sw[1].id] || (container[nw_ne_se_sw[1].id] = {});
        container = container[nw_ne_se_sw[2].id] || (container[nw_ne_se_sw[2].id] = {});
    
    return container[nw_ne_se_sw[3].id] || (
      this.id = ++ID,
      this.children = nw_ne_se_sw,
      this._canvas = null,
      container[nw_ne_se_sw[3].id] = this
    );
  }
  
  QuadTree.prototype.canvas = function () {
    if (this._canvas) return this._canvas;
    var childCanvases = _.invoke(this.children, 'canvas');
    var canvas = this._canvas = document.createElement('canvas');
    var SIZE = canvas.width = canvas.height = childCanvases[0].width * 2;
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
    
    return this._canvas
  };
	
	function Cell (id) {
	  if (CACHE[id]) return CACHE[id];
    if (!(this instanceof Cell)) return new Cell(id);
	  this.id = id;
	  CACHE[id] = this;
	}
  
  function Leaf (nw_ne_se_sw) {
    var id = 2 + nw_ne_se_sw[0].id + (2 * nw_ne_se_sw[1].id) + (4 * nw_ne_se_sw[2].id) + (8 * nw_ne_se_sw[3].id);
    if (CACHE[id]) return CACHE[id];
    if (!(this instanceof Leaf)) return new Leaf(nw_ne_se_sw);
    this.id = id;
    this.children = nw_ne_se_sw;
    this._canvas = _.tap(document.createElement('canvas'), function (canvas) {
  
      var CELL_SIZE_PX = 8;
    	var SIZE = CELL_SIZE_PX * 2;
    	var SQUARE_OFFSET = ((SIZE - GRID_LINE_WIDTH) / 2);
    	var SQUARE_WIDTH = SQUARE_OFFSET - 2 * GRID_LINE_WIDTH;
	
      canvas.height = canvas.width = SIZE;
      var context = canvas.getContext('2d');
      
      // paint background
  		context.clearRect(0, 0, SIZE, SIZE)
  		context.fillStyle = COLORS.BACKGROUND
  		context.fillRect(0, 0, SIZE, SIZE);
  		
      // paint full squares
      context.fillStyle = COLORS.LIFE;
      function fillSquare (x, y) {
        context.fillRect(x * SQUARE_OFFSET + GRID_LINE_WIDTH, y * SQUARE_OFFSET + GRID_LINE_WIDTH, SQUARE_WIDTH, SQUARE_WIDTH)
      }
      if (nw_ne_se_sw[0] === Cell(1)) fillSquare(0, 0);
      if (nw_ne_se_sw[1] === Cell(1)) fillSquare(1, 0);
      if (nw_ne_se_sw[2] === Cell(1)) fillSquare(1, 1);
      if (nw_ne_se_sw[3] === Cell(1)) fillSquare(0, 1);
      
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
    
    });
    CACHE[id] = this;
  }
  
  Leaf.prototype.canvas = function () {
    return this._canvas;
  };
  
  function EmptySquare (generation) {
    if (generation === 0) return Cell(0);
    else if (generation === 1) return Leaf([Cell(0), Cell(0), Cell(0), Cell(0)]);
    else {
      var oneless = EmptySquare(generation - 1);
      return new QuadTree([oneless, oneless, oneless, oneless]);
    }
  }
  
  var LOG2 = Math.log(2);
  
  function MinimumSquareEnclosing(height, width) {
    var length = Math.max(height, width),
        log2 = Math.log(length)/LOG2,
        generation = Math.ceil(log2);
        
    return EmptySquare(generation);
  }
  
  _.extend(window, {
    QuadTree: QuadTree,
    Leaf: Leaf,
    Cell: Cell,
    EmptySquare: EmptySquare,
    MinimumSquareEnclosing: MinimumSquareEnclosing
  })
  
})(jQuery);