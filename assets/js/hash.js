(function ($, undefined) {
  var CACHE = {};
  var ID = 100;
	
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
  
  PaintsCanvas = _.decorator({
    canvas: function () {
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
    
      return this._canvas;
    }
    
  });
  
  PaintsCanvas.call(QuadTree.prototype);
  
  var CELL_SIZE_PX = 8;
	
	function Cell (id) {
	  if (CACHE[id]) return CACHE[id];
    if (!(this instanceof Cell)) return new Cell(id);
	  this.id = id;
	  this._canvas = _.tap(document.createElement('canvas'), function (canvas) {
	    canvas.width = canvas.height = CELL_SIZE_PX;
      var context = canvas.getContext('2d');
  		context.clearRect(0, 0, CELL_SIZE_PX, CELL_SIZE_PX)
  		context.fillStyle = (id === 0 ? COLORS.BACKGROUND : COLORS.LIFE);
  		context.fillRect(0, 0, CELL_SIZE_PX, CELL_SIZE_PX);
    });
	  CACHE[id] = this;
	}
	
	Cell.prototype.canvas = function () {
	  return this._canvas;
	}
  
  function Leaf (nw_ne_se_sw) {
    var id = 2 + nw_ne_se_sw[0].id + (2 * nw_ne_se_sw[1].id) + (4 * nw_ne_se_sw[2].id) + (8 * nw_ne_se_sw[3].id);
    if (CACHE[id]) return CACHE[id];
    if (!(this instanceof Leaf)) return new Leaf(nw_ne_se_sw);
    this.id = id;
    this.children = nw_ne_se_sw;
    this._canvas = null;
    CACHE[id] = this;
  }
  
  PaintsCanvas.call(Leaf.prototype);
  
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
    var length = Math.ceil(Math.max(height, width) / CELL_SIZE_PX),
        log2 = Math.log(length)/LOG2,
        generation = Math.ceil(log2);
        
    var qt = EmptySquare(generation),
        c = qt.canvas(),
        l = qt.width;
        
    console.log("qt", c.width, width);
        
    return qt;
  }
  
  _.extend(window, {
    QuadTree: QuadTree,
    Leaf: Leaf,
    Cell: Cell,
    EmptySquare: EmptySquare,
    MinimumSquareEnclosing: MinimumSquareEnclosing
  })
  
})(jQuery);